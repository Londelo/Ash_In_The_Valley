import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';
import { TileMapComponent } from '../../components/TileMap';
import { EnemySpawner, EnemySpawnerConfig } from '../../components/EnemySpawner';
import avenWoodConfig from '../avenwood/config'

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;
  exitZone: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;
  tileMapComponent: TileMapComponent;
  enemySpawner: EnemySpawner;

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

    // Setup exit zone
    this.setupExitZone();

    const { width: mapWidth, height: mapHeight } = this.tileMapComponent.getMapDimensions();
    const playerSpawn: any = this.tileMapComponent.getObjectLayer('spawn')?.objects[0];

    this.player = new Player(this, playerSpawn.x * tileMapConfig.scale, playerSpawn.y * tileMapConfig.scale);

    this.player.create();

    // Setup enemy spawner for cave environment
    this.setupEnemySpawner();

    this.camera.startFollow(this.player.sprite);
    this.camera.setFollowOffset(0, 200);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    this.physics.add.collider(this.player.sprite, this.world);

    // Setup exit collision
    this.physics.add.overlap(
      this.player.sprite,
      this.exitZone,
      this.handleExitOverlap,
      undefined,
      this
    );

    EventBus.emit('current-scene-ready', this);
  }

  private setupExitZone(): void {
    this.exitZone = this.physics.add.staticGroup();
    const exitLayer = this.tileMapComponent.getObjectLayer('exit');

    if (exitLayer && exitLayer.objects) {
      exitLayer.objects.forEach((obj: any) => {
        const exitRect = this.add.rectangle(
          obj.x * config.tileMapConfig.scale,
          obj.y * config.tileMapConfig.scale,
          obj.width * config.tileMapConfig.scale,
          obj.height * config.tileMapConfig.scale,
          0x00ff00,
          0
        );
        exitRect.setOrigin(0, 0);
        this.exitZone.add(exitRect);
      });
    }
  }

  private handleExitOverlap = (_playerSprite: any, _exitObject: any) => {
    // Clean up current scene
    this.enemySpawner?.destroy();

    // Calculate spawn position near temple in AvenWood
    const spawnX = (config.temple_x) * avenWoodConfig.tileMapConfig.scale; // Using AvenWood's scale of 2
    const spawnY = (config.temple_y - 100) * avenWoodConfig.tileMapConfig.scale; // Safe Y position

    // Transition to AvenWood with custom spawn position
    this.scene.start('AvenWood', {
      playerX: spawnX,
      playerY: spawnY
    });
  };

  private setupEnemySpawner(): void {
    const spawnerConfig: EnemySpawnerConfig = {
      enemyClass: DaggerBandit,
      maxEnemies: 5,
      spawnInterval: 4000, // 4 seconds - more intense in cave
      spawnPoint: { x: 800, y: 400 },
      spawnRadius: 80,
      autoStart: true,
      respawnDelay: 2500
    };

    this.enemySpawner = new EnemySpawner(this, this.player, spawnerConfig);
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.enemySpawner.update(time, delta);
  }
}
