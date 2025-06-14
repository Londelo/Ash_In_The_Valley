import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { createDaggerBanditAnimations, addDaggerBanditAnimationListeners, isHighPriorityAnimation } from './animations';
import { setupDaggerBanditInput, getDaggerBanditInputState } from './inputs';

export class DaggerBandit extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  bandit: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  banditSpeed: number = 180;

  // Bandit scaling
  private banditScale: number = 3;

  // Character positioning constants (base values for scale 1) - Updated for 128x78 frame
  private readonly BASE_FRAME_WIDTH = 128;
  private readonly BASE_FRAME_HEIGHT = 78;
  private readonly BASE_CHARACTER_CENTER_RIGHT = 64;  // Character center when facing right
  private readonly BASE_CHARACTER_CENTER_LEFT = 64;   // Character center when facing left

  // Computed values based on current scale
  private get FRAME_WIDTH() { return this.BASE_FRAME_WIDTH * this.banditScale; }
  private get CHARACTER_CENTER_RIGHT() { return this.BASE_CHARACTER_CENTER_RIGHT * this.banditScale; }
  private get CHARACTER_CENTER_LEFT() { return this.BASE_CHARACTER_CENTER_LEFT * this.banditScale; }
  private get FRAME_CENTER() { return this.FRAME_WIDTH / 2; }

  // Track the character's logical center position
  private characterCenterX: number = 512;

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

  constructor() {
    super('DaggerBandit');
  }

  public setBanditScale(scale: number) {
    this.banditScale = scale;
    this.bandit.setScale(scale);
  }

  private moveCharacter(deltaX: number) {
    this.characterCenterX += deltaX;

    // Keep character within screen bounds
    const characterHalfWidth = (this.CHARACTER_CENTER_LEFT - this.CHARACTER_CENTER_RIGHT) / 2;
    this.characterCenterX = Phaser.Math.Clamp(
      this.characterCenterX,
      characterHalfWidth + this.CHARACTER_CENTER_RIGHT,
      this.scale.width - characterHalfWidth - this.CHARACTER_CENTER_RIGHT
    );

    this.bandit.x = this.characterCenterX;
  }

  private setCharacterDirection(facingLeft: boolean) {
    this.bandit.setFlipX(facingLeft);
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
    const currentAnim = this.bandit.anims.currentAnim?.key;

    if (!this.isOnGround) {
      // Apply gravity
      this.velocityY += this.GRAVITY * deltaTime;

      // Update Y position
      this.bandit.y += this.velocityY * deltaTime;

      // Check if we've reached the peak and started falling
      if (this.velocityY > 0 && this.isJumping) {
        this.isJumping = false;
        if (currentAnim !== 'bandit_bat_fang_attack' && !this.isVanished) {
          this.bandit.play('bandit_fall');
        }
      }

      // Check if we've landed
      if (this.bandit.y >= this.GROUND_Y) {
        this.bandit.y = this.GROUND_Y;
        this.velocityY = 0;
        this.isOnGround = true;
        this.isJumping = false;

        // Reset running state when landing
        this.wasRunningBeforeJump = false;

        if (currentAnim !== 'bandit_bat_fang_attack' && !this.isVanished) {
          // Brief landing pause before returning to idle
          this.time.delayedCall(100, () => {
            if (this.bandit.anims.currentAnim?.key === 'bandit_fall') {
              this.bandit.play('bandit_idle');
            }
          });
        }
      }
    }
  }

  private handleMovement(inputState: ReturnType<typeof getDaggerBanditInputState>, deltaTime: number) {
    if (inputState.canMove && inputState.isMoving && !this.isVanished) {
      const baseSpeed = this.banditSpeed * deltaTime;
      const moveSpeed = inputState.isRunning ? baseSpeed * 1.8 : baseSpeed;

      if (inputState.isMovingLeft) {
        this.moveCharacter(-moveSpeed);
        this.setCharacterDirection(true); // Facing left
      } else if (inputState.isMovingRight) {
        this.moveCharacter(moveSpeed);
        this.setCharacterDirection(false); // Facing right
      }
    }
  }

  private handleMovementAnimations(inputState: ReturnType<typeof getDaggerBanditInputState>) {
    // Don't override priority animations
    const currentAnim = this.bandit.anims.currentAnim?.key;
    if (isHighPriorityAnimation(currentAnim) || this.isVanished) {
      return;
    }

    if (inputState.shouldPlayRunAnimation) {
      this.bandit.play('bandit_run');
    } else if (inputState.shouldPlayIdleAnimation) {
      this.bandit.play('bandit_idle');
    }
  }

  private handleAttack(inputState: ReturnType<typeof getDaggerBanditInputState>) {
    if (inputState.shouldAttack && !this.isVanished) {
      this.shouldResetCombo();

      if (this.comboState === 0) {
        // First attack in combo
        this.bandit.play('bandit_attack');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        // Second attack in combo - more powerful
        this.bandit.play('bandit_attack');
        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        // Third attack - reset combo
        this.bandit.play('bandit_attack');
        this.resetCombo();
      }
    }
  }

  private handleBatFangAttack(inputState: ReturnType<typeof getDaggerBanditInputState>) {
    if (inputState.shouldBatFangAttack && !this.isVanished) {
      this.bandit.play('bandit_bat_fang_attack');
      this.resetCombo();
    }
  }

  private handleVanishAppear(inputState: ReturnType<typeof getDaggerBanditInputState>) {
    if (inputState.shouldVanish && !this.isVanished) {
      // Start vanish sequence
      this.isVanished = true;
      this.bandit.play('bandit_vanish');

      // Calculate teleport destination (opposite side of screen)
      const currentSide = this.characterCenterX < this.scale.width / 2 ? 'left' : 'right';
      if (currentSide === 'left') {
        this.vanishTargetX = this.scale.width - 200; // Near right edge
      } else {
        this.vanishTargetX = 200; // Near left edge
      }
    }
  }

  private handleBlock(inputState: ReturnType<typeof getDaggerBanditInputState>) {
    if (inputState.shouldBlock && !this.isVanished) {
      // For now, just play idle animation as a block stance
      // You could create a specific block animation later
      this.bandit.play('bandit_idle');
      this.resetCombo();
    }
  }

  private handleJump(inputState: ReturnType<typeof getDaggerBanditInputState>) {
    if (inputState.shouldJump && !this.isVanished) {
      // Remember if we were running before jumping
      this.wasRunningBeforeJump = inputState.isRunning;
      this.velocityY = this.JUMP_VELOCITY;
      this.isOnGround = false;
      this.isJumping = true;
      this.bandit.play('bandit_jump');
    }
  }

  private initBandit() {
    // Verify the atlas is loaded
    if (!this.textures.exists('daggerBanditAtlas')) {
      console.error('daggerBanditAtlas not found! Available textures:', this.textures.list);
      // Fallback to a basic rectangle if atlas is missing
      this.bandit = this.add.rectangle(512, this.GROUND_Y, 100, 100, 0xff0000) as any;
      return;
    }

    // Create bandit sprite using the atlas with the first idle frame
    this.bandit = this.add.sprite(512, this.GROUND_Y, 'daggerBanditAtlas', 'Idle 0');
    this.setBanditScale(this.banditScale);

    // Set texture filtering to nearest neighbor for crisp pixel art
    this.bandit.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Initialize character center position
    this.characterCenterX = 512;
    this.bandit.x = this.characterCenterX;
  }

  private initBackground() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x2C1810); // Dark brown background

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.2);
  }

  create() {
    console.log('DaggerBandit scene create() called');
    console.log('Available textures:', Object.keys(this.textures.list));

    this.initBackground();
    this.initBandit();

    // Set up inputs
    const { cursors, inputKeys } = setupDaggerBanditInput(this);
    this.cursors = cursors;
    this.inputKeys = inputKeys;

    createDaggerBanditAnimations(this);
    addDaggerBanditAnimationListeners(this);

    // Only play idle if we have a proper sprite
    if (this.bandit && this.bandit.play) {
      this.bandit.play('bandit_idle');
    }

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
    // Only update if we have a proper sprite
    if (!this.bandit || !this.bandit.play) {
      return;
    }

    const deltaTime = delta / 1000; // Convert to seconds
    const currentAnim = this.bandit.anims.currentAnim?.key;

    this.updateComboTimer(deltaTime);
    this.updateJumpPhysics(deltaTime);

    const inputState = getDaggerBanditInputState(this, currentAnim);

    this.handleAttack(inputState);
    this.handleBatFangAttack(inputState);
    this.handleVanishAppear(inputState);
    this.handleBlock(inputState);
    this.handleJump(inputState);
    this.handleMovement(inputState, deltaTime);
    this.handleMovementAnimations(inputState);
  }

  // Method called when vanish animation completes
  public onVanishComplete() {
    // Teleport to new position
    this.characterCenterX = this.vanishTargetX;
    this.bandit.x = this.characterCenterX;

    // Start appear animation
    this.bandit.play('bandit_appear');
  }

  // Method called when appear animation completes
  public onAppearComplete() {
    this.isVanished = false;
    this.bandit.play('bandit_idle');
  }

  changeScene() {
    this.scene.start('Game');
  }
}
