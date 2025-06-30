import { Scene } from 'phaser';
import { TileMapComponent } from './TileMap';
import { EnemySpawner, EnemySpawnerConfig } from './EnemySpawner';
import { DaggerBandit } from '../actors/DaggerBandit';
import type { Player } from '../actors/Player';
import type { LocationConfigs } from '../scenes/gehennaDeep/config';

export interface LocationZone {
  name: string;
  bounds: Phaser.Geom.Rectangle;
  spawner?: EnemySpawner;
}

export interface SpawnPoint {
  name: string;
  x: number;
  y: number;
}

export class LocationManager {
  private scene: Scene;
  private player: Player;
  private tileMapComponent: TileMapComponent;
  private locationConfigs: LocationConfigs;
  private mapScale: number;
  
  private locationZones: LocationZone[] = [];
  private spawnPoints: SpawnPoint[] = [];
  private currentLocation: string | null = null;
  private activeSpawners: Map<string, EnemySpawner> = new Map();

  constructor(
    scene: Scene, 
    player: Player, 
    tileMapComponent: TileMapComponent, 
    locationConfigs: LocationConfigs,
    mapScale: number
  ) {
    this.scene = scene;
    this.player = player;
    this.tileMapComponent = tileMapComponent;
    this.locationConfigs = locationConfigs;
    this.mapScale = mapScale;
  }

  public initialize(): void {
    this.setupLocationZones();
    this.setupSpawnPoints();
  }

  private setupLocationZones(): void {
    const locationsLayer = this.tileMapComponent.getObjectLayer('locations');
    
    if (locationsLayer && locationsLayer.objects) {
      locationsLayer.objects.forEach((obj: any) => {
        const zone: LocationZone = {
          name: obj.name,
          bounds: new Phaser.Geom.Rectangle(
            obj.x * this.mapScale,
            obj.y * this.mapScale,
            obj.width * this.mapScale,
            obj.height * this.mapScale
          )
        };
        this.locationZones.push(zone);
      });
    }
  }

  private setupSpawnPoints(): void {
    const spawnLayer = this.tileMapComponent.getObjectLayer('spawn');
    
    if (spawnLayer && spawnLayer.objects) {
      spawnLayer.objects.forEach((obj: any) => {
        const spawnPoint: SpawnPoint = {
          name: obj.name,
          x: obj.x * this.mapScale,
          y: obj.y * this.mapScale
        };
        this.spawnPoints.push(spawnPoint);
      });
    }
  }

  private getPlayerCurrentLocation(): string | null {
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;

    for (const zone of this.locationZones) {
      if (Phaser.Geom.Rectangle.Contains(zone.bounds, playerX, playerY)) {
        return zone.name;
      }
    }
    return null;
  }

  private getSpawnPointsForLocation(locationName: string): SpawnPoint[] {
    return this.spawnPoints.filter(spawn => 
      spawn.name.includes(locationName)
    );
  }

  private activateLocationSpawners(locationName: string): void {
    const spawnPoints = this.getSpawnPointsForLocation(locationName);
    const config = this.locationConfigs[locationName];

    if (!config || spawnPoints.length === 0) {
      return;
    }

    // Create spawners for each spawn point in this location
    spawnPoints.forEach(spawnPoint => {
      const spawnerConfig: EnemySpawnerConfig = {
        enemyClass: DaggerBandit,
        maxEnemies: Math.ceil(config.maxEnemies / spawnPoints.length),
        spawnInterval: config.spawnInterval,
        spawnPoint: { x: spawnPoint.x, y: spawnPoint.y },
        autoStart: config.autoStart,
        respawnDelay: 0 // Disable respawning - enemies don't come back once killed
      };

      const spawner = new EnemySpawner(this.scene as any, this.player, spawnerConfig);
      this.activeSpawners.set(spawnPoint.name, spawner);
    });

    console.log(`Activated spawners for location: ${locationName} with ${spawnPoints.length} spawn points`);
  }

  private deactivateLocationSpawners(locationName: string): void {
    const spawnPoints = this.getSpawnPointsForLocation(locationName);
    
    spawnPoints.forEach(spawnPoint => {
      const spawner = this.activeSpawners.get(spawnPoint.name);
      if (spawner) {
        spawner.destroy();
        this.activeSpawners.delete(spawnPoint.name);
      }
    });

    console.log(`Deactivated spawners for location: ${locationName}`);
  }

  public update(): void {
    const newLocation = this.getPlayerCurrentLocation();

    if (newLocation !== this.currentLocation) {
      // Player changed location - but don't destroy existing enemies
      if (this.currentLocation) {
        // Stop spawning new enemies in old location but keep existing ones alive
        this.pauseLocationSpawners(this.currentLocation);
      }

      if (newLocation) {
        this.activateLocationSpawners(newLocation);
      }

      this.currentLocation = newLocation;
      console.log(`Player entered location: ${newLocation || 'unknown'}`);
    }

    // Update all active spawners
    this.activeSpawners.forEach(spawner => {
      spawner.update(0, 16);
    });
  }

  private pauseLocationSpawners(locationName: string): void {
    const spawnPoints = this.getSpawnPointsForLocation(locationName);
    
    spawnPoints.forEach(spawnPoint => {
      const spawner = this.activeSpawners.get(spawnPoint.name);
      if (spawner) {
        spawner.stop(); // Stop spawning but keep existing enemies
      }
    });

    console.log(`Paused spawners for location: ${locationName}`);
  }

  public getCurrentLocation(): string | null {
    return this.currentLocation;
  }

  public getActiveSpawners(): EnemySpawner[] {
    return Array.from(this.activeSpawners.values());
  }

  public destroy(): void {
    this.activeSpawners.forEach(spawner => spawner.destroy());
    this.activeSpawners.clear();
    this.locationZones = [];
    this.spawnPoints = [];
    this.currentLocation = null;
  }
}