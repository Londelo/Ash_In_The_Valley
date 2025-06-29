import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';
import { TileMapComponent } from '../../components/TileMap';

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;
  tileMapComponent: TileMapComponent;

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

    this.camera.startFollow(this.player.sprite);
    this.camera.setFollowOffset(0, 200);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    this.physics.add.collider(this.player.sprite, this.world);

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
  }
}