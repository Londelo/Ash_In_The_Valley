import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;
  mapScale: number = 3;

  constructor() {
    super('GehennaDeep');
  }

  create() {
    this.camera = this.cameras.main;    // Load the tilemap
    this.map = this.add.tilemap("gehennaDeep");

    const mainCave = this.map.addTilesetImage("mainCave", "mainCave");
    const crossSectionBG = this.map.addTilesetImage("crossSectionBG", "crossSectionBG");
    const hangersBG = this.map.addTilesetImage("hangersBG", "hangersBG");
    const horizontalColumnsBG = this.map.addTilesetImage("horizontalColumnsBG", "horizontalColumnsBG");
    const Small1BG = this.map.addTilesetImage("Small1BG", "Small1BG");
    const Small2BG = this.map.addTilesetImage("Small2BG", "Small2BG");
    const Small3BG = this.map.addTilesetImage("Small3BG", "Small3BG");
    if(!mainCave || !crossSectionBG || !hangersBG || !horizontalColumnsBG || !Small1BG || !Small2BG || !Small3BG) {
      throw new Error("One or more tileset failed to load. Check your asset paths and names.");
    }
;
    this.map.layers.forEach(layer => {
      const layerObj = this.map.createLayer(
        layer.name,
        [Small3BG, crossSectionBG, hangersBG, horizontalColumnsBG, Small1BG, Small2BG, mainCave]
      );

      if (layerObj) {
        layerObj.setScale(this.mapScale);
        if (layer.name.includes('background')) {
          layerObj.setDepth(-1);
        } else {
          layerObj.setDepth(100);
        }
      }
    });

    this.world = this.physics.add.staticGroup();
    const groundCollisionLayer: any = this.map.getObjectLayer('floor')
    if (groundCollisionLayer && groundCollisionLayer.objects) {
      for (const obj of groundCollisionLayer.objects) {
      const collisionRect = this.add.rectangle(
        obj.x * this.mapScale,
        obj.y * this.mapScale,
        obj.width * this.mapScale,
        obj.height * this.mapScale,
        0x000000,
        0
      );
      collisionRect.setOrigin(0, 0);
      this.world.add(collisionRect);
      }
    }

    const mapWidth = this.map.widthInPixels * this.mapScale;
    const mapHeight = this.map.heightInPixels * this.mapScale;

    const playerSpawn: any = this.map.getObjectLayer('spawn')?.objects[0];

    this.player = new Player(this, playerSpawn.x * this.mapScale, playerSpawn.y * this.mapScale);
    // this.prophet = new Prophet(this, config.prophet_start_x * this.mapScale, config.prophet_start_y * this.mapScale, this.player);
    this.temple = new Temple(this, config.temple_x * this.mapScale, config.temple_y * this.mapScale, this.player);

    this.player.create();
    // this.prophet.create();
    this.temple.create();

    this.camera.startFollow(this.player.sprite);
    this.camera.setFollowOffset(0, 200)
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    this.physics.add.collider(this.player.sprite, this.world);
    // this.physics.add.collider(this.prophet.sprite, this.world);
    this.physics.add.collider(this.temple.sprite, this.world);

    EventBus.emit('current-scene-ready', this);
    console.log(this.scene.scene.data)
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    // this.prophet.update(time, delta);
    this.temple.update(time, delta);
  }
}
