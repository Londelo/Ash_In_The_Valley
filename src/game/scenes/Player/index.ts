import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { createPlayerAnimations, addPlayerAnimationListeners, isHighPriorityAnimation } from './animations';
import { setupPlayerInput, getInputState } from './inputs';

export class Player extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  playerSpeed: number = 200;

  // Player scaling
  private playerScale: number = 3;

  // Character positioning constants (base values for scale 1)
  private readonly BASE_FRAME_WIDTH = 90;
  private readonly BASE_CHARACTER_CENTER_RIGHT = 20;  // Character center when facing right
  private readonly BASE_CHARACTER_CENTER_LEFT = 85;   // Character center when facing left

  // Computed values based on current scale
  private get FRAME_WIDTH() { return this.BASE_FRAME_WIDTH * this.playerScale/2; }
  private get CHARACTER_CENTER_RIGHT() { return this.BASE_CHARACTER_CENTER_RIGHT * this.playerScale/2; }
  private get CHARACTER_CENTER_LEFT() { return this.BASE_CHARACTER_CENTER_LEFT * this.playerScale/2; }
  private get FRAME_CENTER() { return this.FRAME_WIDTH / 2; }

  // Track the character's logical center position
  private characterCenterX: number = 512;

  // Jump physics
  private readonly GROUND_Y = 600;
  private readonly JUMP_VELOCITY = -400;
  private readonly GRAVITY = 800;
  private velocityY: number = 0;

  public isOnGround: boolean = true;
  public wasRunningBeforeJump: boolean = false;
  public isJumping: boolean = false;

  private readonly DASH_DISTANCE = 180;

  // Combo attack system
  private comboState: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_WINDOW_MAX = 600;
  private readonly COMBO_WINDOW_MIN = 300;


  constructor() {
    super( 'Player' );
  }

  public setPlayerScale(scale: number) {
    this.playerScale = scale;
    this.player.setScale(scale);

    this.adjustForCenterOffset();
  }

  private adjustForCenterOffset() {
    //The sprite for this character is not positioned directly in the center of its frame
    if ( this.player.flipX ) {
      // Facing left: character center is at CHARACTER_CENTER_LEFT from left edge of frame
      this.player.x = this.characterCenterX + ( this.FRAME_CENTER - this.CHARACTER_CENTER_LEFT );
    } else {
      // Facing right: character center is at CHARACTER_CENTER_RIGHT from left edge of frame
      this.player.x = this.characterCenterX + ( this.FRAME_CENTER - this.CHARACTER_CENTER_RIGHT );
    }
  }

  private moveCharacter( deltaX: number ) {
    this.characterCenterX += deltaX;

    // Keep character within screen bounds (accounting for character bounds, not sprite bounds)
    const characterHalfWidth = ( this.CHARACTER_CENTER_LEFT - this.CHARACTER_CENTER_RIGHT ) / 2;
    this.characterCenterX = Phaser.Math.Clamp(
      this.characterCenterX,
      characterHalfWidth + this.CHARACTER_CENTER_RIGHT,
      this.scale.width - characterHalfWidth - this.CHARACTER_CENTER_RIGHT
    );

    this.adjustForCenterOffset();
  }

  private setCharacterDirection( facingLeft: boolean ) {
    this.player.setFlipX( facingLeft );
    this.adjustForCenterOffset();
  }


  private performDash() {
    const dashDirection = this.player.flipX ? -1 : 1; // -1 for left, 1 for right
    const dashDistance = this.DASH_DISTANCE * dashDirection;

    // Calculate the dash movement from the left side of the frame
    const frameLeftSide = this.player.x - (this.FRAME_WIDTH / 2);
    const newFrameLeftSide = frameLeftSide + dashDistance;
    const newCharacterCenterX = newFrameLeftSide + (this.FRAME_WIDTH / 2) +
                               (this.player.flipX ? this.CHARACTER_CENTER_LEFT - this.FRAME_CENTER :
                                                   this.CHARACTER_CENTER_RIGHT - this.FRAME_CENTER);

    // Apply the dash movement
    this.characterCenterX = newCharacterCenterX;

    // Keep character within screen bounds
    const characterHalfWidth = (this.CHARACTER_CENTER_LEFT - this.CHARACTER_CENTER_RIGHT) / 2;
    this.characterCenterX = Phaser.Math.Clamp(
      this.characterCenterX,
      characterHalfWidth + this.CHARACTER_CENTER_RIGHT,
      this.scale.width - characterHalfWidth - this.CHARACTER_CENTER_RIGHT
    );

    this.adjustForCenterOffset();
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

  private updateJumpPhysics( deltaTime: number ) {
    const currentAnim = this.player.anims.currentAnim?.key;

    if ( !this.isOnGround ) {
      // Apply gravity
      this.velocityY += this.GRAVITY * deltaTime;

      // Update Y position
      this.player.y += this.velocityY * deltaTime;

      // Check if we've reached the peak and started falling
      if ( this.velocityY > 0 && this.isJumping ) {
        this.isJumping = false;
        if(currentAnim !== 'player_slam_attack') {
          this.player.play( 'player_fall' );
        }
      }

      // Check if we've landed
      if ( this.player.y >= this.GROUND_Y ) {
        this.player.y = this.GROUND_Y;
        this.velocityY = 0;
        this.isOnGround = true;
        this.isJumping = false;

        // Reset running state when landing
        this.wasRunningBeforeJump = false;

        if(currentAnim !== 'player_slam_attack') {
          this.player.play( 'player_land' );
        }
      }
    }
  }

  private handleMovement(inputState: ReturnType<typeof getInputState>, deltaTime: number) {
    if (inputState.canMove && inputState.isMoving) {
      const baseSpeed = this.playerSpeed * deltaTime;
      const moveSpeed = inputState.isRunning ? baseSpeed * 2 : baseSpeed;

      if (inputState.isMovingLeft) {
        this.moveCharacter(-moveSpeed);
        this.setCharacterDirection(true); // Facing left
      } else if (inputState.isMovingRight) {
        this.moveCharacter(moveSpeed);
        this.setCharacterDirection(false); // Facing right
      }
    }
  }

  private handleMovementAnimations(inputState: ReturnType<typeof getInputState>) {
    // Don't override priority animations like landing
    const currentAnim = this.player.anims.currentAnim?.key;
    if (isHighPriorityAnimation(currentAnim)) {
      return;
    }

    if (inputState.shouldPlayWalkAnimation) {
      this.player.play('player_walk');
    } else if (inputState.shouldPlayRunAnimation) {
      this.player.play('player_run');
    } else if (inputState.shouldPlayIdleAnimation) {
      this.player.play('player_idle');
    }
  }

  private handleSlash(inputState: ReturnType<typeof getInputState>, deltaTime: number) {
    if (inputState.shouldAttack) {

      this.shouldResetCombo()

      if (this.comboState === 0) {
        // First attack in combo
        this.player.play('player_slash_1');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        // Second attack in combo
        this.player.play('player_slash_2');

        const baseSpeed = 2000 * deltaTime;
        if (this.player.flipX) {
          this.moveCharacter(-baseSpeed);
          this.setCharacterDirection(true); // Facing left
        } else {
          this.moveCharacter(baseSpeed);
          this.setCharacterDirection(false); // Facing right
        }

        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        // Third attack in combo
        this.player.play('player_spin_attack');
        this.resetCombo()
      }
    }
  }

  private handleSlamAttack(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldSlamAttack) {

      this.shouldResetCombo()

      if(inputState.isInAir && this.comboState === 0) {
        this.player.play('player_slam_attack');
        this.velocityY += this.GRAVITY / 3
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 0) {
        this.player.play('player_slam_attack');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        this.setCharacterDirection(!this.player.flipX); // Facing right
        this.player.play('player_slam_attack');
        this.resetCombo()
      }
    }
  }

  private handleDash(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldDash) {
      this.performDash();
      this.player.play('player_dash');
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleBlock(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldBlock) {
      this.player.play('player_block');
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleJump(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldJump) {
      // Remember if we were running before jumping
      this.wasRunningBeforeJump = inputState.isRunning;
      this.velocityY = this.JUMP_VELOCITY;
      this.isOnGround = false;
      this.isJumping = true;
      this.player.play('player_jump');
    }
  }

  private initPlayer() {
    // Create player sprite using the atlas with the first idle frame
    this.player = this.add.sprite(512, this.GROUND_Y, 'mainCharacterAtlas', 'Idle 0');
    this.setPlayerScale(this.playerScale);
    // Set texture filtering to nearest neighbor for crisp pixel art
    this.player.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    // Initialize character center position
    this.characterCenterX = 512;
    this.adjustForCenterOffset();
  }

  private initBackground() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x87CEEB);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.3);
  }

  create() {
    this.initBackground();

    this.initPlayer();

    // Set up inputs
    const { cursors, inputKeys } = setupPlayerInput(this);
    this.cursors = cursors;
    this.inputKeys = inputKeys;

    createPlayerAnimations(this);

    addPlayerAnimationListeners(this);

    this.player.play('player_idle');

    EventBus.emit('current-scene-ready', this);
  }

  update( time: number, delta: number ) {
    const deltaTime = delta / 1000; // Convert to seconds
    const currentAnim = this.player.anims.currentAnim?.key;

    this.updateComboTimer(deltaTime);
    this.updateJumpPhysics( deltaTime );

    const inputState = getInputState(this, currentAnim);
    this.handleSlash(inputState, deltaTime);
    this.handleSlamAttack(inputState);
    this.handleDash(inputState);
    this.handleBlock(inputState)
    this.handleJump(inputState);
    this.handleMovement(inputState, deltaTime);
    this.handleMovementAnimations(inputState);
  }

  changeScene() {
    this.scene.start( 'DaggerBandit' );
  }
}