import { Scene } from 'phaser';
import { State, ElkState } from './state';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getAllElkAnimationConfigs } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';
import { getElkActorConfig } from './actorConfigs';
import type { Player } from '../Player/index';

export type ElkSkins = 'blueElk' | 'redElk';

const skinAtlasMap: { [K in ElkSkins]: string } = {
  'blueElk': 'elkAtlas',
  'redElk': 'elkRedAtlas'
};

const skinFrameMap: { [K in ElkSkins]: string } = {
  'blueElk': 'Eat 0',
  'redElk': 'Eat 0'
};

export class Elk extends Actor {
  elkSpeed: number = 30;
  private state: State;
  private deltaTime: number = 0;
  public elkSkin: ElkSkins;
  private playerRef: Player;
  private hasTriggeredPlayerTransform: boolean = false;
  public debugEnabled: boolean = true;
  public uniqueId: string = `elk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    const elkSkin: ElkSkins = 'blueElk';
    const actorConfig: ActorConfig = getElkActorConfig(elkSkin);
    super(scene, x, y, skinAtlasMap[elkSkin], skinFrameMap[elkSkin], actorConfig);

    this.elkSkin = elkSkin;
    this.playerRef = playerRef;
    this.sprite.setDepth(0);
  }

  private createAllElkAnimations(scene: Scene) {
    const animationManager = new AnimationHelper(scene);
    const allAnimationConfigs = getAllElkAnimationConfigs();
    animationManager.createAnimations(allAnimationConfigs);
  }

  private addElkAnimationListeners() {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (animation.key.includes('_death')) {
        this.sprite.anims.stop();
        this.onDeathComplete();
      }
    });
  }

  private changeSkin(newSkin: ElkSkins) {
    if (this.elkSkin === newSkin) return;

    // Stop current animation
    this.sprite.anims.stop();

    // Update skin
    this.elkSkin = newSkin;

    // Update config
    this.config = getElkActorConfig(newSkin);

    // Update sprite texture
    this.sprite.setTexture(skinAtlasMap[newSkin], skinFrameMap[newSkin]);

    console.log('Elk skin changed to', newSkin);
  }

  private onDeathComplete(): void {
    if (!this.hasTriggeredPlayerTransform) {
      this.hasTriggeredPlayerTransform = true;

      // Change elk to red skin
      this.changeSkin('redElk');
      
      // Change player to bloodSwordsman
      (this.playerRef as any).changeSkin('bloodSwordsMan');
      
      console.log('Elk death triggered player transformation to bloodSwordsman');
    }
  }

  protected onDeath(): void {
    this.isDead = true;
    this.sprite.setVelocityX(0);

    // Change to red skin before playing death animation
    this.changeSkin('redElk');
    this.sprite.play(`${this.elkSkin}_death`);
  }

  public handleMovement(currentState: ElkState) {
    if (currentState.shouldMove) {
      const moveSpeed = this.elkSpeed;

      if (currentState.moveDirection === 'left') {
        this.sprite.setVelocityX(-moveSpeed);
        setSpriteDirection(this.sprite, 'left', this.adjustForCenterOffset);
      } else {
        this.sprite.setVelocityX(moveSpeed);
        setSpriteDirection(this.sprite, 'right', this.adjustForCenterOffset);
      }
    } else {
      this.sprite.setVelocityX(0);
    }
  }

  public handleAnimations(currentState: ElkState) {
    if (this.isDead) return;

    if (currentState.shouldPlayMoveAnim) {
      this.sprite.play(`${this.elkSkin}_walk`);
    } else if (currentState.shouldPlayEatAnim) {
      this.sprite.play(`${this.elkSkin}_eat`);
    } else if (currentState.shouldPlayLookUpAnim) {
      this.sprite.play(`${this.elkSkin}_look_up`);
    }
  }

  create() {
    this.state = new State(this);
    this.createAllElkAnimations(this.scene);
    this.addElkAnimationListeners();
    this.sprite.play(`${this.elkSkin}_eat`);
  }

  update(time: number, delta: number) {
    this.deltaTime = delta / 1000;

    if (this.isDead) return;

    const currentState = this.state.getState(time, delta);
    this.handleMovement(currentState);
    this.handleAnimations(currentState);

    this.renderDebugGraphics();
  }
}