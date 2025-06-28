import { debugGraphics } from '../utils/debugGraphics';
import { AnimationHelper } from './AnimationHelper';

export interface PropConfig {
  scale: number;
  depth?: number;
  originX?: number;
  originY?: number;
  bodyWidth?: number;
  bodyHeight?: number;
  bodyOffsetX?: number;
  bodyOffsetY?: number;
}

export abstract class Prop {
  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  protected config: PropConfig;
  protected boundingBox: Phaser.GameObjects.Graphics;
  protected debugEnabled: boolean = false;
  protected animationManager: AnimationHelper;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string, frameKey: string, config: PropConfig) {
    this.scene = scene;
    this.config = config;

    this.sprite = scene.physics.add.staticSprite(x, y, textureKey, frameKey);
    this.sprite.setScale(this.config.scale);
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setDepth(this.config.depth || 0);
    this.sprite.setOrigin(0, 0);
    this.boundingBox = scene.add.graphics();
    this.animationManager = new AnimationHelper(scene);
  }

  public abstract create(): void;
  public abstract update(time: number, delta: number): void;

  protected createAnimations(animationConfigs: any[]): void {
    this.animationManager.createAnimations(animationConfigs);
  }

  protected addAnimationListeners(listeners: { [key: string]: () => void }): void {
    this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      const callback = listeners[animation.key];
      if (callback) {
        callback();
      }
    });
  }

  public setScale(scale: number): void {
    this.config.scale = scale;
    this.sprite.setScale(scale);
  }

  public setDepth(depth: number): void {
    this.config.depth = depth;
    this.sprite.setDepth(depth);
  }

  protected renderDebugGraphics(): void {
    if (!this.debugEnabled) return;
    debugGraphics(this.boundingBox, this.sprite, this.config.scale);
  }

  public destroy(): void {
    if (this.boundingBox) {
      this.boundingBox.destroy();
    }
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}