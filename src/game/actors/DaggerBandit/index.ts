import { Scene } from 'phaser';
import { createDaggerBanditAnimations, addDaggerBanditAnimationListeners, isHighPriorityAnimation } from './animations';
import { BanditAI, AI_State } from './ai';
import type { Player } from '../Player/index';

export class DaggerBandit {
  scene: Scene;
  sprite: Phaser.GameObjects.Sprite;
  banditSpeed: number = 50;

  // AI system
  private banditAI: BanditAI;
  private playerRef: Player;

  // Bandit scaling
  private banditScale: number = 3;

  // Character positioning constants (base values for scale 1) - Updated for 128x78 frame
  private readonly BASE_CHARACTER_CENTER_RIGHT = 64;  // Character center when facing right
  private readonly BASE_CHARACTER_CENTER_LEFT = 64;   // Character center when facing left

  // Computed values based on current scale
  private get CHARACTER_CENTER_RIGHT() { return this.BASE_CHARACTER_CENTER_RIGHT * this.banditScale; }
  private get CHARACTER_CENTER_LEFT() { return this.BASE_CHARACTER_CENTER_LEFT * this.banditScale; }

  // Track the character's logical center position
  private characterCenterX: number;

  // Jump physics - Adjusted for smaller character
  private readonly GROUND_Y = 650;
  private readonly JUMP_VELOCITY = -350;
  private readonly GRAVITY = 700;
  private velocityY: number = 0;

  public isOnGround: boolean = true;
  public wasRunningBeforeJump: boolean = false;
  public isJumping: boolean = false;

  // Vanish/Appear system
  private isVanished: boolean = false;
  private vanishTargetX: number = 0;

  // Global deltaTime for this class
  private deltaTime: number = 0;

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.characterCenterX = x;
    this.playerRef = playerRef;

    // Verify the atlas is loaded
    if (!scene.textures.exists('daggerBanditAtlas')) {
      console.error('daggerBanditAtlas not found! Available textures:', scene.textures.list);
      // Fallback to a basic rectangle if atlas is missing
      this.sprite = scene.add.rectangle(x, y, 100, 100, 0xff0000) as any;
      return;
    }

    // Create bandit sprite using the atlas with the first idle frame
    this.sprite = scene.add.sprite(x, y, 'daggerBanditAtlas', 'Idle 0');
    this.setBanditScale(this.banditScale);

    // Set texture filtering to nearest neighbor for crisp pixel art
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.sprite.x = this.characterCenterX;
  }

  public setBanditScale(scale: number) {
    this.banditScale = scale;
    this.sprite.setScale(scale);
  }

  private moveCharacter(deltaX: number) {
    this.characterCenterX += deltaX;

    // Keep character within screen bounds
    const characterHalfWidth = (this.CHARACTER_CENTER_LEFT - this.CHARACTER_CENTER_RIGHT) / 2;
    this.characterCenterX = Phaser.Math.Clamp(
      this.characterCenterX,
      characterHalfWidth + this.CHARACTER_CENTER_RIGHT,
      this.scene.scale.width - characterHalfWidth - this.CHARACTER_CENTER_RIGHT
    );

    this.sprite.x = this.characterCenterX;
  }

  public setCharacterDirection(facingLeft: boolean) {
    this.sprite.setFlipX(facingLeft);
  }

  private updateJumpPhysics() {
    const currentAnim = this.sprite.anims.currentAnim?.key;

    if (!this.isOnGround) {
      // Apply gravity
      this.velocityY += this.GRAVITY * this.deltaTime;

      // Update Y position
      this.sprite.y += this.velocityY * this.deltaTime;

      // Check if we've reached the peak and started falling
      if (this.velocityY > 0 && this.isJumping) {
        this.isJumping = false;
        if (currentAnim !== 'bandit_bat_fang_attack' && !this.isVanished) {
          this.sprite.play('bandit_fall');
        }
      }

      // Check if we've landed
      if (this.sprite.y >= this.GROUND_Y) {
        this.sprite.y = this.GROUND_Y;
        this.velocityY = 0;
        this.isOnGround = true;
        this.isJumping = false;

        // Reset running state when landing
        this.wasRunningBeforeJump = false;

        if (currentAnim !== 'bandit_bat_fang_attack' && !this.isVanished) {
          // Brief landing pause before returning to idle
          this.scene.time.delayedCall(100, () => {
            if (this.sprite.anims.currentAnim?.key === 'bandit_fall') {
              this.sprite.play('bandit_idle');
            }
          });
        }
      }
    }
  }

  public handleMovement(aiState: AI_State) {
    const {
      shouldMove,
      playerDirection
    } = aiState

    if(shouldMove) {
      const baseSpeed = this.banditSpeed * this.deltaTime;

      if (playerDirection === 'left') {
        this.moveCharacter(-baseSpeed);
        this.setCharacterDirection(true); // Facing left
      } else {
        this.moveCharacter(baseSpeed);
        this.setCharacterDirection(false); // Facing right
      }
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
      const currentSide = this.characterCenterX < this.scene.scale.width / 2 ? 'left' : 'right';
      if (currentSide === 'left') {
        this.vanishTargetX = this.scene.scale.width - 200; // Near right edge
      } else {
        this.vanishTargetX = 200; // Near left edge
      }
    }
  }

  public handleJump() {
    if (!this.isVanished && this.isOnGround) {
      this.velocityY = this.JUMP_VELOCITY;
      this.isOnGround = false;
      this.isJumping = true;
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

    this.updateJumpPhysics();

    // Let AI control the bandit
    const aiState = this.banditAI.getState(time, delta);

    this.handleAttack(aiState)
    this.handleMovement(aiState)
    this.handleMovementAnimations(aiState);
  }

  // Method called when vanish animation completes
  public onVanishComplete() {
    // Teleport to new position
    this.characterCenterX = this.vanishTargetX;
    this.sprite.x = this.characterCenterX;

    // Start appear animation
    this.sprite.play('bandit_appear');
  }

  // Method called when appear animation completes
  public onAppearComplete() {
    this.isVanished = false;
    this.sprite.play('bandit_idle');
  }
}
