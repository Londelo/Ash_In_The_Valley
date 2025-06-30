import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { TileMapComponent } from '../../components/TileMap';

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  tileMapComponent: TileMapComponent;
  uiText: Phaser.GameObjects.Text;

  constructor() {
    super('GehennaDeep');
  }

  create() {
    this.camera = this.cameras.main;
    const { tileMapConfig } = config

    this.tileMapComponent = new TileMapComponent(this, config.tileMapConfig);
    const { map, world } = this.tileMapComponent.create();
    this.map = map;
    this.world = world;

    const { width: mapWidth, height: mapHeight } = this.tileMapComponent.getMapDimensions();
    const playerSpawn: any = this.tileMapComponent.getObjectLayer('spawn')?.objects[0];

    this.player = new Player(this, playerSpawn.x * tileMapConfig.scale, playerSpawn.y * tileMapConfig.scale);

    this.player.create();

    this.createUI();

    this.camera.startFollow(this.player.sprite);
    this.camera.setFollowOffset(0, 200);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    this.physics.add.collider(this.player.sprite, this.world);

    EventBus.emit('current-scene-ready', this);
  }

  private createUI() {
    this.uiText = this.add.text(20, 20, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    this.uiText.setScrollFactor(0);
    this.uiText.setDepth(1000);
    
    this.updateUI();
  }

  private updateUI() {
    const playerHealthPercent = Math.max(0, (this.player.health / this.player.maxHealth) * 100);
    
    this.uiText.setText([
      `Gehenna Deep - The Ancient Caverns`,
      `Player Health: ${playerHealthPercent.toFixed(0)}%`,
      '',
      'Controls:',
      'Arrow Keys - Move',
      'Space + Move - Run',
      'Up Arrow - Jump',
      'R - Attack',
      'E - Slam Attack',
      'Q - Dash',
      'W - Block',
      '',
      'Explore the mysterious depths...',
      'Return to Aven Wood to face the Prophet!'
    ]);
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.updateUI();
  }
}