import { Scene } from 'phaser';
import { createDaggerBanditAnimations, addDaggerBanditAnimationListeners, isHighPriorityAnimation } from './animations';
import { BanditAI, AI_State } from './ai';
import type { Player } from '../Player/index';

export class DaggerBandit {
  scene: Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  banditSpeed: number = 50;

  // AI system
  private banditAI: BanditAI;
  private playerRef: Player;

  // Bandit scaling
  private banditScale: number = 3;

  // Vanish/Appear system
  private isVanished: boolean = false;
  private vanishTargetX: number = 0;

  // Global deltaTime for this class
  private deltaTime: number = 0;

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.playerRef = playerRef;

    // Verify the atlas is loaded
    if (!scene.textures.exists('daggerBanditAtlas')) {
      console.error('daggerBanditAtlas not found! Available textures:', scene.textures.list);
      // Fallback to a basic rectangle if atlas is missing
      this.sprite = scene.physics.add.sprite(x, y, null) as any;
      return;
    }

    // Create bandit sprite using the atlas with the first idle frame
    this.sprite = scene.physics.add.sprite(x, y, 'daggerBanditAtlas', 'Idle 0');
    this.setBanditScale(this.banditScale);

    // Set texture filtering to nearest neighbor for crisp pixel art
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Set origin to bottom center for proper ground positioning
    this.sprite.setOrigin(0.5, 1);
    
    // Enable physics
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setGravityY(300);
  }

  public setBanditScale(scale: number) {
    this.banditScale = scale;
    this.sprite.setScale(scale);
  }

  public setCharacterDirection(facingLeft: boolean) {
    this.sprite.setFlipX(facingLeft);
  }

  public handleMovement(aiState: AI_State) {
    const {
      shouldMove,
      playerDirection
    } = aiState

    if(shouldMove) {
      const baseSpeed = this.banditSpeed;

      if (playerDirection === 'left') {
        this.sprite.setVelocityX(-baseSpeed);
        this.setCharacterDirection(true); // Facing left
      } else {
        this.sprite.setVelocityX(baseSpeed);
        this.setCharacterDirection(false); // Facing right
      }
    } else {
      this.sprite.setVelocityX(0);
    }
  }

  public handleMovementAnimations(aiState: AI_State) {
    // Don't override priority animations
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (isHighPriorityAnimation(currentAnim)) {
      return;
    }

    if (aiState.shouldPlayMoveAnim) {
      this.sprite.play('bandit_run');
    } else if (aiState.shouldPlayIdleAnim) {
      this.sprite.play('bandit_idle');
    }
  }

  public handleAttack(aiState: AI_State) {
    if (aiState.shouldAttack) {
      this.sprite.play('bandit_attack');
    }
  }

  public handleBatFangAttack() {
    if (!this.isVanished) {
      this.sprite.play('bandit_bat_fang_attack');
    }
  }

  public handleVanishAppear() {
    if (!this.isVanished) {
      // Start vanish sequence
      this.isVanished = true;
      this.sprite.play('bandit_vanish');

      // Calculate teleport destination (opposite side of screen)
      const currentSide = this.sprite.x < this.scene.scale.width / 2 ? 'left' : 'right';
      if (currentSide === 'left') {
        this.vanishTargetX = this.scene.scale.width - 200; // Near right edge
      } else {
        this.vanishTargetX = 200; // Near left edge
      }
    }
  }

  public handleJump() {
    if (!this.isVanished && this.sprite.body.onFloor()) {
      this.sprite.setVelocityY(-350);
      this.sprite.play('bandit_jump');
    }
  }

  create() {

    createDaggerBanditAnimations(this.scene);
    addDaggerBanditAnimationListeners(this);

    // Initialize AI
    this.banditAI = new BanditAI(this, this.playerRef);

    this.sprite.play('bandit_idle');
  }

  update(time: number, delta: number) {
    this.deltaTime = delta / 1000; // Convert to seconds


    // Let AI control the bandit
    const aiState = this.banditAI.getState(time, delta);

    this.handleAttack(aiState)
    this.handleMovement(aiState)
    this.handleMovementAnimations(aiState);
  }

  // Method called when vanish animation completes
  public onVanishComplete() {
    // Teleport to new position
    this.sprite.x = this.vanishTargetX;

    // Start appear animation
    this.sprite.play('bandit_appear');
  }

  // Method called when appear animation completes
  public onAppearComplete() {
    this.isVanished = false;
    this.sprite.play('bandit_idle');
  }
}
