import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../actors/Player';
import { DaggerBandit } from '../actors/DaggerBandit';

export class Testing extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  ground: Phaser.Physics.Arcade.StaticGroup;

  // Actor instances
  player: Player;
  daggerBandit: DaggerBandit;

  constructor() {
    super('Testing');
  }

  create() {
    console.log('Testing scene create() called');

    // Initialize camera and background
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x2C5F2D); // Forest green background

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.3);

    // Create ground
    this.ground = this.physics.add.staticGroup();
    const groundRect = this.add.rectangle(512, 600, 1024, 40, 0x8B4513);
    this.ground.add(groundRect);
    // Create actor instances
    this.player = new Player(this, 300, 560);
    this.daggerBandit = new DaggerBandit(this, 700, 560, this.player);

    // Initialize actors
    this.player.create();
    this.daggerBandit.create();

    // Add colliders
    this.physics.add.collider(this.player.sprite, this.ground);
    this.physics.add.collider(this.daggerBandit.sprite, this.ground);
    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
    // Update all actors
    this.daggerBandit.update(time, delta);
    this.player.update(time, delta);
  }

  changeScene() {
    // For now, just restart the testing scene
    this.scene.restart();
  }
}
