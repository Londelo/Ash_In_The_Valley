import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { Boss } from '../../actors/Boss';
import { TileMapComponent } from '../../components/TileMap';

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  boss: Boss;
  tileMapComponent: TileMapComponent;

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

    const { width: mapWidth, height: mapHeight } = this.tileMapComponent.getMapDimensions();
    const playerSpawn: any = this.tileMapComponent.getObjectLayer('spawn')?.objects[0];
    const bossSpawn: any = this.tileMapComponent.getObjectLayer('boss_spawn')?.objects[0];

    this.player = new Player(this, playerSpawn.x * tileMapConfig.scale, playerSpawn.y * tileMapConfig.scale);
    this.boss = new Boss(this, bossSpawn?.x * tileMapConfig.scale || 750, bossSpawn?.y * tileMapConfig.scale || 400, this.player);

    this.player.create();
    this.boss.create();

    this.camera.startFollow(this.player.sprite);
    this.camera.setFollowOffset(0, 200);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    this.physics.add.collider(this.player.sprite, this.world);
    this.physics.add.collider(this.boss.sprite, this.world);

    this.setupCombat();

    EventBus.emit('current-scene-ready', this);
  }

  private setupCombat() {
    this.physics.add.overlap(
      this.player.attackHitboxManager.getActiveHitboxes().map(h => h.sprite),
      this.boss.sprite,
      (_playerHitbox: any, _bossSprite: any) => {
        const hitbox = _playerHitbox.attackHitbox;
        if (hitbox && hitbox.isActive) {
          EventBus.emit('damage_boss', hitbox.config.damage);
          hitbox.destroy();
        }
      }
    );

    this.physics.add.overlap(
      this.boss.attackHitboxManager.getActiveHitboxes().map(h => h.sprite),
      this.player.sprite,
      (_bossHitbox: any, _playerSprite: any) => {
        const hitbox = _bossHitbox.attackHitbox;
        if (hitbox && hitbox.isActive) {
          EventBus.emit('damage_player', hitbox.config.damage);
          hitbox.destroy();
        }
      }
    );
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.boss.update(time, delta);
    
    this.setupCombat();
  }
}