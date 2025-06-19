import { Scene } from 'phaser';
import { createProphetAnimations, addProphetAnimationListeners } from './animations';
import type { Player } from '../Player/index';

export class Prophet {
  scene: Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private prophetScale: number = 3;
  private playerRef: Player;
  private readonly DETECTION_RANGE = 150;
  private isPlayerNear: boolean = false;
  private currentState: 'breathing' | 'looking_up' | 'blinking' | 'looking_down' = 'breathing';

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.playerRef = playerRef;

    this.sprite = scene.physics.add.staticSprite(x, y, 'prophetAtlas', 'NPCs #prophet_idle_breathe 0.aseprite');
    this.sprite.setScale(this.prophetScale);
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    // this.sprite.setCollideWorldBounds(true);
    // this.sprite.setGravityY(0);
    this.sprite.setDepth(0);
    // this.sprite.setImmovable(true);

    // Set proper body size and origin for ground positioning
    // this.sprite.setBodySize(32, 24, false);
    // this.sprite.setOrigin(0.5, 1); // Bottom center origin
  }

  private getDistanceToPlayer(): number {
    const prophetX = this.sprite.x;
    const prophetY = this.sprite.y;
    const playerX = this.playerRef.sprite.x;
    const playerY = this.playerRef.sprite.y;

    return Math.sqrt(Math.pow(playerX - prophetX, 2) + Math.pow(playerY - prophetY, 2));
  }

  public onLookUpComplete() {
    this.currentState = 'blinking';
    this.sprite.play('prophet_idle_blink');
  }

  public onLookDownComplete() {
    this.currentState = 'breathing';
    this.sprite.play('prophet_idle_breathe');
  }

  private handlePlayerProximity() {
    const distance = this.getDistanceToPlayer();
    const playerIsNear = distance <= this.DETECTION_RANGE;

    // Player just entered range
    if (playerIsNear && !this.isPlayerNear && this.currentState === 'breathing') {
      this.isPlayerNear = true;
      this.currentState = 'looking_up';
      this.sprite.play('prophet_look_up');
    }
    // Player just left range
    else if (!playerIsNear && this.isPlayerNear && this.currentState === 'blinking') {
      this.isPlayerNear = false;
      this.currentState = 'looking_down';
      this.sprite.play('prophet_look_down');
    }

    this.isPlayerNear = playerIsNear;
  }

  create() {
    createProphetAnimations(this.scene);
    addProphetAnimationListeners(this);
    this.sprite.play('prophet_idle_breathe');
  }

  update(_time: number, _delta: number) {
    this.handlePlayerProximity();
  }
}
