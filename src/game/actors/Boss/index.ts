import { Scene } from 'phaser';
import { State, BossState } from './state';
import type { Player } from '../Player/index';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { EventBus } from '../../EventBus';
import { AttackHitboxManager, AttackHitboxConfig } from '../../components/AttackHitbox';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getBossAnimationConfigs } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';

export class Boss extends Actor {
  private state: State;
  private playerRef: Player;
  private deltaTime: number = 0;
  private bossSpeed: number = 120;
  private chargeSpeed: number = 350; // Faster speed for attack_2
  private _moveDirection: number; // -1 for left, 1 for right
  private isCharging: boolean = false;

  private readonly DETECTION_RANGE = 600;
  private attackTimer: number = 0;
  private readonly ATTACK_INTERVAL = 3000; // Attack every 3 seconds
  public debugEnabled: boolean = true;

  public attackHitboxManager: AttackHitboxManager;

  private attackConfigs: { [key: string]: AttackHitboxConfig } = {
    'boss_attack_2': {
      width: 200,
      height: 50,
      offsetX_right: 80,
      offsetX_left: -80,
      offsetY: -65,
      duration: 800,
      damage: 15,
      attackerId: 'boss'
    }
  };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    const actorConfig: ActorConfig = {
      scale: 4,
      bodyWidth: 60,
      bodyHeight: 80,
      centerXLeft: 0.5,
      centerXRight: 0.5,
      centerY: 1,
      health: 300,
      attackPower: 20,
      bodyOffsetY: 30,
      knockbackForce: 200,
      deathAnimationKey: 'boss_death',
      hitAnimationKey: 'boss_hit'
    };

    super(scene, x, y, 'bossAtlas', 'Idle 0', actorConfig);

    this.playerRef = playerRef;
    this.sprite.setDepth(0);
    this.attackHitboxManager = new AttackHitboxManager(scene);
  }

  private createBossAnimations(scene: Scene) {
    const animationManager = new AnimationHelper(scene);
    const animationConfigs = getBossAnimationConfigs();
    animationManager.createAnimations(animationConfigs);
  }

  private createAttackHitbox(attackType: string) {
    const config = this.attackConfigs[attackType];
    if (!config) return;

    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.createAttackHitbox(
      this.sprite.x,
      this.sprite.y,
      config,
      direction
    );
  }

  private addBossAnimationListeners() {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (animation.key === 'boss_attack_2_prep') {
        this.sprite.play('boss_attack_2');
        this.createAttackHitbox('boss_attack_2');
        this.isCharging = true;
      } else if (animation.key === 'boss_attack_2') {
        this.sprite.play('boss_attack_2_end');
        this.isCharging = false;
      } else if (animation.key === 'boss_attack_2_end') {
        this.sprite.play('boss_idle');
        this.isCharging = false;
      } else if (animation.key === 'boss_death') {
        this.sprite.anims.stop();
      }
    });
  }

  private getDistanceToPlayer(): number {
    return Math.abs(this.playerRef.sprite.x - this.sprite.x);
  }

  private getDirectionToPlayer(): 'left' | 'right' {
    return this.playerRef.sprite.x < this.sprite.x ? 'left' : 'right';
  }

  private shouldAttack(delta: number): boolean {
    this.attackTimer += delta;
    if (this.attackTimer >= this.ATTACK_INTERVAL) {
      this.attackTimer = 0;
      return Math.random() < 0.5; // 50% chance to attack
    }
    return false;
  }

  public handleMovement() {
    // Don't handle normal movement during attack animations
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (currentAnim && (
        currentAnim === 'boss_attack_2_prep' ||
        currentAnim === 'boss_attack_2' ||
        currentAnim === 'boss_attack_2_end')) {
      return;
    }

    const directionToPlayer = this.getDirectionToPlayer();
    const bossX = this.sprite.x;
    const playerX = this.playerRef.sprite.x;
    const rangeMin = playerX - this.DETECTION_RANGE;
    const rangeMax = playerX + this.DETECTION_RANGE;

    // Track current direction (left/right) for boss
    if (this._moveDirection === undefined) {
      this._moveDirection = directionToPlayer === 'left' ? -1 : 1;
    }

    // If boss is outside the allowed range, force move toward player
    if (bossX < rangeMin) {
      this._moveDirection = 1;
    } else if (bossX > rangeMax) {
      this._moveDirection = -1;
    } else {
      // Occasionally (0.5% chance per update) change direction randomly
      if (Math.random() < 0.005) {
        this._moveDirection *= -1;
      }
    }

    // Move boss in current direction, but stay within range
    if ((this._moveDirection === -1 && bossX > rangeMin) || (this._moveDirection === 1 && bossX < rangeMax)) {
      this.sprite.setVelocityX(this._moveDirection * this.bossSpeed);
      setSpriteDirection(this.sprite, this._moveDirection === -1 ? 'left' : 'right', this.adjustForCenterOffset);
      this.sprite.play('boss_move', true);
    } else {
      // Stay idle if can't move further in that direction
      this.sprite.setVelocityX(0);
      this.sprite.play('boss_idle', true);
    }
  }

  public handleAttack() {
    const currentAnim = this.sprite.anims.currentAnim?.key;

    // Don't start new attack if already in attack animation
    if (currentAnim && (
        currentAnim === 'boss_attack_2_prep' ||
        currentAnim === 'boss_attack_2' ||
        currentAnim === 'boss_attack_2_end')) {

      // If we're in the main attack animation, keep charging toward player
      if (currentAnim === 'boss_attack_2' && this.isCharging) {
        const direction = this.getDirectionToPlayer();
        const chargeDirection = direction === 'left' ? -1 : 1;
        this.sprite.setVelocityX(chargeDirection * this.chargeSpeed);
        setSpriteDirection(this.sprite, direction, this.adjustForCenterOffset);
      }

      return;
    }

    // Start attack sequence
    this.sprite.play('boss_attack_2_prep');

    // Set initial direction toward player for the charge
    const direction = this.getDirectionToPlayer();
    setSpriteDirection(this.sprite, direction, this.adjustForCenterOffset);
  }

  create() {
    this.state = new State(this, this.playerRef);
    this.createBossAnimations(this.scene);
    this.addBossAnimationListeners();

    EventBus.on('damage_boss', (damage: number) => {
      this.takeDamage(damage);
    });

    this.sprite.play('boss_idle');
  }

  update(_time: number, delta: number) {
    this.deltaTime = delta / 1000;

    if (this.isDead) return;

    // Check if we should attack
    if (this.shouldAttack(delta)) {
      this.handleAttack();
    } else if (!this.isCharging) {
      // Otherwise just move around if not charging
      this.handleMovement();
    } else {
      // If charging, continue the charge behavior
      const direction = this.getDirectionToPlayer();
      const chargeDirection = direction === 'left' ? -1 : 1;
      this.sprite.setVelocityX(chargeDirection * this.chargeSpeed);
      setSpriteDirection(this.sprite, direction, this.adjustForCenterOffset);
    }

    const spriteDirection = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, spriteDirection);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    this.renderDebugGraphics(this.attackHitboxManager.getActiveHitboxes());
  }
}
