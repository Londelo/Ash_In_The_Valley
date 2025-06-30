import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';
import { Elk } from '../../actors/Elk';
import { TileMapComponent } from '../../components/TileMap';
import { EnemySpawner, EnemySpawnerConfig } from '../../components/EnemySpawner';

export default class AvenWood extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  temple: Temple;
  elk: Elk;
  tileMapComponent: TileMapComponent;
  enemySpawner: EnemySpawner

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
    let playerStartX = templeLocation.x * tileMapConfig.scale;
    let playerStartY = config.player_start_y * tileMapConfig.scale;

    // Override with custom spawn if provided
    if (data && data.playerX !== undefined && data.playerY !== undefined) {
      playerStartX = data.playerX;
      playerStartY = data.playerY;
    }

    this.player = new Player(this, playerStartX, playerStartY);
    this.prophet = new Prophet(this, config.prophet_start_x * tileMapConfig.scale, config.prophet_start_y * tileMapConfig.scale, this.player);
    this.temple = new Temple(this, templeLocation.x, templeLocation.y, tileMapConfig.scale, this.player);
    
    // Add elk
    this.elk = new Elk(this, 1000, 600, this.player);

    this.player.create();
    this.prophet.create();
    this.temple.create();
    this.elk.create();

    // Setup enemy spawner
    this.setupEnemySpawner();

    this.camera.startFollow(this.player.sprite);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setFollowOffset(0, 250);

    this.physics.add.collider(this.player.sprite, this.world);
    this.physics.add.collider(this.prophet.sprite, this.world);
    this.physics.add.collider(this.temple.sprite, this.world);
    this.physics.add.collider(this.elk.sprite, this.world);

    // Setup elk collision detection
    this.setupElkCollisions();

    EventBus.emit('current-scene-ready', this);
  }

  private setupElkCollisions(): void {
    if (!this.elk) return;

    // Player attacks hit elk
    const checkPlayerAttackHit = () => {
      const playerHitboxes = this.player.attackHitboxManager.getActiveHitboxes();
      
      playerHitboxes.forEach(hitbox => {
        if (hitbox.isActive) {
          this.physics.world.overlap(
            hitbox.sprite,
            this.elk.sprite,
            () => this.handlePlayerAttackElk(hitbox.sprite, this.elk.sprite)
          );
        }
      });
    };

    // Check collisions every frame
    this.physics.world.on('worldstep', checkPlayerAttackHit);
  }

  private handlePlayerAttackElk = (playerAttack: any, elkSprite: any): void => {
    const attackHitbox = playerAttack.attackHitbox;

    if (attackHitbox && this.elk && attackHitbox.isActive) {
      // Check if this hitbox has already hit the elk
      if (attackHitbox.hasHitEntity('elk')) {
        return;
      }

      // Mark elk as hit by this hitbox
      attackHitbox.addHitEntity('elk');

      // Apply damage
      this.elk.takeDamage(attackHitbox.config.damage);
      
      console.log('Player hit elk for', attackHitbox.config.damage, 'damage');
    }
  };

  private setupEnemySpawner(): void {
    console.log(this.player.sprite.y);
    const spawnerConfig: EnemySpawnerConfig = {
      enemyClass: DaggerBandit,
      maxEnemies: 3,
      spawnInterval: 5000,
      spawnPoint: { x: 200, y: this.player.sprite.y },
      spawnRadius: 100,
      autoStart: true,
      respawnDelay: 3000
    };

    this.enemySpawner = new EnemySpawner(this, this.player, spawnerConfig);
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.prophet.update(time, delta);
    this.temple.update(time, delta);
    this.elk.update(time, delta);
    this.enemySpawner.update(time, delta);
  }

  changeScene() {
    this.enemySpawner?.destroy();
    this.scene.start('GehennaDeep');

  }
}