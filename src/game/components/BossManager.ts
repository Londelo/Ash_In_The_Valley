import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { EnemySpawner, EnemySpawnerConfig } from './EnemySpawner';
import { DaggerBandit } from '../actors/DaggerBandit';
import type { Player } from '../actors/Player';
import type { Elk } from '../actors/Elk';
import type { Deer } from '../actors/Deer';
import type { LocationConfigs } from '../scenes/gehennaDeep/config';

export interface BossSpawnPoint {
  name: string;
  x: number;
  y: number;
}

export class BossManager {
  private scene: Scene;
  private player: Player;
  private locationConfigs: LocationConfigs;
  private mapScale: number;

  private spawnPoints: BossSpawnPoint[] = [];
  private activeSpawners: Map<string, EnemySpawner> = new Map();
  
  // Track boss states
  private boss1Triggered: boolean = false;
  private boss2Triggered: boolean = false;

  constructor(
    scene: Scene,
    player: Player,
    locationConfigs: LocationConfigs,
    mapScale: number
  ) {
    this.scene = scene;
    this.player = player;
    this.locationConfigs = locationConfigs;
    this.mapScale = mapScale;
  }

  public initialize(): void {
    this.setupSpawnPoints();
    this.setupEventListeners();
  }

  private setupSpawnPoints(): void {
    // Get spawn points from the 'boss_spawn' layer in the tilemap
    const bossSpawnLayer = (this.scene as any).tileMapComponent.getObjectLayer('boss_spawn');

    if (bossSpawnLayer && bossSpawnLayer.objects) {
      bossSpawnLayer.objects.forEach((obj: any) => {
        const spawnPoint: BossSpawnPoint = {
          name: obj.name,
          x: obj.x * this.mapScale,
          y: obj.y * this.mapScale
        };
        this.spawnPoints.push(spawnPoint);
      });
    }

    console.log(`Found ${this.spawnPoints.length} boss spawn points`);
  }

  private setupEventListeners(): void {
    // Listen for Elk death
    EventBus.on('elk_death', this.handleElkDeath.bind(this));
    
    // Listen for Deer death
    EventBus.on('deer_death', this.handleDeerDeath.bind(this));
  }

  private handleElkDeath(): void {
    if (this.boss1Triggered) return;
    
    console.log('Elk death detected, triggering boss_1 spawns');
    this.boss1Triggered = true;
    this.activateBossSpawners('boss_1');
  }

  private handleDeerDeath(): void {
    if (this.boss2Triggered) return;
    
    console.log('Deer death detected, triggering boss_2 spawns');
    this.boss2Triggered = true;
    this.activateBossSpawners('boss_2');
  }

  private getSpawnPointsForBoss(bossName: string): BossSpawnPoint[] {
    return this.spawnPoints.filter(spawn => 
      spawn.name.startsWith(`${bossName}_`)
    );
  }

  private activateBossSpawners(bossName: string): void {
    const spawnPoints = this.getSpawnPointsForBoss(bossName);
    const config = this.locationConfigs[bossName];

    if (!config || spawnPoints.length === 0) {
      console.warn(`No config or spawn points found for boss: ${bossName}`);
      return;
    }

    // Calculate how many enemies per spawn point
    const enemiesPerSpawn = Math.max(1, Math.ceil(config.maxEnemies / spawnPoints.length));

    // Create spawners for each spawn point for this boss
    spawnPoints.forEach((spawnPoint, index) => {
      // If this is the last spawn point, assign any remaining enemies
      const isLastSpawnPoint = index === spawnPoints.length - 1;
      const maxEnemiesForThisSpawn = isLastSpawnPoint 
        ? config.maxEnemies - (enemiesPerSpawn * (spawnPoints.length - 1))
        : enemiesPerSpawn;

      const spawnerConfig: EnemySpawnerConfig = {
        enemyClass: DaggerBandit,
        maxEnemies: maxEnemiesForThisSpawn,
        spawnInterval: config.spawnInterval,
        spawnPoint: { x: spawnPoint.x, y: spawnPoint.y },
        autoStart: true,
        respawnDelay: config.respawnDelay
      };

      const spawner = new EnemySpawner(this.scene as any, this.player, spawnerConfig);
      this.activeSpawners.set(spawnPoint.name, spawner);
    });

    console.log(`Activated ${spawnPoints.length} spawners for boss: ${bossName}`);
  }

  public update(time: number, delta: number): void {
    // Update all active spawners
    this.activeSpawners.forEach(spawner => {
      spawner.update(time, delta);
    });
  }

  public destroy(): void {
    // Clean up event listeners
    EventBus.removeListener('elk_death');
    EventBus.removeListener('deer_death');
    
    // Destroy all spawners
    this.activeSpawners.forEach(spawner => spawner.destroy());
    this.activeSpawners.clear();
    this.spawnPoints = [];
  }
}