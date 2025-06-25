import { Scene } from 'phaser';
import { createPlayerAnimations, addPlayerAnimationListeners, isHighPriorityAnimation } from './animations';
import { setupPlayerInput, getInputState } from './inputs';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { debugGraphics } from '../../utils/debugGraphics';
import { AttackHitboxManager, AttackHitboxConfig } from '../../utils/attackHitbox';

export class Player {
  scene: Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  playerSpeed: number = 200;
  public playerScale: number = 3;
  private playerBoundingBox: Phaser.GameObjects.Graphics
  private readonly center_x_left: number = .7
  private readonly center_x_right: number = .305
  private readonly center_y: number = 1
  private readonly DASH_DISTANCE = 15000;
  private comboState: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_WINDOW_MAX = 600;
  private readonly COMBO_WINDOW_MIN = 300;
  private readonly bodyWidth = 15
  private readonly bodyHeight = 34

  // Combat system
  public attackPower: number = 30;
  public attackHitboxManager: AttackHitboxManager;
  public health: number = 100;
  public maxHealth: number = 100;
  private isInvulnerable: boolean = false;
  private invulnerabilityTimer: number = 0;
  private readonly INVULNERABILITY_DURATION = 1000; // ms
  private isDead: boolean = false;

  // Attack configurations
  private attackConfigs: { [key: string]: AttackHitboxConfig } = {
    'player_slash_1': {
      width: 200,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: this.attackPower,
      attackerId: 'player'
    },
    'player_slash_2': {
      width: 200,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: this.attackPower,
      attackerId: 'player'
    },
    'player_spin_attack': {
      width: 270,
      height: 70,
      offsetX_right: 45,
      offsetX_left: -45,
      offsetY: -35,
      duration: 400,
      damage: this.attackPower * 1.5,
      attackerId: 'player'
    },
    'player_slam_attack': {
      width: 220,
      height: 100,
      offsetX_right: 80,
      offsetX_left: -80,
      offsetY: -55,
      duration: 300,
      damage: this.attackPower * 1.2,
      attackerId: 'player'
    }
  };

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'swordMasterAtlas', 'Idle 0');
    this.setPlayerScale(this.playerScale);
    // Set texture filtering to nearest neighbor for crisp pixel art
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(300);
    this.sprite.setBodySize(this.bodyWidth, this.bodyHeight, false)
    this.adjustForCenterOffset('right')
    this.sprite.setDepth(1)
    this.playerBoundingBox = scene.add.graphics();
    this.attackHitboxManager = new AttackHitboxManager(scene);
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

  public adjustForCenterOffset = (direction: 'left' | 'right') => {
    if(direction === 'left') {
      this.sprite.setOrigin(this.center_x_left, this.center_y)
    } else {
      this.sprite.setOrigin(this.center_x_right, this.center_y)
    }
    this.sprite.body.setOffset(this.sprite.displayOriginX - this.bodyWidth/2, 0)
  }

  public takeDamage(amount: number) {
    if (this.isInvulnerable || this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    console.log(`Player took ${amount} damage! Health: ${this.health}/${this.maxHealth}`);

    if (this.health <= 0) {
      console.log('Player defeated!');
      this.isDead = true;
      this.sprite.play('player_death');
      this.sprite.setVelocityX(0);
    } else {
      this.sprite.play('player_hit');

      // Add knockback effect
      const knockbackForce = 200;
      const knockbackDirection = this.sprite.flipX ? 1 : -1; // Opposite to facing direction
      this.sprite.setVelocityX(knockbackDirection * knockbackForce);

      // Start invulnerability period
      this.isInvulnerable = true;
      this.invulnerabilityTimer = 0;

      this.sprite.setTint(0xf0f8ff);
      this.scene.time.delayedCall(200, () => {
        this.sprite.clearTint();
        this.sprite.setVelocityX(0);
      });
    }
  }

  private updateInvulnerabilityTimer(delta: number) {
    if (this.isInvulnerable) {
      this.invulnerabilityTimer += delta;
      if (this.invulnerabilityTimer >= this.INVULNERABILITY_DURATION) {
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
      }
    }
  }

  public setPlayerScale(scale: number) {
    this.playerScale = scale;
    this.sprite.setScale(scale);
  }

  private performDash(deltaTime: number) {
    const dashDirection = this.sprite.flipX ? -1 : 1; // -1 for left, 1 for right
    const dashDistance = this.DASH_DISTANCE * dashDirection;
    this.sprite.x += dashDistance * deltaTime;
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

  private handleMovement(inputState: ReturnType<typeof getInputState>) {
    if (inputState.canMove && inputState.isMoving) {
      const moveSpeed = inputState.isRunning ? this.playerSpeed * 2 : this.playerSpeed;

      if (inputState.isMovingLeft) {
        this.sprite.setVelocityX(-moveSpeed);
        setSpriteDirection(this.sprite, 'left', this.adjustForCenterOffset);
      } else if (inputState.isMovingRight) {
        this.sprite.setVelocityX(moveSpeed);
        setSpriteDirection(this.sprite, 'right', this.adjustForCenterOffset);
      }
    } else if(inputState.justStoppedMoving) {
      this.sprite.setVelocityX(0)
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
        this.createAttackHitbox('player_slash_1');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        // Second attack in combo
        this.sprite.play('player_slash_2');
        this.createAttackHitbox('player_slash_2');

        const dashDirection = this.sprite.flipX ? -1 : 1; // -1 for left, 1 for right
        const dashDistance = 1500 * dashDirection;
        this.sprite.x += dashDistance * deltaTime;

        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        // Third attack in combo
        this.sprite.play('player_spin_attack');
        this.createAttackHitbox('player_spin_attack');
        this.resetCombo()
      }
    }
  }

  private handleSlamAttack(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldSlamAttack) {

      this.shouldResetCombo()

      if(inputState.isInAir && this.comboState === 0) {
        this.sprite.play('player_slam_attack');
        this.createAttackHitbox('player_slam_attack');
        this.sprite.setVelocityY(400);
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 0) {
        this.sprite.play('player_slam_attack');
        this.createAttackHitbox('player_slam_attack');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        setSpriteDirection(this.sprite, this.sprite.flipX ? 'right' : 'left', this.adjustForCenterOffset);
        this.sprite.play('player_slam_attack');
        this.createAttackHitbox('player_slam_attack');
        this.resetCombo()
      }
    }
  }

  private handleDash(inputState: ReturnType<typeof getInputState>, deltaTime: number) {
    if (inputState.shouldDash) {
      this.performDash(deltaTime);
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

  private handleFall(inputState: ReturnType<typeof getInputState>) {
    if (inputState.shouldFall) {
      this.sprite.play('player_fall');
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

    // Don't do anything if dead
    if (this.isDead) return;

    this.updateComboTimer(deltaTime);

    // Update invulnerability timer
    this.updateInvulnerabilityTimer(delta);

    const inputState = getInputState(this, currentAnim);
    this.handleSlash(inputState, deltaTime);
    this.handleSlamAttack(inputState);
    this.handleDash(inputState, deltaTime);
    this.handleBlock(inputState)
    this.handleJump(inputState);
    this.handleFall(inputState);
    this.handleMovement(inputState);
    this.handleMovementAnimations(inputState);

    // Update attack hitboxes
    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, direction);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    // debugGraphics(this.playerBoundingBox, this.sprite, this.playerScale, this.attackHitboxManager.getActiveHitboxes());
  }
}
