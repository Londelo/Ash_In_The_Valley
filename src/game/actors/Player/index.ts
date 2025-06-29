import { Scene } from 'phaser';
import { State, PlayerState } from './state';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { AttackHitboxManager } from '../../components/AttackHitbox';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getAllAnimationConfigs } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';
import { getAttackConfig } from './attackConfigs';
import { getActorConfig } from './actorConfigs';

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
  private readonly DASH_DISTANCE = 15000;
  private comboState: number = 0;
  private comboTimer: number = 0;
  private readonly COMBO_WINDOW_MAX = 600;
  private readonly COMBO_WINDOW_MIN = 300;
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

  private addPlayerAnimationListeners() {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (this.state.isActionAnimations(animation.key) && !animation.key.includes('_player_death')) {
        this.sprite.play(`${this.playerSkin}_player_idle`);
      } else if (animation.key.includes('_player_death')) {
        this.sprite.anims.stop();
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

  private performDash(deltaTime: number) {
    const dashDirection = this.sprite.flipX ? -1 : 1;
    const dashDistance = this.DASH_DISTANCE * dashDirection;
    this.sprite.x += dashDistance * deltaTime;
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
      this.comboTimer += deltaTime * 1000;
    }
  }

  private changeSkin(newSkin: PlayerSkins) {
    if (this.playerSkin === newSkin) return;

    console.log('Changing skin from', this.playerSkin, 'to', newSkin);
    
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
    
    console.log('Skin changed successfully to', newSkin);
  }

  private getNextSkin(): PlayerSkins {
    const skinOrder: PlayerSkins[] = ['swordMaster', 'bloodSwordsMan', 'lordOfFlames', 'holySamurai'];
    const currentIndex = skinOrder.indexOf(this.playerSkin);
    const nextIndex = (currentIndex + 1) % skinOrder.length;
    return skinOrder[nextIndex];
  }

  private handleSkinChange() {
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.C)) {
      const nextSkin = this.getNextSkin();
      this.changeSkin(nextSkin);
    }
  }

  private handleMovement(state: PlayerState) {
    if (state.canMove && state.isMoving) {
      const moveSpeed = state.isRunning ? this.playerSpeed * 2 : this.playerSpeed;

      if (state.isMovingLeft) {
        this.sprite.setVelocityX(-moveSpeed);
        setSpriteDirection(this.sprite, 'left', this.adjustForCenterOffset);
      } else if (state.isMovingRight) {
        this.sprite.setVelocityX(moveSpeed);
        setSpriteDirection(this.sprite, 'right', this.adjustForCenterOffset);
      }
    } else if (state.justStoppedMoving) {
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

  private handleSlash(state: PlayerState, deltaTime: number) {
    if (state.shouldAttack) {
      this.shouldResetCombo();

      if (this.comboState === 0) {
        this.sprite.play(`${this.playerSkin}_player_attack_1`);
        this.createAttackHitbox(`${this.playerSkin}_player_attack_1`);
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        this.sprite.play(`${this.playerSkin}_player_attack_2`);
        this.createAttackHitbox(`${this.playerSkin}_player_attack_2`);

        const dashDirection = this.sprite.flipX ? -1 : 1;
        const dashDistance = 1500 * dashDirection;
        this.sprite.x += dashDistance * deltaTime;

        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        this.sprite.play(`${this.playerSkin}_player_attack_3`);
        this.createAttackHitbox(`${this.playerSkin}_player_attack_3`);
        this.resetCombo();
      }
    }
  }

  private handleSlamAttack(state: PlayerState) {
    if (state.shouldSlamAttack) {
      if (state.isInAir) {
        this.sprite.play(`${this.playerSkin}_player_slam_attack`);
        this.createAttackHitbox(`${this.playerSkin}_player_slam_attack`);
        this.sprite.setVelocityY(400);
      }
    }
  }

  private handleDash(state: PlayerState, deltaTime: number) {
    if (state.shouldDash) {
      this.performDash(deltaTime);
      this.sprite.play(`${this.playerSkin}_player_dash`);
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleBlock(state: PlayerState) {
    if (state.shouldBlock) {
      this.sprite.play(`${this.playerSkin}_player_block`);
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleJump(state: PlayerState) {
    if (state.shouldJump) {
      this.sprite.setVelocityY(-400);
      this.sprite.play(`${this.playerSkin}_player_jump`);
    }
  }

  private handleFall(state: PlayerState) {
    if (state.shouldFall) {
      this.sprite.play(`${this.playerSkin}_player_fall`);
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

    const state = this.state.getState(currentAnim);
    this.handleSlash(state, deltaTime);
    this.handleSlamAttack(state);
    this.handleDash(state, deltaTime);
    this.handleBlock(state);
    this.handleJump(state);
    this.handleFall(state);
    this.handleMovement(state);
    this.handleMovementAnimations(state);

    const direction = this.sprite.flipX ? 'left' : 'right';
    this.attackHitboxManager.updateHitboxes(this.sprite.x, this.sprite.y, direction);
    this.attackHitboxManager.cleanupInactiveHitboxes();

    this.renderDebugGraphics(this.attackHitboxManager.getActiveHitboxes());
  }
}