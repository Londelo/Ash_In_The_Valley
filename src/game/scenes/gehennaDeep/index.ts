import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { Elk } from '../../actors/Elk';
import { TileMapComponent } from '../../components/TileMap';
import { LocationManager } from '../../components/LocationManager';
import { EnemySpawner, EnemySpawnerConfig } from '../../components/EnemySpawner';
import avenWoodConfig from '../avenwood/config'

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;
  exitZone: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  tileMapComponent: TileMapComponent;
  locationManager: LocationManager;
  elkSpawner: EnemySpawner;

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

    // Setup Elk spawner
    this.setupElkSpawner();

    // Setup location-based enemy spawning
    this.locationManager = new LocationManager(
      this,
      this.player,
      this.tileMapComponent,
      config.locationConfigs,
      tileMapConfig.scale
    );
    this.locationManager.initialize();

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

  private setupElkSpawner(): void {
    const powerSpawnLayer = this.tileMapComponent.getObjectLayer('powerSpawn');

    if (powerSpawnLayer && powerSpawnLayer.objects) {
      const bloodSpawn:any = powerSpawnLayer.objects.find((obj: any) => obj.name === 'blood');

      if (bloodSpawn) {
        const spawnerConfig: EnemySpawnerConfig = {
          enemyClass: Elk,
          maxEnemies: 1,
          spawnInterval: 100,
          spawnPoint: {
            x: bloodSpawn.x * config.tileMapConfig.scale,
            y: bloodSpawn.y * config.tileMapConfig.scale
          },
          autoStart: true,
          respawnDelay: 0 // Don't respawn elk
        };

        this.elkSpawner = new EnemySpawner(this, this.player, spawnerConfig);
        console.log('Elk spawner created at blood powerSpawn location');
      } else {
        console.warn('No powerSpawn object with name "blood" found');
      }
    } else {
      console.warn('No powerSpawn layer found in tilemap');
    }
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
    this.locationManager?.destroy();
    this.elkSpawner?.destroy();

    // Calculate spawn position near temple in AvenWood
    const spawnX = (config.temple_x) * avenWoodConfig.tileMapConfig.scale;
    const spawnY = (config.temple_y - 100) * avenWoodConfig.tileMapConfig.scale;

    // Transition to AvenWood with custom spawn position
    this.scene.start('AvenWood', {
      playerX: spawnX,
      playerY: spawnY
    });
  };

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.locationManager.update(time, delta);
    if (this.elkSpawner) {
      this.elkSpawner.update(time, delta);
    }
  }
}