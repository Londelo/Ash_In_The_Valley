import { Scene } from 'phaser';
import { State, DeerState } from './state';
import { setSpriteDirection } from '../../utils/spriteDirection';
import { AnimationHelper } from '../../components/AnimationHelper';
import { getAllDeerAnimationConfigs } from './animations';
import { Actor, ActorConfig } from '../../components/Actor';
import { getDeerActorConfig } from './actorConfigs';

export type DeerSkins = 'deer';

const skinAtlasMap: { [K in DeerSkins]: string } = {
  deer: 'deerAtlas'
};

const skinFrameMap: { [K in DeerSkins]: string } = {
  deer: 'eat 0'
};

export class Deer extends Actor {
  deerSpeed: number = 30;
  private state: State;
  private deltaTime: number = 0;
  public deerSkin: DeerSkins;
  public debugEnabled: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    const deerSkin: DeerSkins = 'deer';
    const actorConfig: ActorConfig = getDeerActorConfig(deerSkin);
    super(scene, x, y, skinAtlasMap[deerSkin], skinFrameMap[deerSkin], actorConfig);
    this.deerSkin = deerSkin;
    this.sprite.setDepth(0);
  }

  private createAllDeerAnimations(scene: Scene) {
    const animationManager = new AnimationHelper(scene);
    const allAnimationConfigs = getAllDeerAnimationConfigs();
    animationManager.createAnimations(allAnimationConfigs);
  }

  private addDeerAnimationListeners() {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (animation.key.includes('_death')) {
        this.sprite.anims.stop();
        this.onDeathComplete();
      }
    });
  }

  private onDeathComplete(): void {
    // Custom logic for deer death (if needed)
  }

  protected onDeath(): void {
    this.isDead = true;
    this.sprite.setVelocityX(0);
    this.sprite.play(`${this.deerSkin}_death`);
  }

  public handleMovement(currentState: DeerState) {
    if (currentState.shouldMove) {
      const moveSpeed = this.deerSpeed;
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

  public handleAnimations(currentState: DeerState) {
    if (this.isDead) return;
    if (currentState.shouldPlayMoveAnim) {
      this.sprite.play(`${this.deerSkin}_walk`);
    } else if (currentState.shouldPlayEatAnim) {
      this.sprite.play(`${this.deerSkin}_eat`);
    } else if (currentState.shouldPlayLookUpAnim) {
      this.sprite.play(`${this.deerSkin}_look_up`);
    }
  }

  create() {
    this.state = new State(this);
    this.createAllDeerAnimations(this.scene);
    this.addDeerAnimationListeners();
    this.sprite.play(`${this.deerSkin}_eat`);
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
