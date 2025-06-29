import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import type { Player } from '../actors/Player';
import type { Actor } from './Actor';
import AvenWood from '../scenes/avenwood';
import GehennaDeep from '../scenes/gehennaDeep';

export interface SpawnPoint {
  x: number;
  y: number;
}

export interface EnemySpawnerConfig {
  enemyClass: new (scene: Scene, x: number, y: number, player: Player) => Actor;
  maxEnemies: number;
  spawnInterval: number; // milliseconds
  spawnPoint: SpawnPoint;
  spawnRadius?: number; // random offset from spawn points
  autoStart?: boolean;
  respawnDelay?: number; // delay before respawning after enemy death
}

export class EnemySpawner {
  private scene: AvenWood | GehennaDeep;
  private player: Player;
  private config: EnemySpawnerConfig;
  private enemies: Actor[] = [];
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private isActive: boolean = false;

  constructor(scene: AvenWood | GehennaDeep, player: Player, config: EnemySpawnerConfig) {
    this.scene = scene;
    this.player = player;
    this.config = {
      spawnRadius: 50,
      autoStart: true,
      respawnDelay: 2000,
      ...config
    };

    if (this.config.autoStart) {
      this.start();
    }
  }

  public start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.createSpawnTimer();
  }

  public stop(): void {
    this.isActive = false;
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
      this.spawnTimer = null;
    }
  }

  public pause(): void {
    if (this.spawnTimer) {
      this.spawnTimer.paused = true;
    }
  }

  public resume(): void {
    if (this.spawnTimer) {
      this.spawnTimer.paused = false;
    }
  }

  private createSpawnTimer(): void {
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.config.spawnInterval,
      callback: this.trySpawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  private trySpawnEnemy(): void {
    if (!this.isActive || this.enemies.length >= this.config.maxEnemies) {
      return;
    }

    const spawnPoint = this.getNextSpawnPoint();
    if (spawnPoint) {
      this.spawnEnemy(spawnPoint);
    }
  }

  private getNextSpawnPoint(): SpawnPoint | null {
    const radius = this.config.spawnRadius || 0;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;

    return {
      x: this.config.spawnPoint.x + Math.cos(angle) * distance,
      y: this.config.spawnPoint.y + Math.sin(angle) * distance
    };
  }

  private spawnEnemy(spawnPoint: SpawnPoint): void {
    const enemy = new this.config.enemyClass(
      this.scene,
      spawnPoint.x,
      spawnPoint.y,
      this.player
    );

    enemy.create();
    this.enemies.push(enemy);
    this.setupEnemyCollisions(enemy);
    this.setupEnemyEventListeners(enemy);
  }

  private setupEnemyCollisions(enemy: Actor): void {
    // Enemy collides with world
    this.scene.physics.add.collider(enemy.sprite, this.scene.world);

    // Player attacks hit enemy
    this.scene.physics.add.overlap(
      this.player.attackHitboxManager.getActiveHitboxes().map(h => h.sprite),
      enemy.sprite,
      this.handlePlayerAttackHit,
      undefined,
      this.scene
    );

    // Enemy attacks hit player
    if ('attackHitboxManager' in enemy) {
      const enemyAttackManager = (enemy as any).attackHitboxManager;
      this.scene.physics.add.overlap(
        enemyAttackManager.getActiveHitboxes().map((h: any) => h.sprite),
        this.player.sprite,
        this.handleEnemyAttackHit,
        undefined,
        this.scene
      );
    }
  }

  private setupEnemyEventListeners(enemy: Actor): void {
    // Listen for enemy death
    const checkDeath = () => {
      if (enemy.isDead) {
        this.handleEnemyDeath(enemy);
      }
    };

    // Check death status periodically
    const deathCheckTimer = this.scene.time.addEvent({
      delay: 100,
      callback: checkDeath,
      loop: true
    });

    // Store timer reference for cleanup
    (enemy as any).deathCheckTimer = deathCheckTimer;
  }

  private handlePlayerAttackHit = (playerAttack: any, enemySprite: any): void => {
    const attackHitbox = playerAttack.attackHitbox;
    const enemy = this.enemies.find(e => e.sprite === enemySprite);

    if (attackHitbox && enemy && attackHitbox.isActive) {
      // Get enemy's unique identifier
      const enemyId = 'uniqueId' in enemy ? (enemy as any).uniqueId : enemy.sprite.name || 'unknown';
      
      // Check if this hitbox has already hit this enemy
      if (attackHitbox.hasHitEntity(enemyId)) {
        return; // Skip damage - this enemy was already hit by this hitbox
      }

      // Mark this enemy as hit by this hitbox
      attackHitbox.addHitEntity(enemyId);

      // Apply damage
      enemy.takeDamage(attackHitbox.config.damage);

      // Emit damage event for specific enemy
      if ('uniqueId' in enemy) {
        EventBus.emit(`damage_${(enemy as any).uniqueId}`, attackHitbox.config.damage);
      }

      // NOTE: We do NOT destroy the hitbox here anymore!
      // The hitbox will be destroyed by its own timer after the duration expires
    }
  };

  private handleEnemyAttackHit = (enemyAttack: any, playerSprite: any): void => {
    const attackHitbox = enemyAttack.attackHitbox;

    if (attackHitbox && attackHitbox.isActive) {
      // Check if this hitbox has already hit the player
      if (attackHitbox.hasHitEntity('player')) {
        return; // Skip damage - player was already hit by this hitbox
      }

      // Mark player as hit by this hitbox
      attackHitbox.addHitEntity('player');

      // Apply damage
      this.player.takeDamage(attackHitbox.config.damage);

      // NOTE: We do NOT destroy the hitbox here anymore!
      // The hitbox will be destroyed by its own timer after the duration expires
    }
  };

  private handleEnemyDeath(enemy: Actor): void {
    // Clean up timers
    if ((enemy as any).deathCheckTimer) {
      (enemy as any).deathCheckTimer.destroy();
    }

    // Remove from enemies array
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }

    // Schedule respawn if spawner is still active
    if (this.isActive && this.config.respawnDelay) {
      this.scene.time.delayedCall(this.config.respawnDelay, () => {
        if (this.isActive && this.enemies.length < this.config.maxEnemies) {
          this.trySpawnEnemy();
        }
      });
    }
  }

  public update(time: number, delta: number): void {
    // Update all active enemies
    this.enemies.forEach(enemy => {
      if (!enemy.isDead) {
        enemy.update(time, delta);
      }
    });

    // Update collision detection for dynamic hitboxes
    this.updateDynamicCollisions();
  }

  private updateDynamicCollisions(): void {
    // Update player attack collisions
    const playerHitboxes = this.player.attackHitboxManager.getActiveHitboxes();
    this.enemies.forEach(enemy => {
      if (!enemy.isDead) {
        playerHitboxes.forEach(hitbox => {
          if (hitbox.isActive) {
            this.scene.physics.world.overlap(
              hitbox.sprite,
              enemy.sprite,
              () => this.handlePlayerAttackHit(hitbox.sprite, enemy.sprite)
            );
          }
        });
      }
    });

    // Update enemy attack collisions
    this.enemies.forEach(enemy => {
      if (!enemy.isDead && 'attackHitboxManager' in enemy) {
        const enemyAttackManager = (enemy as any).attackHitboxManager;
        const enemyHitboxes = enemyAttackManager.getActiveHitboxes();

        enemyHitboxes.forEach((hitbox: any) => {
          if (hitbox.isActive) {
            this.scene.physics.world.overlap(
              hitbox.sprite,
              this.player.sprite,
              () => this.handleEnemyAttackHit(hitbox.sprite, this.player.sprite)
            );
          }
        });
      }
    });
  }

  public getEnemies(): Actor[] {
    return [...this.enemies];
  }

  public getAliveEnemies(): Actor[] {
    return this.enemies.filter(enemy => !enemy.isDead);
  }

  public killAllEnemies(): void {
    this.enemies.forEach(enemy => {
      if (!enemy.isDead) {
        enemy.takeDamage(enemy.health);
      }
    });
  }

  public updateConfig(newConfig: Partial<EnemySpawnerConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart timer if interval changed
    if (newConfig.spawnInterval && this.spawnTimer) {
      this.stop();
      this.start();
    }
  }

  public destroy(): void {
    this.stop();
    this.enemies.forEach(enemy => {
      if ((enemy as any).deathCheckTimer) {
        (enemy as any).deathCheckTimer.destroy();
      }
    });
    this.enemies = [];
  }
}