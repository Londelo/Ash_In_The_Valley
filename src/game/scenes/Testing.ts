import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../actors/Player';
import { DaggerBandit } from '../actors/DaggerBandit';
import { Prophet } from '../actors/Prophet';

export class Testing extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  ground: Phaser.Physics.Arcade.StaticGroup;

  // Actor instances
  player: Player;
  bandits: DaggerBandit[] = [];
  prophet: Prophet;
  private readonly MAX_BANDITS = 5;
  private readonly MIN_BANDITS = 0;
  private readonly MIN_SPAWN_DISTANCE = 300;

  // Physics groups for hit detection
  playerGroup: Phaser.Physics.Arcade.Group;
  enemyGroup: Phaser.Physics.Arcade.Group;
  playerAttackGroup: Phaser.Physics.Arcade.Group;
  enemyAttackGroup: Phaser.Physics.Arcade.Group;

  constructor() {
    super('Testing');
  }

  create() {
    // Initialize camera and background
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x2C5F2D); // Forest green background

    this.background = this.add.image(1536, 384, 'background');
    this.background.setDisplaySize(3072, 768);
    this.background.setAlpha(0.3);

    // Create ground and walls
    this.ground = this.physics.add.staticGroup();

    // Ground platform
    const groundRect = this.add.rectangle(1536, 600, 3072, 40, 0x8B4513);
    this.ground.add(groundRect);

    // Left wall
    const leftWall = this.add.rectangle(20, 384, 40, 768, 0x654321);
    this.ground.add(leftWall);

    // Right wall
    const rightWall = this.add.rectangle(3052, 384, 40, 768, 0x654321);
    this.ground.add(rightWall);

    // Create physics groups
    this.playerGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.playerAttackGroup = this.physics.add.group();
    this.enemyAttackGroup = this.physics.add.group();

    // Create actor instances
    this.player = new Player(this, 500, 560);
    this.prophet = new Prophet(this, 800, 520, this.player); // Adjusted Y position

    // Initialize actors
    this.player.create();
    this.prophet.create();

    // Spawn initial bandits
    this.spawnInitialBandits();

    // Set camera to follow player
    this.camera.startFollow(this.player.sprite);
    this.physics.world.setBounds(0, 0, 3072, 768);
    this.camera.setBounds(0, 0, 3072, 768);

    // Add sprites to groups
    this.playerGroup.add(this.player.sprite);

    // Add colliders
    this.physics.add.collider(this.player.sprite, this.ground);
    this.physics.add.collider(this.enemyGroup, this.ground);
    this.physics.add.collider(this.prophet.sprite, this.ground);

    // Add overlap detection for attack hitboxes hitting enemy bodies
    this.physics.add.overlap(
      this.playerAttackGroup,
      this.enemyGroup,
      this.handlePlayerAttackHitEnemy,
      undefined,
      this
    );

    // Add overlap detection for enemy attacks hitting player
    this.physics.add.overlap(
      this.enemyAttackGroup,
      this.playerGroup,
      this.handleEnemyAttackHitPlayer,
      undefined,
      this
    );

    EventBus.emit('current-scene-ready', this);
  }

  private spawnInitialBandits() {
    for (let i = 0; i < this.MAX_BANDITS; i++) {
      this.spawnBandit();
    }
  }

  private spawnBandit() {
    let spawnX, spawnY;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // Random spawn position within world bounds (with some margin from edges)
      spawnX = Phaser.Math.Between(100, 2972);
      spawnY = 560; // Ground level
      attempts++;
    } while (
      this.getDistanceToPlayer(spawnX, spawnY) < this.MIN_SPAWN_DISTANCE &&
      attempts < maxAttempts
    );

    // Create and initialize bandit
    const bandit = new DaggerBandit(this, spawnX, spawnY, this.player);
    bandit.create();

    // Add to arrays and groups
    this.bandits.push(bandit);
    this.enemyGroup.add(bandit.sprite);
  }

  private getDistanceToPlayer(x: number, y: number): number {
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;
    return Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
  }

  private checkBanditCount() {
    // Remove dead bandits from array
    this.bandits = this.bandits.filter(bandit => !bandit.isDead);

    // Spawn new bandits if below minimum
    while (this.bandits.length < this.MIN_BANDITS) {
      this.spawnBandit();
    }
  }

  private handlePlayerAttackHitEnemy(
    attackSprite: any,
    enemySprite: any
  ) {
    const attackSpr = attackSprite as Phaser.GameObjects.Sprite;
    const enemySpr = enemySprite as Phaser.GameObjects.Sprite;

    const attackHitbox = attackSpr.attackHitbox;
    const banditInstance = enemySpr.banditInstance;

    if (attackHitbox && attackHitbox.isActive && banditInstance && banditInstance.uniqueId) {
      // Emit targeted damage event using the enemy's unique ID
      EventBus.emit(`damage_${banditInstance.uniqueId}`, attackHitbox.config.damage);
      console.log(`Player attack hit bandit ${banditInstance.uniqueId} for ${attackHitbox.config.damage} damage`);

      // Deactivate the hitbox so it doesn't hit multiple times
      attackHitbox.destroy();
    }
  }

  private handleEnemyAttackHitPlayer(
    attackSprite: any,
    _playerSprite: any
  ) {
    const attackSpr = attackSprite as Phaser.GameObjects.Sprite;
    const attackHitbox = attackSpr.attackHitbox;

    if (attackHitbox && attackHitbox.isActive) {
      // Player takes damage
      this.player.takeDamage(attackHitbox.config.damage);

      // Deactivate the hitbox so it doesn't hit multiple times
      attackHitbox.destroy();
    }
  }

  update(time: number, delta: number) {
    // Add new attack hitboxes to appropriate groups
    this.player.attackHitboxManager.getActiveHitboxes().forEach(hitbox => {
      if (hitbox.isActive && !this.playerAttackGroup.contains(hitbox.sprite)) {
        this.playerAttackGroup.add(hitbox.sprite);
      }
    });

    this.bandits.forEach(bandit => {
      bandit.attackHitboxManager.getActiveHitboxes().forEach(hitbox => {
        if (hitbox.isActive && !this.enemyAttackGroup.contains(hitbox.sprite)) {
          this.enemyAttackGroup.add(hitbox.sprite);
        }
      });
    });

    // Update all bandits
    this.bandits.forEach(bandit => {
      if (!bandit.isDead) {
        bandit.update(time, delta);
      }
    });

    // Check bandit count and spawn more if needed
    this.checkBanditCount();

    // Update player
    this.player.update(time, delta);

    // Update prophet
    this.prophet.update(time, delta);
  }

  changeScene() {
    // For now, just restart the testing scene
    this.scene.restart();
  }
}
