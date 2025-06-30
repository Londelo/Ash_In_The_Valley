import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Player } from '../../actors/Player';
import { Boss } from '../../actors/Boss';

export default class BossFight extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Player;
  boss: Boss;
  uiText: Phaser.GameObjects.Text;
  
  private fightStarted: boolean = false;
  private fightDuration: number = 0;
  private readonly ARENA_WIDTH = 1200;
  private readonly ARENA_HEIGHT = 400;
  private readonly ARENA_CENTER_X = 600;
  private readonly ARENA_CENTER_Y = 300;

  constructor() {
    super('BossFight');
  }

  create() {
    this.camera = this.cameras.main;
    
    // Create arena background
    this.createArena();
    
    // Create player and boss
    this.player = new Player(this, this.ARENA_CENTER_X - 300, this.ARENA_CENTER_Y);
    this.boss = new Boss(this, this.ARENA_CENTER_X + 200, this.ARENA_CENTER_Y - 50, this.player);

    this.player.create();
    this.boss.create();

    // Create UI
    this.createUI();

    // Setup camera
    this.camera.setBounds(0, 0, this.ARENA_WIDTH, this.ARENA_HEIGHT);
    this.camera.setZoom(1.2);
    this.camera.centerOn(this.ARENA_CENTER_X, this.ARENA_CENTER_Y);

    // Setup physics world bounds
    this.physics.world.setBounds(50, 0, this.ARENA_WIDTH - 100, this.ARENA_HEIGHT);

    // Create arena boundaries
    this.createArenaBoundaries();

    // Setup combat
    this.setupCombat();

    // Start the fight
    this.startFight();

    EventBus.emit('current-scene-ready', this);
  }

  private createArena() {
    // Dark background
    this.add.rectangle(this.ARENA_CENTER_X, this.ARENA_CENTER_Y, this.ARENA_WIDTH, this.ARENA_HEIGHT, 0x1a0a0a);
    
    // Arena floor
    const floor = this.add.rectangle(this.ARENA_CENTER_X, this.ARENA_HEIGHT - 25, this.ARENA_WIDTH - 100, 50, 0x2a1a1a);
    
    // Arena walls (visual)
    this.add.rectangle(25, this.ARENA_CENTER_Y, 50, this.ARENA_HEIGHT, 0x3a2a2a);
    this.add.rectangle(this.ARENA_WIDTH - 25, this.ARENA_CENTER_Y, 50, this.ARENA_HEIGHT, 0x3a2a2a);
    
    // Atmospheric lighting effects
    const light1 = this.add.circle(200, 100, 80, 0x4a3a3a, 0.3);
    const light2 = this.add.circle(this.ARENA_WIDTH - 200, 100, 80, 0x4a3a3a, 0.3);
    
    // Add some ominous decorative elements
    this.add.text(this.ARENA_CENTER_X, 50, 'THE CORRUPTED PROPHET', {
      fontSize: '24px',
      color: '#8b0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  private createArenaBoundaries() {
    // Create invisible physics bodies for arena boundaries
    const ground = this.physics.add.staticGroup();
    
    // Floor
    const floor = this.add.rectangle(this.ARENA_CENTER_X, this.ARENA_HEIGHT - 25, this.ARENA_WIDTH - 100, 50, 0x000000, 0);
    ground.add(floor);
    
    // Left wall
    const leftWall = this.add.rectangle(25, this.ARENA_CENTER_Y, 50, this.ARENA_HEIGHT, 0x000000, 0);
    ground.add(leftWall);
    
    // Right wall
    const rightWall = this.add.rectangle(this.ARENA_WIDTH - 25, this.ARENA_CENTER_Y, 50, this.ARENA_HEIGHT, 0x000000, 0);
    ground.add(rightWall);

    // Add collisions
    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(this.boss.sprite, ground);
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
    const bossHealthPercent = Math.max(0, (this.boss.health / this.boss.maxHealth) * 100);
    const playerHealthPercent = Math.max(0, (this.player.health / this.player.maxHealth) * 100);
    const fightMinutes = Math.floor(this.fightDuration / 60000);
    const fightSeconds = Math.floor((this.fightDuration % 60000) / 1000);
    
    this.uiText.setText([
      `BOSS FIGHT - Time: ${fightMinutes}:${fightSeconds.toString().padStart(2, '0')}`,
      `Boss Health: ${bossHealthPercent.toFixed(0)}%`,
      `Player Health: ${playerHealthPercent.toFixed(0)}%`,
      '',
      'Combat Responses:',
      'Y - "You\'re nothing but a corrupted shadow!"',
      'U - "Your transformation won\'t save you!"',
      'I - "I\'ve faced worse demons than you!"',
      'O - "Your evil ends here, false prophet!"'
    ]);
  }

  private setupCombat() {
    // Player attacks boss
    this.physics.add.overlap(
      this.player.sprite,
      this.boss.sprite,
      () => {
        // Check for active player hitboxes
        const activeHitboxes = this.player.attackHitboxManager.getActiveHitboxes();
        activeHitboxes.forEach(hitbox => {
          if (hitbox.isActive && this.physics.overlap(hitbox.sprite, this.boss.sprite)) {
            EventBus.emit('damage_boss', hitbox.config.damage);
            hitbox.destroy();
          }
        });
      }
    );

    // Boss attacks player
    this.physics.add.overlap(
      this.boss.sprite,
      this.player.sprite,
      () => {
        // Check for active boss hitboxes
        const activeHitboxes = this.boss.attackHitboxManager.getActiveHitboxes();
        activeHitboxes.forEach(hitbox => {
          if (hitbox.isActive && this.physics.overlap(hitbox.sprite, this.player.sprite)) {
            EventBus.emit('damage_player', hitbox.config.damage);
            hitbox.destroy();
          }
        });
      }
    );

    // Listen for boss death
    EventBus.on('boss_defeated', this.onBossDefeated.bind(this));
    
    // Listen for player death
    EventBus.on('player_defeated', this.onPlayerDefeated.bind(this));
  }

  private startFight() {
    this.fightStarted = true;
    
    // Show fight start message
    const startText = this.add.text(this.ARENA_CENTER_X, this.ARENA_CENTER_Y - 100, 'FIGHT!', {
      fontSize: '48px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Fade out start text
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 2000,
      onComplete: () => startText.destroy()
    });

    // Start boss AI conversation
    this.time.delayedCall(1000, () => {
      if (this.boss.chatAI && !this.boss.chatAI.getIsConversationActive()) {
        this.boss.chatAI.startConversation();
      }
    });
  }

  private onBossDefeated() {
    this.fightStarted = false;
    
    // Show victory message
    const victoryText = this.add.text(this.ARENA_CENTER_X, this.ARENA_CENTER_Y - 100, 'VICTORY!', {
      fontSize: '48px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Return to AvenWood after delay
    this.time.delayedCall(3000, () => {
      this.scene.start('AvenWood');
    });
  }

  private onPlayerDefeated() {
    this.fightStarted = false;
    
    // Show defeat message
    const defeatText = this.add.text(this.ARENA_CENTER_X, this.ARENA_CENTER_Y - 100, 'DEFEAT...', {
      fontSize: '48px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Return to AvenWood after delay
    this.time.delayedCall(3000, () => {
      this.scene.start('AvenWood');
    });
  }

  update(time: number, delta: number) {
    if (this.fightStarted) {
      this.fightDuration += delta;
    }

    // Check for boss death
    if (this.boss.isDead && this.fightStarted) {
      EventBus.emit('boss_defeated');
    }

    // Check for player death
    if (this.player.isDead && this.fightStarted) {
      EventBus.emit('player_defeated');
    }

    this.player.update(time, delta);
    this.boss.update(time, delta);
    
    this.updateUI();
    this.updateCombatOverlaps();
  }

  private updateCombatOverlaps() {
    // Continuously check for combat overlaps since Phaser's overlap detection
    // can miss fast-moving objects
    const playerHitboxes = this.player.attackHitboxManager.getActiveHitboxes();
    const bossHitboxes = this.boss.attackHitboxManager.getActiveHitboxes();

    // Player hitting boss
    playerHitboxes.forEach(hitbox => {
      if (hitbox.isActive && this.physics.overlap(hitbox.sprite, this.boss.sprite)) {
        EventBus.emit('damage_boss', hitbox.config.damage);
        hitbox.destroy();
      }
    });

    // Boss hitting player
    bossHitboxes.forEach(hitbox => {
      if (hitbox.isActive && this.physics.overlap(hitbox.sprite, this.player.sprite)) {
        EventBus.emit('damage_player', hitbox.config.damage);
        hitbox.destroy();
      }
    });
  }
}