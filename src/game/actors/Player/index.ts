import { Scene } from 'phaser';
import { State, PlayerState } from './state';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { AttackHitboxManager } from '../../components/AttackHitbox';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getAllAnimationConfigs } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';
import { getAttackConfig } from './attackConfigs';
import { getActorConfig } from './actorConfigs';
import { EventBus } from '../../EventBus';

export type PlayerSkins = 'swordMaster' | 'bloodSwordsMan' | 'lordOfFlames' | 'holySamurai'

const skinAtlasMap: { [K in PlayerSkins]: string } = {
  'swordMaster': 'swordMasterAtlas',
  'bloodSwordsMan': 'bloodSwordsmanAtlas',
  'lordOfFlames': 'lordOfFlamesAtlas',
  'holySamurai': 'holySamuraiAtlas'
};

const skinFrameMap: { [K in PlayerSkins]: string } = {
  'swordMaster': 'Idle 0',
  'bloodSwordsMan': 'idle 0',
  'lordOfFlames': 'Idle 0',
  'holySamurai': 'Idle 0'
};

export class Player extends Actor {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  playerSpeed: number = 200;
  private readonly DASH_VELOCITY = 800;
  private readonly DASH_DURATION = 300; // milliseconds
  private dashTimer: number = 0;
  private isDashing: boolean = false;
  private comboState: number = 0;
  private comboTimer: number = 0;
  private comboWindowMin: number = 0;
  private comboWindowMax: number = 0;
  private state: State;
  public playerSkin: PlayerSkins;
  public attackHitboxManager: AttackHitboxManager;
  public debugEnabled: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    const playerSkin: PlayerSkins = 'swordMaster';
    const actorConfig: ActorConfig = getActorConfig(playerSkin);
    super(scene, x, y, skinAtlasMap[playerSkin], skinFrameMap[playerSkin], actorConfig);
    this.playerSkin = playerSkin;
    this.sprite.setDepth(1);
    this.attackHitboxManager = new AttackHitboxManager(scene);
  }

  private createAllPlayerAnimations(scene: Scene) {
    const animationManager = new AnimationHelper(scene);
    const allAnimationConfigs = getAllAnimationConfigs();
    animationManager.createAnimations(allAnimationConfigs);
  }

  private createAttackHitbox(attackType: string) {
    const attackConfigFn = getAttackConfig(this.playerSkin);
    const config = attackConfigFn ? attackConfigFn(this)[attackType] : undefined;
    if (!config) {
      console.error('MISSING ATTACK CONFIG for skin:', this.playerSkin, 'attack:', attackType);
      return;
    }

    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.createAttackHitbox(
      this.sprite.x,
      this.sprite.y,
      config,
      direction
    );
  }

  private getAnimationDuration(animationKey: string): number {
    const animation = this.scene.anims.get(animationKey);
    if (!animation) {
      console.warn(`Animation ${animationKey} not found`);
      return 0;
    }

    const frameCount = animation.frames.length;
    const frameRate = animation.frameRate;
    const duration = (frameCount / frameRate) * 1000;

    return duration;
  }

  private setComboWindow(animationKey: string) {
    const duration = this.getAnimationDuration(animationKey);
    this.comboWindowMin = duration - 150;
    this.comboWindowMax = duration + 150;
  }

  private addPlayerAnimationListeners() {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (this.state.isActionAnimations(animation.key) && !animation.key.includes('_player_death')) {
        this.sprite.play(`${this.playerSkin}_player_idle`);
      } else if (animation.key.includes('_player_death')) {
        this.sprite.anims.stop();
      } else if (animation.key.includes('_player_dash')) {
        // Dash animation completed, stop dashing and reset velocity
        this.isDashing = false;
        this.dashTimer = 0;
        this.sprite.setVelocityX(0);
      }
    });
  }

  private setupPlayerInput(scene: Phaser.Scene) {
    if (scene.input && scene.input.keyboard) {
      const cursors = scene.input.keyboard.createCursorKeys();
      const inputKeys = scene.input.keyboard.addKeys('R,Q,E,W,SPACE,C') as { [key: string]: Phaser.Input.Keyboard.Key };
      return { cursors, inputKeys };
    } else {
      throw new Error('Keyboard input plugin is not available.');
    }
  }

  private performDash() {
    const dashDirection = this.sprite.flipX ? -1 : 1;
    this.sprite.setVelocityX(this.DASH_VELOCITY * dashDirection);
    this.isDashing = true;
    this.dashTimer = 0;
  }

  private updateDash(delta: number) {
    if (this.isDashing) {
      this.dashTimer += delta;

      // Stop dash after duration
      if (this.dashTimer >= this.DASH_DURATION) {
        this.isDashing = false;
        this.dashTimer = 0;
        this.sprite.setVelocityX(0);
      }
    }
  }

  public resetCombo() {
    this.comboState = 0;
    this.comboTimer = 0;
    this.comboWindowMin = 0;
    this.comboWindowMax = 0;
  }

  private isInComboWindow(): boolean {
    if (this.comboState === 0) return true; // First attack always allowed

    return this.comboTimer >= this.comboWindowMin && this.comboTimer <= this.comboWindowMax;
  }

  private updateComboTimer(deltaTime: number) {
    if (this.comboState > 0) {
      this.comboTimer += deltaTime * 1000;

      // Reset combo if we exceed the max window
      if (this.comboTimer > this.comboWindowMax) {
        this.resetCombo();
      }
    }
  }

  public changeSkin(newSkin: PlayerSkins) {
    if (this.playerSkin === newSkin) return;

    // Stop current animation
    this.sprite.anims.stop();

    // Update skin
    this.playerSkin = newSkin;

    // Update config
    this.config = getActorConfig(newSkin);

    // Update sprite texture and body
    this.sprite.setTexture(skinAtlasMap[newSkin], skinFrameMap[newSkin]);
    this.sprite.setBodySize(this.config.bodyWidth, this.config.bodyHeight, true);
    this.adjustForCenterOffset(this.sprite.flipX ? 'left' : 'right');

    // Play idle animation with new skin prefix
    this.sprite.play(`${this.playerSkin}_player_idle`);

    // Emit event for skin change
    EventBus.emit('player_skin_changed', newSkin);
  }

  private getNextSkin(): PlayerSkins {
    const skinOrder: PlayerSkins[] = ['swordMaster', 'bloodSwordsMan', 'lordOfFlames', 'holySamurai'];
    const currentIndex = skinOrder.indexOf(this.playerSkin);
    const nextIndex = (currentIndex + 1) % skinOrder.length;
    return skinOrder[nextIndex];
  }

  private handleSkinChange() {
    // if (Phaser.Input.Keyboard.JustDown(this.inputKeys.C)) {
    //   const nextSkin = this.getNextSkin();
    //   this.changeSkin(nextSkin);
    // }
  }

  private handleMovement(state: PlayerState) {
    if (this.isDashing) return

    if (state.canMove && state.isMoving) {
      const moveSpeed = state.isRunning ? this.playerSpeed * 2 : this.playerSpeed;

      if (state.isMovingLeft) {
        this.sprite.setVelocityX(-moveSpeed);
        setSpriteDirection(this.sprite, 'left', this.adjustForCenterOffset);
      } else if (state.isMovingRight) {
        this.sprite.setVelocityX(moveSpeed);
        setSpriteDirection(this.sprite, 'right', this.adjustForCenterOffset);
      }
    } else if (state.justStoppedMoving && !this.isDashing && !state.isWallSliding) {
      this.sprite.setVelocityX(0);
    }
  }

  private handleMovementAnimations(state: PlayerState) {
    const currentAnim = this.sprite.anims.currentAnim?.key;
    if (this.state.isHighPriorityAnimation(currentAnim)) {
      return;
    }

    if (state.shouldPlayWalkAnimation) {
      this.sprite.play(`${this.playerSkin}_player_walk`);
    } else if (state.shouldPlayRunAnimation) {
      this.sprite.play(`${this.playerSkin}_player_run`);
    } else if (state.shouldPlayIdleAnimation) {
      this.sprite.play(`${this.playerSkin}_player_idle`);
    }
  }

  private handleWallSlide(state: PlayerState) {
    if (state.shouldWallSlide && !state.isWallSliding) {
      this.sprite.body.setGravityY(-1);
      this.sprite.setVelocityY(0);
      this.sprite.play(`${this.playerSkin}_player_wall_hold`);
    } else if (state.shouldStopWallSlide && state.isWallSliding) {
      this.sprite.play(`${this.playerSkin}_player_idle`);
      this.sprite.body.setGravityY(0); // Restore normal gravity
      this.sprite.setVelocityY(0);
    }
  }

  private handleWallJump(state: PlayerState) {
    if (state.shouldWallJump) {
      // Re-enable gravity for wall jump
      this.sprite.body.setGravityY(0);

      // Jump away from wall
      const jumpDirection = this.sprite.flipX ? 1 : -1;
      this.sprite.setVelocityX(this.playerSpeed * jumpDirection);
      this.sprite.setVelocityY(-600);

      // Face away from wall
      setSpriteDirection(this.sprite, jumpDirection > 0 ? 'right' : 'left', this.adjustForCenterOffset);

      this.sprite.play(`${this.playerSkin}_player_jump`);
    }
  }

  private handleSlash(state: PlayerState, deltaTime: number) {
    if (state.shouldAttack) {
      // Check if we're in the combo window
      if (!this.isInComboWindow()) {
        this.resetCombo();
        return;
      }

      if (this.comboState === 0) {
        const attackKey = `${this.playerSkin}_player_attack_1`;
        this.setComboWindow(attackKey);

        this.sprite.play(attackKey);
        this.createAttackHitbox(attackKey);
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        const attackKey = `${this.playerSkin}_player_attack_2`;
        this.setComboWindow(attackKey);

        this.sprite.play(attackKey);
        this.createAttackHitbox(attackKey);
        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        const attackKey = `${this.playerSkin}_player_attack_3`;

        this.sprite.play(attackKey);
        this.createAttackHitbox(attackKey);
        this.resetCombo();
      }
    }
  }

  private handleSlamAttack(state: PlayerState) {
    if (state.shouldSlamAttack) {
      if (state.isInAir) {
        const attackKey = `${this.playerSkin}_player_slam_attack`;
        const duration = this.getAnimationDuration(attackKey);

        this.sprite.play(attackKey);
        this.createAttackHitbox(attackKey);
        this.sprite.setVelocityY(400);
      }
    }
  }

  private handleDash(state: PlayerState) {
    if (state.shouldDash) {
      this.performDash();
      this.sprite.play(`${this.playerSkin}_player_dash`);
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleBlock(state: PlayerState) {
    if (state.shouldBlock) {
      this.sprite.play(`${this.playerSkin}_player_heal`);
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleJump(state: PlayerState) {
    if (state.shouldJump) {
      this.sprite.setVelocityY(-700);
      this.sprite.play(`${this.playerSkin}_player_jump`);
    }
  }

  private handleFall(state: PlayerState) {
    if (state.shouldFall) {
      this.sprite.play(`${this.playerSkin}_player_fall`);
    }
  }

  private handleLanding(state: PlayerState) {
    if (state.shouldLand) {
      this.sprite.play(`${this.playerSkin}_player_land`);
    }
  }

  create() {
    const { cursors, inputKeys } = this.setupPlayerInput(this.scene);
    this.cursors = cursors;
    this.inputKeys = inputKeys;

    this.state = new State(this);
    this.createAllPlayerAnimations(this.scene);
    this.addPlayerAnimationListeners();
    this.sprite.play(`${this.playerSkin}_player_idle`);
  }

  update(time: number, delta: number) {
    const deltaTime = delta / 1000;
    const currentAnim = this.sprite.anims.currentAnim?.key;

    if (this.isDead) return;

    this.handleSkinChange();
    this.updateComboTimer(deltaTime);
    this.updateInvulnerabilityTimer(delta);
    this.updateDash(delta);

    const state = this.state.getState(currentAnim);
    this.handleWallSlide(state);
    this.handleWallJump(state);
    this.handleSlash(state, deltaTime);
    this.handleSlamAttack(state);
    this.handleDash(state);
    this.handleBlock(state);
    this.handleJump(state);
    this.handleFall(state);
    this.handleLanding(state);
    this.handleMovement(state);
    this.handleMovementAnimations(state);

    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, direction);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    // Update health bar position
    this.healthBar?.update(this.health, this.maxHealth);

    this.renderDebugGraphics(this.attackHitboxManager.getActiveHitboxes());
  }
}
