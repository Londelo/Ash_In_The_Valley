import { Scene } from 'phaser';
import { createDaggerBanditAnimations, addDaggerBanditAnimationListeners, isHighPriorityAnimation } from './animations';
import { BanditAI } from './ai';
import type { Player } from '../Player/index';

export class DaggerBandit {
  scene: Scene;
  sprite: Phaser.GameObjects.Sprite;
  banditSpeed: number = 180;
  
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

  // Combat system
  private comboState: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_WINDOW_MAX = 800;
  private readonly COMBO_WINDOW_MIN = 200;

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

  public resetCombo() {
    this.comboState = 0;
    this.comboTimer = 0;
  }

  private shouldResetCombo() {
    if (this.comboTimer < this.COMBO_WINDOW_MIN || this.comboTimer > this.COMBO_WINDOW_MAX) {
      this.resetCombo();
    }
  }

  private updateComboTimer(deltaTime: number) {
    if (this.comboState > 0) {
      this.comboTimer += deltaTime * 1000; // Convert to milliseconds
    }
  }

  private updateJumpPhysics(deltaTime: number) {
    const currentAnim = this.sprite.anims.currentAnim?.key;

    if (!this.isOnGround) {
      // Apply gravity
      this.velocityY += this.GRAVITY * deltaTime;

      // Update Y position
      this.sprite.y += this.velocityY * deltaTime;

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

  public handleMovement(moveLeft: boolean, moveRight: boolean, isRunning: boolean, deltaTime: number) {
    if (!this.isVanished) {
      const baseSpeed = this.banditSpeed * deltaTime;
      const moveSpeed = isRunning ? baseSpeed * 1.8 : baseSpeed;

      if (moveLeft) {
        this.moveCharacter(-moveSpeed);
        this.setCharacterDirection(true); // Facing left
      } else if (moveRight) {
        this.moveCharacter(moveSpeed);
        this.setCharacterDirection(false); // Facing right
      }
    }
  }

  public handleMovementAnimations(isMoving: boolean, isRunning: boolean) {
    // Don't override priority animations
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (isHighPriorityAnimation(currentAnim) || this.isVanished) {
      return;
    }

    if (isMoving && isRunning) {
      this.sprite.play('bandit_run');
    } else if (!isMoving) {
      this.sprite.play('bandit_idle');
    }
  }

  public handleAttack() {
    if (!this.isVanished) {
      this.shouldResetCombo();

      if (this.comboState === 0) {
        // First attack in combo
        this.sprite.play('bandit_attack');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        // Second attack in combo - more powerful
        this.sprite.play('bandit_attack');
        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        // Third attack - reset combo
        this.sprite.play('bandit_attack');
        this.resetCombo();
      }
    }
  }

  public handleBatFangAttack() {
    if (!this.isVanished) {
      this.sprite.play('bandit_bat_fang_attack');
      this.resetCombo();
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

  public handleBlock() {
    if (!this.isVanished) {
      // For now, just play idle animation as a block stance
      // You could create a specific block animation later
      this.sprite.play('bandit_idle');
      this.resetCombo();
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
    console.log('DaggerBandit actor create() called');

    createDaggerBanditAnimations(this.scene);
    addDaggerBanditAnimationListeners(this);

    // Initialize AI
    this.banditAI = new BanditAI(this, this.playerRef);

    this.sprite.play('bandit_idle');
  }

  update(time: number, delta: number) {
    const deltaTime = delta / 1000; // Convert to seconds

    this.updateComboTimer(deltaTime);
    this.updateJumpPhysics(deltaTime);

    // Let AI control the bandit
    this.banditAI.update(time, delta);
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