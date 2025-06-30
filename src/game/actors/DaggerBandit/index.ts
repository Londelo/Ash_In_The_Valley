import { Scene } from 'phaser';
import { State, AI_State } from './state';
import type { Player } from '../Player/index';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { EventBus } from '../../EventBus';
import { AttackHitboxManager, AttackHitboxConfig } from '../../components/AttackHitbox';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getDaggerBanditAnimationConfigs } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';

export class DaggerBandit extends Actor {
  banditSpeed: number = 50;
  private state: State;
  private playerRef: Player;
  private isVanished: boolean = false;
  private vanishTargetX: number = 0;
  private deltaTime: number = 0;
  public uniqueId: string = `bandit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  public attackHitboxManager: AttackHitboxManager;

  private attackConfigs: { [key: string]: AttackHitboxConfig } = {
    [`${this.uniqueId}_dagger_bandit_attack`]: {
      width: 100,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: this.attackPower,
      attackerId: this.uniqueId,
      delay: 0
    },
    [`${this.uniqueId}_dagger_bandit_bat_fang_attack`]: {
      width: 50,
      height: 40,
      offsetX_right: 35,
      offsetX_left: -35,
      offsetY: -15,
      duration: 500,
      damage: this.attackPower * 2.5,
      attackerId: this.uniqueId,
      delay: 0
    }
  };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    const actorConfig: ActorConfig = {
      scale: 3,
      bodyWidth: 20,
      bodyHeight: 25,
      centerXLeft: 0.68,
      centerXRight: 0.33,
      centerY: 1,
      health: 100,
      attackPower: 10,
      bodyOffsetY: 47,
      knockbackForce: 100,
      deathAnimationKey: `bandit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_dagger_bandit_death`,
      hitAnimationKey: `bandit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_dagger_bandit_hit`
    };

    super(scene, x, y, 'daggerBanditAtlas', 'Idle 0', actorConfig);

    this.config.deathAnimationKey = `${this.uniqueId}_dagger_bandit_death`;
    this.config.hitAnimationKey = `${this.uniqueId}_dagger_bandit_hit`;

    this.playerRef = playerRef;
    this.sprite.banditInstance = this;
    this.sprite.setDepth(0);
    this.attackHitboxManager = new AttackHitboxManager(scene);

    Object.keys(this.attackConfigs).forEach(key => {
      this.attackConfigs[key].attackerId = this.uniqueId;
    });
  }

  private createDaggerBanditAnimations(scene: Scene, uniqueId: string) {
    const animationManager = new AnimationHelper(scene);
    const animationConfigs = getDaggerBanditAnimationConfigs(uniqueId);
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

  private addDaggerBanditAnimationListeners() {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (this.state.isActionAnimations(animation.key, this.uniqueId) && animation.key !== `${this.uniqueId}_dagger_bandit_death`) {
        this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
      } else if (animation.key === `${this.uniqueId}_dagger_bandit_death`) {
        this.sprite.anims.stop();
        this.onVanishComplete();
      } else if (animation.key === `${this.uniqueId}_dagger_bandit_appear`) {
        this.onAppearComplete();
      }
    });
  }

  public onVanishComplete() {
    this.sprite.x = this.vanishTargetX;
    this.sprite.play(`${this.uniqueId}_dagger_bandit_appear`);
  }

  public onAppearComplete() {
    this.isVanished = false;
    this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
  }

  public handleMovement(currentState: AI_State) {
    const { shouldMove, playerDirection } = currentState;

    if (shouldMove) {
      const baseSpeed = this.banditSpeed;
      const dashDirection = this.sprite.flipX ? -1 : 1;
      const dashDistance = baseSpeed * dashDirection;
      if (playerDirection === 'left') {
        this.sprite.x += dashDistance * this.deltaTime;
        setSpriteDirection(this.sprite, 'left', this.adjustForCenterOffset);
      } else {
        this.sprite.x += dashDistance * this.deltaTime;
        setSpriteDirection(this.sprite, 'right', this.adjustForCenterOffset);
      }
    }
  }

  public handleMovementAnimations(currentState: AI_State) {
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (this.state.isHighPriorityAnimation(currentAnim, this.uniqueId)) {
      return;
    }

    if (currentState.shouldPlayMoveAnim) {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_run`);
    } else if (currentState.shouldPlayIdleAnim) {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
    }
  }

  public handleAttack(currentState: AI_State) {
    if (currentState.shouldAttack) {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_attack`);
      this.createAttackHitbox(`${this.uniqueId}_dagger_bandit_attack`);
    }
  }

  public handleBatFangAttack() {
    if (!this.isVanished) {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_bat_fang_attack`);
      this.createAttackHitbox(`${this.uniqueId}_dagger_bandit_bat_fang_attack`);
    }
  }

  public handleVanishAppear() {
    if (!this.isVanished) {
      this.isVanished = true;
      this.sprite.play(`${this.uniqueId}_dagger_bandit_vanish`);

      const currentSide = this.sprite.x < this.scene.scale.width / 2 ? 'left' : 'right';
      if (currentSide === 'left') {
        this.vanishTargetX = this.scene.scale.width - 200;
      } else {
        this.vanishTargetX = 200;
      }
    }
  }

  public handleJump(currentState: AI_State) {
    if (!this.isVanished && currentState.isOnGround) {
      this.sprite.setVelocityY(-350);
      this.sprite.play(`${this.uniqueId}_dagger_bandit_jump`);
    }
  }

  create() {
    this.state = new State(this, this.playerRef);
    this.createDaggerBanditAnimations(this.scene, this.uniqueId);
    this.addDaggerBanditAnimationListeners();

    EventBus.on(`damage_${this.uniqueId}`, (damage: number) => {
      this.takeDamage(damage);
    });

    this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
  }

  update(time: number, delta: number) {
    this.deltaTime = delta / 1000;

    if (this.isDead) return;

    const currentState = this.state.getState(time, delta);
    this.handleAttack(currentState);
    this.handleMovement(currentState);
    this.handleMovementAnimations(currentState);

    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, direction);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    this.renderDebugGraphics(this.attackHitboxManager.getActiveHitboxes());
  }
}