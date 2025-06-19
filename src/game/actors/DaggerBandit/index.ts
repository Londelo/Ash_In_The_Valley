import { Scene } from 'phaser';
import { createDaggerBanditAnimations, addDaggerBanditAnimationListeners, isHighPriorityAnimation } from './animations';
import { BanditAI, AI_State } from './ai';
import type { Player } from '../Player/index';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { debugGraphics } from '../../utils/debugGraphics';
import { EventBus } from '../../EventBus';
import { AttackHitboxManager, AttackHitboxConfig } from '../../utils/attackHitbox';

export class DaggerBandit {
  scene: Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  banditSpeed: number = 50;
  private banditBoundingBox: Phaser.GameObjects.Graphics
  private banditScale: number = 3;
  private banditAI: BanditAI;
  private playerRef: Player;
  private isVanished: boolean = false;
  private vanishTargetX: number = 0;
  private readonly center_x_left: number = .68
  private readonly center_x_right: number = .33
  private readonly center_y: number = 1
  private readonly bodyWidth = 20
  private readonly bodyHeight = 25
  public uniqueId: string = `bandit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  public health: number = 100;
  public maxHealth: number = 100;
  public attackHitboxManager: AttackHitboxManager;
  public isDead: boolean = false;
  private deltaTime: number = 0;
  public attackPower: number = 10;

  // Attack configurations
  private attackConfigs: { [key: string]: AttackHitboxConfig } = {
    [`${this.uniqueId}_dagger_bandit_attack`]: {
      width: 100,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: this.attackPower,
      attackerId: this.uniqueId
    },
    [`${this.uniqueId}_dagger_bandit_attack`]: {
      width: 50,
      height: 40,
      offsetX_right: 35,
      offsetX_left: -35,
      offsetY: -15,
      duration: 500,
      damage: this.attackPower * 2.5,
      attackerId: this.uniqueId
    }
  };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.playerRef = playerRef;

    this.sprite = scene.physics.add.sprite(x, y, 'daggerBanditAtlas', 'Idle 0');

    // Add reference to this DaggerBandit instance on the sprite
    this.sprite.banditInstance = this;

    this.setBanditScale(this.banditScale);
    // Set texture filtering to nearest neighbor for crisp pixel art
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(300);
    this.sprite.setBodySize(this.bodyWidth, this.bodyHeight, false)
    this.sprite.setDepth(0)
    this.adjustForCenterOffset('right')
    this.banditBoundingBox = scene.add.graphics();
    this.attackHitboxManager = new AttackHitboxManager(scene);

    // Update attack configs with the actual uniqueId after it's generated
    Object.keys(this.attackConfigs).forEach(key => {
      this.attackConfigs[key].attackerId = this.uniqueId;
    });
  }

  public takeDamage(amount: number) {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    console.log(`Bandit ${this.uniqueId} took ${amount} damage! Health: ${this.health}/${this.maxHealth}`);

    if (this.health <= 0) {
      console.log(`Bandit ${this.uniqueId} defeated!`);
      this.isDead = true;
      this.sprite.play(`${this.uniqueId}_dagger_bandit_death`);
      this.sprite.setVelocityX(0); // Stop movement immediately
    } else {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_hit`);

      // Add knockback effect
      const knockbackForce = 100;
      const knockbackDirection = this.sprite.flipX ? 1 : -1; // Opposite to facing direction
      this.sprite.setVelocityX(knockbackDirection * knockbackForce);

      // Visual feedback - make sprite flash
      this.sprite.setTint(0xf0f8ff);
      this.scene.time.delayedCall(200, () => {
        this.sprite.clearTint();
        this.sprite.setVelocityX(0);
      });
    }
  }

  public adjustForCenterOffset = (direction: 'left' | 'right') => {
    if(direction === 'left') {
      this.sprite.setOrigin(this.center_x_left, this.center_y)
    } else {
      this.sprite.setOrigin(this.center_x_right, this.center_y)
    }
    this.sprite.body.setOffset(this.sprite.displayOriginX - this.bodyWidth/2, 47)
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

  public setBanditScale(scale: number) {
    this.banditScale = scale;
    this.sprite.setScale(scale);
  }

  public onVanishComplete() {
    this.sprite.x = this.vanishTargetX;
    this.sprite.play(`${this.uniqueId}_dagger_bandit_appear`);
  }

  public onAppearComplete() {
    this.isVanished = false;
    this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
  }

  public handleMovement(aiState: AI_State) {
    const {
      shouldMove,
      playerDirection
    } = aiState

    if(shouldMove) {
      const baseSpeed = this.banditSpeed;
      const dashDirection = this.sprite.flipX ? -1 : 1; // -1 for left, 1 for right
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

  public handleMovementAnimations(aiState: AI_State) {
    // Don't override priority animations
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (isHighPriorityAnimation(currentAnim, this.uniqueId)) {
      return;
    }

    if (aiState.shouldPlayMoveAnim) {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_run`);
    } else if (aiState.shouldPlayIdleAnim) {
      this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
    }
  }

  public handleAttack(aiState: AI_State) {
    if (aiState.shouldAttack) {
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
      // Start vanish sequence
      this.isVanished = true;
      this.sprite.play(`${this.uniqueId}_dagger_bandit_vanish`);

      // Calculate teleport destination (opposite side of screen)
      const currentSide = this.sprite.x < this.scene.scale.width / 2 ? 'left' : 'right';
      if (currentSide === 'left') {
        this.vanishTargetX = this.scene.scale.width - 200; // Near right edge
      } else {
        this.vanishTargetX = 200; // Near left edge
      }
    }
  }

  public handleJump(aiState: AI_State) {
    if (!this.isVanished && aiState.isOnGround) {
      this.sprite.setVelocityY(-350);
      this.sprite.play(`${this.uniqueId}_dagger_bandit_jump`);
    }
  }

  create() {
    createDaggerBanditAnimations(this.scene, this.uniqueId);
    addDaggerBanditAnimationListeners(this);
    this.banditAI = new BanditAI(this, this.playerRef);

    // Listen for targeted damage events
    EventBus.on(`damage_${this.uniqueId}`, (damage: number) => {
      this.takeDamage(damage);
    });

    this.sprite.play(`${this.uniqueId}_dagger_bandit_idle`);
  }

  update(time: number, delta: number) {
    this.deltaTime = delta / 1000; // Convert to seconds

    if (this.isDead) return;

    const aiState = this.banditAI.getState(time, delta);
    this.handleAttack(aiState)
    this.handleMovement(aiState)
    this.handleMovementAnimations(aiState);

    // Update attack hitboxes
    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, direction);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    // debugGraphics(this.banditBoundingBox, this.sprite, this.banditScale, this.attackHitboxManager.getActiveHitboxes());
  }
}
