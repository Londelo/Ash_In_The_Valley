import { Scene } from 'phaser';
import { createTempleAnimations, addTempleAnimationListeners } from './animations';
import type { Player } from '../../actors/Player/index';
import { debugGraphics } from '../../utils/debugGraphics';

export class Temple {
  scene: Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private templeScale: number = 2;
  private playerRef: Player;
  private readonly INTERACTION_RANGE = 100;
  private isPlayerNear: boolean = false;
  private inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  private templeBoundingBox: Phaser.GameObjects.Graphics;

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.playerRef = playerRef;

    this.sprite = scene.physics.add.staticSprite(x, y, 'templeAtlas', 'door light up 0');
    this.sprite.setScale(this.templeScale);
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setDepth(-1);

    this.templeBoundingBox = scene.add.graphics();
  }

  private setupInputKeys() {
    if (this.scene.input && this.scene.input.keyboard) {
      const inputKeys = this.scene.input.keyboard.addKeys('T') as { [key: string]: Phaser.Input.Keyboard.Key };
      return { inputKeys };
    } else {
      throw new Error('Keyboard input plugin is not available.');
    }
  }

  private getDistanceToPlayer(): number {
    const templeX = this.sprite.x;
    const playerX = this.playerRef.sprite.x;
    return Math.abs(templeX - playerX);
  }

  public onLightUpComplete() {
    this.sprite.play('temple_door_fade');
  }

  public onFadeComplete() {
    this.sprite.play('temple_door_light_up');
  }

  private handlePlayerInteraction() {
    const distance = this.getDistanceToPlayer();
    this.isPlayerNear = distance <= this.INTERACTION_RANGE;
    if (this.isPlayerNear && Phaser.Input.Keyboard.JustDown(this.inputKeys.T)) {
      console.log('Player interacted with the temple door!');
    }
  }

  create() {
    createTempleAnimations(this.scene);
    addTempleAnimationListeners(this);

    const { inputKeys } = this.setupInputKeys();
    this.inputKeys = inputKeys;

    // Start the animation cycle
    this.sprite.play('temple_door_light_up');
  }

  update(_time: number, _delta: number) {
    this.handlePlayerInteraction();
    // debugGraphics(this.templeBoundingBox, this.sprite, this.templeScale);
  }
}
