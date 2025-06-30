import config from './config';
import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { DaggerBandit } from '../../actors/DaggerBandit';
import { Prophet } from '../../actors/Prophet';
import { Temple } from '../../props/Temple';
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
  tileMapComponent: TileMapComponent;
<<<<<<< HEAD
  enemySpawner: EnemySpawner
=======
  uiText: Phaser.GameObjects.Text;
>>>>>>> 5a03fed (ASH-9: added boss assets)

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

    this.player.create();
    this.prophet.create();
    this.temple.create();

    this.createUI();
    this.setupCombat();

    this.camera.startFollow(this.player.sprite);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setBounds(0, 0, mapWidth, mapHeight);
    this.camera.setFollowOffset(0, 250);

    this.physics.add.collider(this.player.sprite, this.world);
    this.physics.add.collider(this.prophet.sprite, this.world);
    this.physics.add.collider(this.temple.sprite, this.world);

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
      `Aven Wood - The Sacred Forest`,
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
      'P - [DEBUG] Talk to Evil Prophet',
      'T - Enter Temple (near door)',
      '',
      'Approach the Prophet to speak...'
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
    // Stop any ongoing prophet conversation
    if (this.prophet.chatAI && this.prophet.chatAI.getIsConversationActive()) {
      this.prophet.chatAI.endConversation();
    }

    // Show transformation message
    const transformText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 
      'The Prophet\'s true form is revealed!\nA terrible transformation begins...', {
      fontSize: '24px',
      color: '#ff0000',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 },
      align: 'center'
    });
    transformText.setOrigin(0.5);
    transformText.setScrollFactor(0);
    transformText.setDepth(2000);

    // Add dramatic effect
    this.cameras.main.shake(1500, 0.03);
    
    // Flash effect
    this.cameras.main.flash(800, 255, 0, 0);

    // Make prophet flash and change color
    this.prophet.sprite.setTint(0xff0000);
    this.tweens.add({
      targets: this.prophet.sprite,
      alpha: { from: 1, to: 0.3 },
      duration: 200,
      yoyo: true,
      repeat: 6
    });

    // Transition to boss fight after dramatic pause
    this.time.delayedCall(3000, () => {
      this.scene.start('BossFight');
    });
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);
    this.prophet.update(time, delta);
    this.temple.update(time, delta);
<<<<<<< HEAD
    this.enemySpawner.update(time, delta);
=======
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
>>>>>>> 5a03fed (ASH-9: added boss assets)
  }

  changeScene() {
    this.enemySpawner?.destroy();
    this.scene.start('GehennaDeep');

  }
}
