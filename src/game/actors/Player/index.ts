import { Scene } from 'phaser';
import { State, PlayerState } from './state';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { AttackHitboxManager } from '../../components/AttackHitbox';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getAnimationConfig } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';
import { getAttackConfig } from './attackConfigs';

export type PlayerSkins = 'swordMaster' | 'bloodSwordsMan' | 'lordOfFames' | 'holySamurai'

const skinAtlasMap: { [K in PlayerSkins]: string } = {
  'swordMaster': 'swordMasterAtlas',
  'bloodSwordsMan': 'bloodSwordsmanAtlas',
  'lordOfFames': 'lordOfFamesAtlas',
  'holySamurai': 'holySamuraiAtlas'
};

const skinFrameMap: { [K in PlayerSkins]: string } = {
  'swordMaster': 'Idle 0',
  'bloodSwordsMan': 'idle 0',
  'lordOfFames': 'idle 0',
  'holySamurai': 'idle 0'
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
  private playerSkin: PlayerSkins = 'swordMaster'
  public attackHitboxManager: AttackHitboxManager;

  constructor(scene: Scene, x: number, y: number) {
    const actorConfig: ActorConfig = {
      scale: 3,
      bodyWidth: 15,
      bodyHeight: 34,
      centerXLeft: 0.7,
      centerXRight: 0.305,
      centerY: 1,
      health: 100,
      attackPower: 30,
      invulnerabilityDuration: 1000,
      bodyOffsetY: 0,
      knockbackForce: 200,
      deathAnimationKey: 'player_death',
      hitAnimationKey: 'player_hit'
    };

    super(scene, x, y, skinAtlasMap[actorConfig.playerSkin || 'swordMaster'], skinFrameMap[actorConfig.playerSkin || 'swordMaster'], actorConfig);
    this.sprite.setDepth(1);
    this.attackHitboxManager = new AttackHitboxManager(scene);
  }

  private createPlayerAnimations(scene: Scene) {
    const animationManager = new AnimationHelper(scene);
    const animationConfigs = getAnimationConfig(this.playerSkin);
    if (!animationConfigs) {
      console.error('MISSING ANIMATION CONFIG')
      return
    };
    animationManager.createAnimations(animationConfigs);
  }

  private createAttackHitbox(attackType: string) {
    const attackConfigFn = getAttackConfig(this.playerSkin);
    const config = attackConfigFn ? attackConfigFn(this) [attackType] : undefined;
    if (!config) {
      console.error('MISSING ATTACK CONFIG')
      return
    };

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
      if (this.state.isActionAnimations(animation.key) && animation.key !== 'player_death') {
        this.sprite.play('player_idle');
      } else if (animation.key === 'player_death') {
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
    
    this.playerSkin = newSkin;
    
    // Update sprite texture
    this.sprite.setTexture(skinAtlasMap[newSkin], skinFrameMap[newSkin]);
    
    // Recreate animations for new skin
    this.createPlayerAnimations(this.scene);
    
    // Play idle animation
    this.sprite.play('player_idle');
  }

  private handleSkinChange() {
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.C)) {
      const newSkin = this.playerSkin === 'swordMaster' ? 'bloodSwordsMan' : 'swordMaster';
      this.changeSkin(newSkin);
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
      this.sprite.play('player_walk');
    } else if (state.shouldPlayRunAnimation) {
      this.sprite.play('player_run');
    } else if (state.shouldPlayIdleAnimation) {
      this.sprite.play('player_idle');
    }
  }

  private handleSlash(state: PlayerState, deltaTime: number) {
    if (state.shouldAttack) {
      this.shouldResetCombo();

      if (this.comboState === 0) {
        this.sprite.play('player_slash_1');
        this.createAttackHitbox('player_slash_1');
        this.comboState = 1;
        this.comboTimer = 0;
      } else if (this.comboState === 1) {
        this.sprite.play('player_slash_2');
        this.createAttackHitbox('player_slash_2');

        const dashDirection = this.sprite.flipX ? -1 : 1;
        const dashDistance = 1500 * dashDirection;
        this.sprite.x += dashDistance * deltaTime;

        this.comboState = 2;
        this.comboTimer = 0;
      } else if (this.comboState === 2) {
        this.sprite.play('player_spin_attack');
        this.createAttackHitbox('player_spin_attack');
        this.resetCombo();
      }
    }
  }

  private handleSlamAttack(state: PlayerState) {
    if (state.shouldSlamAttack) {
      this.shouldResetCombo();

      if (state.isInAir && this.comboState === 0) {
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
        this.resetCombo();
      }
    }
  }

  private handleDash(state: PlayerState, deltaTime: number) {
    if (state.shouldDash) {
      this.performDash(deltaTime);
      this.sprite.play('player_dash');
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleBlock(state: PlayerState) {
    if (state.shouldBlock) {
      this.sprite.play('player_block');
      this.comboState = 2;
      this.comboTimer = 0;
    }
  }

  private handleJump(state: PlayerState) {
    if (state.shouldJump) {
      this.sprite.setVelocityY(-400);
      this.sprite.play('player_jump');
    }
  }

  private handleFall(state: PlayerState) {
    if (state.shouldFall) {
      this.sprite.play('player_fall');
    }
  }

  create() {
    const { cursors, inputKeys } = this.setupPlayerInput(this.scene);
    this.cursors = cursors;
    this.inputKeys = inputKeys;

    this.state = new State(this);
    this.createPlayerAnimations(this.scene);
    this.addPlayerAnimationListeners();
    this.sprite.play('player_idle');
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