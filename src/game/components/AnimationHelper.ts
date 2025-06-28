
export type Animation = Phaser.Types.Animations.Animation
export class AnimationHelper {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createAnimations(animations: Animation[]): void {
    animations.forEach(config => {
      if(config.key && this.scene.anims.exists(config.key)) return;
      this.scene.anims.create(config);
    });
  }
}
