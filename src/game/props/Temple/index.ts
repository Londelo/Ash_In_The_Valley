import { Scene } from 'phaser';
import { Prop, PropConfig } from '../../components/Prop';
import { templeAnimationConfigs } from './animations';
import type { Player } from '../../actors/Player/index';

export class Temple extends Prop {
  private playerRef: Player;
  private readonly INTERACTION_RANGE = 50;
  private isPlayerNear: boolean = false;
  private inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  public debugEnabled: boolean = true;

  constructor(scene: Scene, x: number, y: number, mapScale: number, playerRef: Player) {
    const propConfig: PropConfig = {
      scale: mapScale,
      depth: -1,
    };

    super(scene, x * mapScale, y * mapScale, 'templeAtlas', 'door light up 0', propConfig);
    this.playerRef = playerRef;
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
    const templeX = this.sprite.x + 130;
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
      this.scene.scene.start('GehennaDeep');
    }
  }

  create() {
    this.createAnimations(templeAnimationConfigs);

    this.addAnimationListeners({
      'temple_door_light_up': () => this.onLightUpComplete(),
      'temple_door_fade': () => this.onFadeComplete()
    });

    const { inputKeys } = this.setupInputKeys();
    this.inputKeys = inputKeys;

    this.sprite.play('temple_door_light_up');
  }

  update(_time: number, _delta: number) {
    this.handlePlayerInteraction();
    this.renderDebugGraphics();
  }
}