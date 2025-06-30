import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
<<<<<<< HEAD
import { Elk } from '../../actors/Elk';
import { Deer } from '../../actors/Deer';
=======
>>>>>>> 5a03fed (ASH-9: added boss assets)
import { TileMapComponent } from '../../components/TileMap';
import { LocationManager } from '../../components/LocationManager';
import { BossManager } from '../../components/BossManager';
import { EnemySpawner, EnemySpawnerConfig } from '../../components/EnemySpawner';
import avenWoodConfig from '../avenwood/config';

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;
  exitZone: Phaser.Physics.Arcade.StaticGroup;
  crossZone: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  tileMapComponent: TileMapComponent;
<<<<<<< HEAD
  locationManager: LocationManager;
  bossManager: BossManager;
  elkSpawner: EnemySpawner;
  deerSpawner: EnemySpawner;
  inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  isPlayerInCrossZone: boolean = false;
=======
  uiText: Phaser.GameObjects.Text;
>>>>>>> 5a03fed (ASH-9: added boss assets)

  constructor() {
    super('GehennaDeep');
  }

  create() {
    this.camera = this.cameras.main;
    const { tileMapConfig } = config;

    this.tileMapComponent = new TileMapComponent(this, config.tileMapConfig);
    const { map, world } = this.tileMapComponent.create();
    this.map = map;
    this.world = world;

    // Setup exit zone
    this.setupExitZone();

    // Setup cross zone
    this.setupCrossZone();

    const { width: mapWidth, height: mapHeight } = this.tileMapComponent.getMapDimensions();
    const playerSpawn: any = this.tileMapComponent.getObjectLayer('spawn')?.objects[0];

    this.player = new Player(this, playerSpawn.x * tileMapConfig.scale, playerSpawn.y * tileMapConfig.scale);
    this.player.create();

<<<<<<< HEAD
    // Setup input keys
    this.inputKeys = this.setupInputKeys();

    // Setup Elk spawner
    this.setupElkSpawner();

    // Setup Deer spawner
    this.setupDeerSpawner();

    // Setup location-based enemy spawning
    this.locationManager = new LocationManager(
      this,
      this.player,
      this.tileMapComponent,
      config.locationConfigs,
      tileMapConfig.scale
    );
    this.locationManager.initialize();

    // Setup boss manager
    this.bossManager = new BossManager(
      this,
      this.player,
      config.locationConfigs,
      tileMapConfig.scale
    );
    this.bossManager.initialize();
=======
    this.createUI();
>>>>>>> 5a03fed (ASH-9: added boss assets)

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

    // Setup cross zone collision
    this.physics.add.overlap(
      this.player.sprite,
      this.crossZone,
      this.handleCrossZoneOverlap,
      undefined,
      this
    );

    EventBus.emit('current-scene-ready', this);
  }

<<<<<<< HEAD
  private setupInputKeys() {
    if (this.input && this.input.keyboard) {
      const inputKeys = this.input.keyboard.addKeys('T') as { [key: string]: Phaser.Input.Keyboard.Key };
      return inputKeys;
    } else {
      throw new Error('Keyboard input plugin is not available.');
    }
  }

  private setupCrossZone(): void {
    this.crossZone = this.physics.add.staticGroup();
    const locationsLayer = this.tileMapComponent.getObjectLayer('locations');

    if (locationsLayer && locationsLayer.objects) {
      const crossObject: any = locationsLayer.objects.find((obj: any) => obj.name === 'cross');

      if (crossObject) {
        const crossRect = this.add.rectangle(
          crossObject.x * config.tileMapConfig.scale,
          crossObject.y * config.tileMapConfig.scale,
          crossObject.width * config.tileMapConfig.scale,
          crossObject.height * config.tileMapConfig.scale,
          0x0000ff,
          0
        );
        crossRect.setOrigin(0, 0);
        this.crossZone.add(crossRect);
      } else {
        console.warn('No location object with name "cross" found');
      }
    }
  }

  private handleCrossZoneOverlap = () => {
    this.isPlayerInCrossZone = true;
  }

  private handleCrossZoneTransformation() {
    if (this.isPlayerInCrossZone && Phaser.Input.Keyboard.JustDown(this.inputKeys.T)) {
      this.player.changeSkin('holySamurai');
    }

    // Reset flag if player is not in the cross zone anymore
    if (!this.physics.overlap(this.player.sprite, this.crossZone)) {
      this.isPlayerInCrossZone = false;
    }
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
      } else {
        console.warn('No powerSpawn object with name "blood" found');
      }
    } else {
      console.warn('No powerSpawn layer found in tilemap');
    }
  }

  private setupDeerSpawner(): void {
    const powerSpawnLayer = this.tileMapComponent.getObjectLayer('powerSpawn');

    if (powerSpawnLayer && powerSpawnLayer.objects) {
      const deerSpawn: any = powerSpawnLayer.objects.find((obj: any) => obj.name === 'flames');

      if (deerSpawn) {
        const spawnerConfig: EnemySpawnerConfig = {
          enemyClass: Deer,
          maxEnemies: 1,
          spawnInterval: 100,
          spawnPoint: {
            x: deerSpawn.x * config.tileMapConfig.scale,
            y: deerSpawn.y * config.tileMapConfig.scale
          },
          autoStart: true,
          respawnDelay: 0 // Don't respawn deer
        };

        this.deerSpawner = new EnemySpawner(this, this.player, spawnerConfig);
      } else {
        console.warn('No powerSpawn object with name "deer" found');
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
    this.bossManager?.destroy();
    this.elkSpawner?.destroy();
    this.deerSpawner?.destroy();

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
    this.bossManager.update(time, delta);

    if (this.elkSpawner) {
      this.elkSpawner.update(time, delta);
    }
    if (this.deerSpawner) {
      this.deerSpawner.update(time, delta);
    }

    // Handle cross zone transformation
    this.handleCrossZoneTransformation();
=======
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
>>>>>>> 5a03fed (ASH-9: added boss assets)
  }
}
