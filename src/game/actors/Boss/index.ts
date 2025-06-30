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
  private bossSpeed: number = 80;
  
  private readonly ARENA_CENTER_X = 750;
  private readonly WANDER_RANGE = 200;
  
  private isVanished: boolean = false;
  private vanishTargetX: number = 0;
  private telegraphSprite: Phaser.GameObjects.Sprite | null = null;
  private missileSprites: Phaser.GameObjects.Sprite[] = [];

  public attackHitboxManager: AttackHitboxManager;

  private attackConfigs: { [key: string]: AttackHitboxConfig } = {
    'boss_attack_1': {
      width: 300,
      height: 60,
      offsetX_right: 100,
      offsetX_left: -100,
      offsetY: -30,
      duration: 300,
      damage: this.attackPower * 2,
      attackerId: 'boss'
    },
    'boss_attack_2': {
      width: 250,
      height: 50,
      offsetX_right: 80,
      offsetX_left: -80,
      offsetY: -25,
      duration: 250,
      damage: this.attackPower,
      attackerId: 'boss'
    }
  };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    const actorConfig: ActorConfig = {
      scale: 2,
      bodyWidth: 60,
      bodyHeight: 80,
      centerXLeft: 0.6,
      centerXRight: 0.4,
      centerY: 1,
      health: 500,
      attackPower: 40,
      bodyOffsetY: 30,
      knockbackForce: 50,
      deathAnimationKey: 'boss_death',
      hitAnimationKey: 'boss_hit'
    };

    super(scene, x, y, 'bossAtlas', 'Idle 0', actorConfig);

    this.playerRef = playerRef;
    this.sprite.setDepth(1);
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
      } else if (animation.key === 'boss_attack_2') {
        this.sprite.play('boss_attack_2_end');
      } else if (animation.key === 'boss_vanish') {
        this.onVanishComplete();
      } else if (animation.key === 'boss_appear') {
        this.onAppearComplete();
      } else if (this.state.isActionAnimations(animation.key) && animation.key !== 'boss_death') {
        this.state.onAttackComplete();
        this.sprite.play('boss_idle');
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
      damage: this.attackPower * 1.5,
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
    
    this.scene.time.delayedCall(500, () => {
      this.sprite.play('boss_attack_2_prep');
    });
  }

  public handleMovement(currentState: BossState) {
    if (currentState.shouldMove && !this.isVanished) {
      const targetX = this.ARENA_CENTER_X + (Math.random() - 0.5) * this.WANDER_RANGE * 2;
      const direction = targetX > this.sprite.x ? 1 : -1;
      
      this.sprite.setVelocityX(direction * this.bossSpeed);
      setSpriteDirection(this.sprite, direction > 0 ? 'right' : 'left', this.adjustForCenterOffset);
      
      this.scene.time.delayedCall(1000, () => {
        this.sprite.setVelocityX(0);
      });
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

    this.sprite.play('boss_idle');
  }

  update(time: number, delta: number) {
    this.deltaTime = delta / 1000;

    if (this.isDead) return;

    const currentState = this.state.getState(time, delta);
    this.handleAttacks(currentState);
    this.handleMovement(currentState);
    this.handleMovementAnimations(currentState);

    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, direction);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    this.renderDebugGraphics(this.attackHitboxManager.getActiveHitboxes());
  }
}