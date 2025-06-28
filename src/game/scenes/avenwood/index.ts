import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';
import { TileMapComponent, TileMapConfig } from '../../components/TileMap';

export default class AvenWood extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;
  tileMapComponent: TileMapComponent;

  constructor() {
    super('AvenWood');
  }

  create() {
    this.camera = this.cameras.main;
    const { tileMapConfig } = config

    this.tileMapComponent = new TileMapComponent(this, tileMapConfig);
    const { map, world } = this.tileMapComponent.create();
    this.map = map;
    this.world = world;

    const { width: mapWidth, height: mapHeight } = this.tileMapComponent.getMapDimensions();
    const templeLocation = this.tileMapComponent.getObjectLayer('temple')?.objects[0] as any;

    this.player = new Player(this, config.player_start_x * tileMapConfig.scale, config.player_start_y * tileMapConfig.scale);
    this.prophet = new Prophet(this, config.prophet_start_x * tileMapConfig.scale, config.prophet_start_y * tileMapConfig.scale, this.player);
    this.temple = new Temple(this, templeLocation.x, templeLocation.y, tileMapConfig.scale, this.player);


    this.player.create();
    this.prophet.create();
    this.temple.create();

    this.camera.startFollow(this.player.sprite);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setFollowOffset(0, 250);

    this.physics.add.collider(this.player.sprite, this.world);
    this.physics.add.collider(this.prophet.sprite, this.world);
    this.physics.add.collider(this.temple.sprite, this.world);

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.prophet.update(time, delta);
    this.temple.update(time, delta);
  }

  changeScene() {
    this.scene.restart();
  }
}
