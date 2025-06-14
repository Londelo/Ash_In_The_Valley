import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../actors/Player';
import { DaggerBandit } from '../actors/DaggerBandit';

export class Testing extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  
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

    // Create actor instances
    this.player = new Player(this, 300, 600);
    this.daggerBandit = new DaggerBandit(this, 700, 600, this.player);

    // Initialize actors
    this.player.create();
    this.daggerBandit.create();

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
    // Update all actors
    this.player.update(time, delta);
    this.daggerBandit.update(time, delta);
  }

  changeScene() {
    // For now, just restart the testing scene
    this.scene.restart();
  }
}