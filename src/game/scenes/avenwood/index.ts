import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';

export default class AvenWood extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;

  constructor() {
    super('AvenWood');
  }

  create() {
    this.camera = this.cameras.main;

    // Load the tilemap
    this.map = this.add.tilemap("avenWood");

    // Add all tilesets used in the map
    const tilesetMain = this.map.addTilesetImage("mainTileSheet", "mainTileSheet");
    const tilesetBg = this.map.addTilesetImage("bg", "bg");
    const tilesetBg1 = this.map.addTilesetImage("bg1", "bg1");
    const tilesetBg2 = this.map.addTilesetImage("bg2", "bg2");
    const tilesetBg3 = this.map.addTilesetImage("bg3", "bg3");
    const tilesetBg4 = this.map.addTilesetImage("bg4", "bg4");
    const tilesetSun = this.map.addTilesetImage("sun", "sun");

    if(!tilesetMain || !tilesetBg || !tilesetBg1 || !tilesetBg2 || !tilesetBg3 || !tilesetBg4 || !tilesetSun) {
      throw new Error("One or more tileset failed to load. Check your asset paths and names.");
    }

    // Set the desired scale for the tilemap
    const scale = 2; // Change this value to your preferred scale

    const parallaxConfig = [
      { name: 'BG_0', factor: 0.1 },
      { name: 'BG_1', factor: 0.2 },
      { name: 'BG_2', factor: 0.4 },
      { name: 'BG_3', factor: 0.6 },
      { name: 'BG_4', factor: 0.8 },
      // { name: 'sun', factor: 0.2 },

      // Add more as needed, or use a naming convention
    ];
    this.map.layers.forEach(layer => {
      const layerObj = this.map.createLayer(
        layer.name,
        [tilesetSun, tilesetBg, tilesetBg1, tilesetBg2, tilesetBg3, tilesetBg4, tilesetMain]
      );

      if (layerObj) {
        layerObj.setScale(scale);
        if (layer.name.includes('background')) {
          const parallax = parallaxConfig.find(config => layer.name.includes(config.name));
          if (parallax) {
            layerObj.setScrollFactor(parallax.factor, 1);
          }
          layerObj.setDepth(-1);
        } else {
          layerObj.setDepth(100);
        }
      }
    });

    // Set up physics world
    this.world = this.physics.add.staticGroup();

    // Create collision bodies from the ground_collision object layer
    const groundCollisionLayer: any = this.map.getObjectLayer('ground/ground_collision')?.objects[0]
    const collisionRect = this.add.rectangle(
          groundCollisionLayer.x * scale,
          groundCollisionLayer.y * scale,
          groundCollisionLayer.width * scale,
          groundCollisionLayer.height * scale,
          0x000000,
          0
        );
    collisionRect.setOrigin(0, 0);
    this.world.add(collisionRect);

    // Get map dimensions for camera bounds (scaled)
    const mapWidth = this.map.widthInPixels * scale;
    const mapHeight = this.map.heightInPixels * scale;

    const templeLocation = this.map.getObjectLayer('temple')?.objects[0] as any
    console.log('templeLocation', templeLocation);
    this.player = new Player(this, config.temple_x * scale, config.player_start_y * scale);
    this.prophet = new Prophet(this, config.prophet_start_x * scale, config.prophet_start_y * scale, this.player);
    this.temple = new Temple(this, templeLocation.x * scale, templeLocation.y * scale, this.player);

    this.player.create();
    this.prophet.create();
    this.temple.create();

    // Set camera to follow player with map bounds (scaled)
    this.camera.startFollow(this.player.sprite);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    // Add colliders
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
