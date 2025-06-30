import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { Prophet } from '../../actors/Prophet';
import { TileMapComponent } from '../../components/TileMap';

export default class GehennaDeep extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  world: Phaser.Physics.Arcade.StaticGroup;

  player: Player;
  prophet: Prophet;
  tileMapComponent: TileMapComponent;
  uiText: Phaser.GameObjects.Text;

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

    this.player = new Player(this, playerSpawn.x * tileMapConfig.scale, playerSpawn.y * tileMapConfig.scale);
    
    // Create the Prophet NPC in the center of the cave
    this.prophet = new Prophet(this, mapWidth / 2, playerSpawn.y * tileMapConfig.scale, this.player);

    this.player.create();
    this.prophet.create();

    this.createUI();
    this.setupCombat();

    this.camera.startFollow(this.player.sprite);
    this.camera.setFollowOffset(0, 200);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);

    this.physics.add.collider(this.player.sprite, this.world);
    this.physics.add.collider(this.prophet.sprite, this.world);

    EventBus.emit('current-scene-ready', this);
  }

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
      `Gehenna Deep - The Prophet's Domain`,
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
      'Find the corrupted Prophet...',
      'Attack him to begin the final confrontation!'
    ]);
  }

  private setupCombat() {
    // Player attacks Prophet - this triggers the boss fight
    this.physics.add.overlap(
      this.player.sprite,
      this.prophet.sprite,
      () => {
        // Check for active player hitboxes
        const activeHitboxes = this.player.attackHitboxManager.getActiveHitboxes();
        activeHitboxes.forEach(hitbox => {
          if (hitbox.isActive && this.physics.overlap(hitbox.sprite, this.prophet.sprite)) {
            // Prophet has been attacked - trigger boss fight transformation
            this.triggerBossFight();
            hitbox.destroy();
          }
        });
      }
    );
  }

  private triggerBossFight() {
    // Show transformation message
    const transformText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 
      'The Prophet transforms into something terrible...', {
      fontSize: '24px',
      color: '#ff0000',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    });
    transformText.setOrigin(0.5);
    transformText.setScrollFactor(0);
    transformText.setDepth(2000);

    // Add dramatic effect
    this.cameras.main.shake(1000, 0.02);
    
    // Flash effect
    this.cameras.main.flash(500, 255, 0, 0);

    // Transition to boss fight after dramatic pause
    this.time.delayedCall(2000, () => {
      this.scene.start('BossFight');
    });
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.prophet.update(time, delta);
    this.updateUI();
    this.updateCombatOverlaps();
  }

  private updateCombatOverlaps() {
    // Continuously check for combat overlaps
    const playerHitboxes = this.player.attackHitboxManager.getActiveHitboxes();

    // Player hitting Prophet
    playerHitboxes.forEach(hitbox => {
      if (hitbox.isActive && this.physics.overlap(hitbox.sprite, this.prophet.sprite)) {
        this.triggerBossFight();
        hitbox.destroy();
      }
    });
  }
}