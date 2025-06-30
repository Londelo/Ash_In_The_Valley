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

  private readonly DETECTION_RANGE = 600;
  private readonly ARENA_CENTER_X = 600;
  private readonly WANDER_RANGE = 300;

  private isVanished: boolean = false;
  private vanishTargetX: number = 0;
  private telegraphSprite: Phaser.GameObjects.Sprite | null = null;
  private missileSprites: Phaser.GameObjects.Sprite[] = [];
  private directionChangeTimer: number = 0;
  private readonly DIRECTION_CHANGE_INTERVAL = 3000; // Change direction every 3 seconds
  private vanishTimer: number = 0;
  private readonly VANISH_INTERVAL = 8000; // Try to vanish every 8 seconds
  private attackTimer: number = 0;
  private readonly ATTACK_INTERVAL = 4000; // Attack every 4 seconds
  private isCharging: boolean = false;

  public attackHitboxManager: AttackHitboxManager;

  private attackConfigs: { [key: string]: AttackHitboxConfig } = {
    'boss_attack_1': {
      width: 300,
      height: 60,
      offsetX_right: 100,
      offsetX_left: -100,
      offsetY: -30,
      duration: 300,
      damage: 25,
      attackerId: 'boss'
    },
    'boss_attack_2': {
      width: 250,
      height: 50,
      offsetX_right: 80,
      offsetX_left: -80,
      offsetY: -25,
      duration: 250,
      damage: 15,
      attackerId: 'boss'
    }
  };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    const actorConfig: ActorConfig = {
      scale: 4,
      bodyWidth: 60,
      bodyHeight: 80,
      centerXLeft: 0.6,
      centerXRight: 0.4,
      centerY: 1,
      health: 1600,
      attackPower: 20,
      bodyOffsetY: 30,
      knockbackForce: 50,
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
      if (animation.key === 'boss_prep_attack_1') {
        this.executeSpecialAttack();
      } else if (animation.key === 'boss_attack_2_prep') {
        this.sprite.play('boss_attack_2');
        this.createAttackHitbox('boss_attack_2');
        this.isCharging = true;
      } else if (animation.key === 'boss_attack_2') {
        this.sprite.play('boss_attack_2_end');
        this.isCharging = false;
      } else if (animation.key === 'boss_attack_2_end') {
        this.isCharging = false;
      } else if (animation.key === 'boss_vanish') {
        this.onVanishComplete();
      } else if (animation.key === 'boss_appear') {
        this.onAppearComplete();
      } else if (this.state.isActionAnimations(animation.key) && animation.key !== 'boss_death') {
        this.state.onAttackComplete();
        this.sprite.play('boss_idle');
        this.isCharging = false;
      } else if (animation.key === 'boss_death') {
        this.sprite.anims.stop();
      }
    });
  }

  private createTelegraph(x: number, y: number) {
    this.telegraphSprite = this.scene.add.sprite(x, y - 100, 'bossAtlas', 'prep_attack_1 0');
    this.telegraphSprite.setScale(1.5);
    this.telegraphSprite.setAlpha(0.7);
    this.telegraphSprite.setTint(0xff0000);
    this.telegraphSprite.play('boss_prep_attack_1');
  }

  private executeSpecialAttack() {
    if (this.telegraphSprite) {
      const targetX = this.telegraphSprite.x;
      const targetY = this.telegraphSprite.y + 100;

      this.createMissileHitbox(targetX, targetY);
      this.telegraphSprite.destroy();
      this.telegraphSprite = null;
    }
  }

  private createMissileHitbox(x: number, y: number) {
    const missileConfig: AttackHitboxConfig = {
      width: 150,
      height: 150,
      offsetX_right: 0,
      offsetX_left: 0,
      offsetY: 0,
      duration: 500,
      damage: 30,
      attackerId: 'boss'
    };

    this.attackHitboxManager.createAttackHitbox(x, y, missileConfig, 'right');

    const missileSprite = this.scene.add.sprite(x, y, 'bossAtlas', 'attack_1 0');
    missileSprite.setScale(1.2);
    missileSprite.play('boss_attack_1');
    this.missileSprites.push(missileSprite);

    this.scene.time.delayedCall(500, () => {
      const index = this.missileSprites.indexOf(missileSprite);
      if (index > -1) {
        this.missileSprites.splice(index, 1);
        missileSprite.destroy();
      }
    });
  }

  public onVanishComplete() {
    this.isVanished = true;
    this.sprite.setVisible(false);

    this.scene.time.delayedCall(2000, () => {
      const playerX = this.playerRef.sprite.x;
      const side = Math.random() < 0.5 ? 'left' : 'right';
      this.vanishTargetX = side === 'left' ? playerX - 150 : playerX + 150;

      this.sprite.x = this.vanishTargetX;
      this.sprite.setVisible(true);
      this.sprite.play('boss_appear');
    });
  }

  public onAppearComplete() {
    this.isVanished = false;

    // After appearing, always perform attack_1
    const playerX = this.playerRef.sprite.x;
    const playerY = this.playerRef.sprite.y;
    this.createTelegraph(playerX, playerY);
  }

  private getDistanceToPlayer(): number {
    return Math.abs(this.playerRef.sprite.x - this.sprite.x);
  }

  private getDirectionToPlayer(): 'left' | 'right' {
    return this.playerRef.sprite.x < this.sprite.x ? 'left' : 'right';
  }

  private shouldChangeDirection(delta: number): boolean {
    this.directionChangeTimer += delta;
    if (this.directionChangeTimer >= this.DIRECTION_CHANGE_INTERVAL) {
      this.directionChangeTimer = 0;
      return Math.random() < 0.7; // 70% chance to change direction
    }
    return false;
  }

  private shouldVanish(delta: number): boolean {
    if (this.isVanished) return false;
    
    this.vanishTimer += delta;
    if (this.vanishTimer >= this.VANISH_INTERVAL) {
      this.vanishTimer = 0;
      return Math.random() < 0.3; // 30% chance to vanish
    }
    return false;
  }

  private shouldAttack(delta: number): boolean {
    if (this.isVanished) return false;
    
    this.attackTimer += delta;
    if (this.attackTimer >= this.ATTACK_INTERVAL) {
      this.attackTimer = 0;
      return Math.random() < 0.6; // 60% chance to attack
    }
    return false;
  }

  private chooseRandomAttack(): 'attack_1' | 'attack_2' {
    return Math.random() < 0.5 ? 'attack_1' : 'attack_2';
  }

  public handleMovement(currentState: BossState) {
    if (this.isVanished || this.telegraphSprite) {
      this.sprite.setVelocityX(0);
      return;
    }

    if (currentState.shouldMove) {
      let speed = this.bossSpeed;
      
      // Use faster speed when charging with attack_2
      if (this.isCharging) {
        speed = this.chargeSpeed;
      }
      
      const direction = currentState.playerDirection === 'left' ? -1 : 1;
      this.sprite.setVelocityX(direction * speed);
      setSpriteDirection(this.sprite, direction > 0 ? 'right' : 'left', this.adjustForCenterOffset);
    } else {
      this.sprite.setVelocityX(0);
    }
  }

  public handleMovementAnimations(currentState: BossState) {
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (this.state.isHighPriorityAnimation(currentAnim)) {
      return;
    }

    if (currentState.shouldPlayMoveAnim) {
      this.sprite.play('boss_move');
    } else if (currentState.shouldPlayIdleAnim) {
      this.sprite.play('boss_idle');
    }
  }

  public handleAttacks(currentState: BossState) {
    if (currentState.shouldAttack1) {
      const playerX = this.playerRef.sprite.x;
      const playerY = this.playerRef.sprite.y;
      this.createTelegraph(playerX, playerY);
    } else if (currentState.shouldAttack2) {
      this.sprite.play('boss_attack_2_prep');
      this.createAttackHitbox('boss_attack_2');
    } else if (currentState.shouldVanish) {
      this.sprite.play('boss_vanish');
      this.state.onVanishUsed();
    }
  }

  create() {
    this.state = new State(this, this.playerRef);
    this.createBossAnimations(this.scene);
    this.addBossAnimationListeners();

    EventBus.on('damage_boss', (damage: number) => {
      this.takeDamage(damage);
    });

    EventBus.on('damage_player', (damage: number) => {
      this.playerRef.takeDamage(damage);
    });

    this.sprite.play('boss_idle');
  }

  update(time: number, delta: number) {
    this.deltaTime = delta / 1000;

    if (this.isDead) return;

    // Update state based on new behavior logic
    const distance = this.getDistanceToPlayer();
    const direction = this.getDirectionToPlayer();
    const shouldChangeDirection = this.shouldChangeDirection(delta);
    const shouldVanish = this.shouldVanish(delta);
    const shouldAttack = this.shouldAttack(delta);
    const attackType = this.chooseRandomAttack();
    
    // Override state with our new random behaviors
    const currentState = this.state.getState(time, delta);
    
    // Apply random direction changes
    if (shouldChangeDirection) {
      currentState.playerDirection = currentState.playerDirection === 'left' ? 'right' : 'left';
    }
    
    // Apply vanish behavior
    if (shouldVanish) {
      currentState.shouldVanish = true;
    }
    
    // Apply attack behavior
    if (shouldAttack) {
      if (attackType === 'attack_1') {
        currentState.shouldAttack1 = true;
        currentState.shouldMove = false;
      } else {
        currentState.shouldAttack2 = true;
        currentState.shouldMove = true; // Move toward player during attack_2
      }
    }
    
    // Keep boss within detection range of player
    if (distance > this.DETECTION_RANGE) {
      currentState.shouldMove = true;
      currentState.playerDirection = direction;
    }

    this.handleAttacks(currentState);
    this.handleMovement(currentState);
    this.handleMovementAnimations(currentState);

    const spriteDirection = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, spriteDirection);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    this.renderDebugGraphics(this.attackHitboxManager.getActiveHitboxes());
  }
}