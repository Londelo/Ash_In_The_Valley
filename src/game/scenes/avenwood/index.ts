import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';
import { TileMapComponent } from '../../components/TileMap';
import { EnemySpawner, EnemySpawnerConfig } from '../../components/EnemySpawner';
import { Boss } from '../../actors/Boss';

export default class AvenWood extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;
  tileMapComponent: TileMapComponent;
  enemySpawner: EnemySpawner
  boss: Boss | null = null;

  constructor() {
    super('AvenWood');
  }

  create(data?: { playerX?: number, playerY?: number }) {
    this.camera = this.cameras.main;
    const { tileMapConfig } = config

    this.tileMapComponent = new TileMapComponent(this, tileMapConfig);
    const { map, world } = this.tileMapComponent.create();
    this.map = map;
    this.world = world;

    const { width: mapWidth, height: mapHeight } = this.tileMapComponent.getMapDimensions();
    const templeLocation = this.tileMapComponent.getObjectLayer('temple')?.objects[0] as any;

    // Determine player spawn position
    let playerStartX = config.player_start_x * tileMapConfig.scale;
    let playerStartY = config.player_start_y * tileMapConfig.scale;

    // Override with custom spawn if provided
    if (data && data.playerX !== undefined && data.playerY !== undefined) {
      playerStartX = data.playerX;
      playerStartY = data.playerY;
    }

    this.player = new Player(this, playerStartX, playerStartY);
    this.prophet = new Prophet(this, config.prophet_start_x * tileMapConfig.scale, config.prophet_start_y * tileMapConfig.scale, this.player);
    this.temple = new Temple(this, templeLocation.x, templeLocation.y, tileMapConfig.scale, this.player);

    // Create a single boss instance at center of map
    if (!this.boss) {
      const bossSpawnX = mapWidth / 2;
      const bossSpawnY = mapHeight / 2;
      this.boss = new Boss(this, bossSpawnX, bossSpawnY, this.player);
    }

    this.player.create();
    this.prophet.create();
    this.temple.create();
    if (this.boss) this.boss.create();

    this.camera.startFollow(this.player.sprite);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setFollowOffset(0, 250);

    this.physics.add.collider(this.player.sprite, this.world);
    this.physics.add.collider(this.prophet.sprite, this.world);
    this.physics.add.collider(this.temple.sprite, this.world);
    if (this.boss) this.physics.add.collider(this.boss.sprite, this.world);

    // Setup player attack hitboxes to damage boss
    if (this.boss) {
      this.physics.add.overlap(
        this.player.attackHitboxManager.getActiveHitboxes().map(h => h.sprite),
        this.boss.sprite,
        this.handlePlayerAttackHitBoss,
        undefined,
        this
      );

      // Setup boss attack hitboxes to damage player
      this.physics.add.overlap(
        this.boss.attackHitboxManager.getActiveHitboxes().map(h => h.sprite),
        this.player.sprite,
        this.handleBossAttackHitPlayer,
        undefined,
        this
      );
    }

    EventBus.emit('current-scene-ready', this);
  }

  private handlePlayerAttackHitBoss = (playerAttack: any, bossSprite: any): void => {
    const attackHitbox = playerAttack.attackHitbox;
    
    if (attackHitbox && attackHitbox.isActive && this.boss) {
      // Check if this hitbox has already hit the boss
      if (attackHitbox.hasHitEntity('boss')) {
        return; // Skip damage - boss was already hit by this hitbox
      }

      // Mark boss as hit by this hitbox
      attackHitbox.addHitEntity('boss');

      // Apply damage
      this.boss.takeDamage(attackHitbox.config.damage);

      // Emit damage event for boss
      EventBus.emit('damage_boss', attackHitbox.config.damage);
    }
  };

  private handleBossAttackHitPlayer = (bossAttack: any, playerSprite: any): void => {
    const attackHitbox = bossAttack.attackHitbox;

    if (attackHitbox && attackHitbox.isActive) {
      // Check if this hitbox has already hit the player
      if (attackHitbox.hasHitEntity('player')) {
        return; // Skip damage - player was already hit by this hitbox
      }

      // Mark player as hit by this hitbox
      attackHitbox.addHitEntity('player');

      // Apply damage
      this.player.takeDamage(attackHitbox.config.damage);
    }
  };

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.prophet.update(time, delta);
    this.temple.update(time, delta);
    if (this.boss) this.boss.update(time, delta);

    // Update dynamic collision detection for player and boss attacks
    this.updateDynamicCollisions();
  }

  private updateDynamicCollisions(): void {
    if (!this.boss) return;

    // Update player attack collisions with boss
    const playerHitboxes = this.player.attackHitboxManager.getActiveHitboxes();
    playerHitboxes.forEach(hitbox => {
      if (hitbox.isActive) {
        this.physics.world.overlap(
          hitbox.sprite,
          this.boss?.sprite,
          () => this.handlePlayerAttackHitBoss(hitbox.sprite, this.boss?.sprite)
        );
      }
    });

    // Update boss attack collisions with player
    const bossHitboxes = this.boss.attackHitboxManager.getActiveHitboxes();
    bossHitboxes.forEach(hitbox => {
      if (hitbox.isActive) {
        this.physics.world.overlap(
          hitbox.sprite,
          this.player.sprite,
          () => this.handleBossAttackHitPlayer(hitbox.sprite, this.player.sprite)
        );
      }
    });
  }

  changeScene() {
    this.scene.start('GehennaDeep');
  }
}