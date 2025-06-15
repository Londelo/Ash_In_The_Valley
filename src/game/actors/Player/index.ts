import { Scene } from 'phaser';
import { createPlayerAnimations, addPlayerAnimationListeners, isHighPriorityAnimation } from './animations';
import { setupPlayerInput, getInputState } from './inputs';

export class Player {
  scene: Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  playerSpeed: number = 200;

  // Player scaling
  private playerScale: number = 3;

  private readonly DASH_DISTANCE = 180;

  // Combo attack system
  private comboState: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_WINDOW_MAX = 600;
  private readonly COMBO_WINDOW_MIN = 300;

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    
    // Create sprite using the atlas with the first idle frame
    this.sprite = scene.physics.add.sprite(x, y, 'mainCharacterAtlas', 'Idle 0');
    this.setPlayerScale(this.playerScale);
    
    // Set texture filtering to nearest neighbor for crisp pixel art
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    
    // Set origin to bottom center for proper ground positioning
    this.sprite.setOrigin(0.5, 1);
    
    // Enable physics
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setGravityY(300);
  }

  public setPlayerScale(scale: number) {
    this.playerScale = scale;
    this.sprite.setScale(scale);
  }

  private setCharacterDirection(facingLeft: boolean) {
    this.sprite.setFlipX( facingLeft );
  }

  private performDash() {
    const dashDirection = this.sprite.flipX ? -1 : 1; // -1 for left, 1 for right
    const dashDistance = this.DASH_DISTANCE * dashDirection;
    this.sprite.x += dashDistance;
  }

  public resetCombo() {
    this.comboState = 0;
    this.comboTimer = 0;
  }

  private shouldResetCombo() {
    if (this.comboTimer < this.COMBO_WINDOW_MIN || this.comboTimer > this.COMBO_WINDOW_MAX) {
      this.resetCombo()
    }
  }

  private updateComboTimer(deltaTime: number) {
    if (this.comboState > 0) {
      this.comboTimer += deltaTime * 1000; // Convert to milliseconds
    }
  }

  private handleMovement(inputState: ReturnType<typeof getInputState>, deltaTime: number) {
    if (inputState.canMove && inputState.isMoving) {
      const baseSpeed = this.playerSpeed * deltaTime;
      const moveSpeed = inputState.isRunning ? baseSpeed * 2 : baseSpeed;

      if (inputState.isMovingLeft) {
        this.sprite.setVelocityX(-moveSpeed);
        this.setCharacterDirection(true); // Facing left
      } else if (inputState.isMovingRight) {
        this.sprite.setVelocityX(moveSpeed);
        this.setCharacterDirection(false); // Facing right
      }
    } else {
      this.sprite.setVelocityX(0);
    }
  }

  private handleMovementAnimations(inputState: ReturnType<typeof getInputState>) {
    // Don't override priority animations like landing
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (isHighPriorityAnimation(currentAnim)) {
      return;
    }

    if (inputState.shouldPlayWalkAnimation) {
      this.sprite.play('player_walk');
    } else if (inputState.shouldPlayRunAnimation) {
      this.sprite.play('player_run');
    } else if (inputState.shouldPlayIdleAnimation) {
      this.sprite.play('player_idle');
    }
  }

  private handleSlash(inputState: ReturnType<typeof getInputState>, deltaTime: number) {
    if (inputState.shouldAttack) {

      this.shouldResetCombo()

      if (this.comboState === 0) {
        // First attack in combo
        this.sprite.play('player_slash_1');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        // Second attack in combo
        this.sprite.play('player_slash_2');

        const baseSpeed = 2000 * deltaTime;
        if (this.sprite.flipX) {
          this.sprite.x -= baseSpeed;
          this.setCharacterDirection(true); // Facing left
        } else {
          this.sprite.x += baseSpeed;
          this.setCharacterDirection(false); // Facing right
        }

        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        // Third attack in combo
        this.sprite.play('player_spin_attack');
        this.resetCombo()
      }
    }
  }

  private handleSlamAttack(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldSlamAttack) {

      this.shouldResetCombo()

      if(inputState.isInAir && this.comboState === 0) {
        this.sprite.play('player_slam_attack');
        this.sprite.setVelocityY(400);
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 0) {
        this.sprite.play('player_slam_attack');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        this.setCharacterDirection(!this.sprite.flipX); // Facing right
        this.sprite.play('player_slam_attack');
        this.resetCombo()
      }
    }
  }

  private handleDash(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldDash) {
      this.performDash();
      this.sprite.play('player_dash');
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleBlock(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldBlock) {
      this.sprite.play('player_block');
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleJump(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldJump) {
      this.sprite.setVelocityY(-400);
      this.sprite.play('player_jump');
    }
  }

  create() {
    // Set up inputs
    const { cursors, inputKeys } = setupPlayerInput(this.scene);
    this.cursors = cursors;
    this.inputKeys = inputKeys;

    createPlayerAnimations(this.scene);
    addPlayerAnimationListeners(this);

    this.sprite.play('player_idle');
  }

  update( time: number, delta: number ) {
    const deltaTime = delta / 1000; // Convert to seconds
    const currentAnim = this.sprite.anims.currentAnim?.key;

    this.updateComboTimer(deltaTime);

    const inputState = getInputState(this, currentAnim);
    this.handleSlash(inputState, deltaTime);
    this.handleSlamAttack(inputState);
    this.handleDash(inputState);
    this.handleBlock(inputState)
    this.handleJump(inputState);
    this.handleMovement(inputState, deltaTime);
    this.handleMovementAnimations(inputState);
  }
}