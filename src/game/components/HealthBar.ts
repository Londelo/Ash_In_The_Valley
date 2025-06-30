import { Scene } from 'phaser';

export interface HealthBarConfig {
  width: number;
  height: number;
  borderWidth: number;
  borderColor: number;
  backgroundColor: number;
  fillColor: number;
  offsetY: number;
  showBorder?: boolean;
  showBackground?: boolean;
}

export class HealthBar {
  private scene: Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private config: HealthBarConfig;
  
  private border: Phaser.GameObjects.Rectangle;
  private background: Phaser.GameObjects.Rectangle;
  private bar: Phaser.GameObjects.Rectangle;
  
  private currentHealth: number;
  private maxHealth: number;

  constructor(scene: Scene, sprite: Phaser.GameObjects.Sprite, config: HealthBarConfig) {
    this.scene = scene;
    this.sprite = sprite;
    this.config = {
      showBorder: true,
      showBackground: true,
      ...config
    };
    
    this.currentHealth = 100;
    this.maxHealth = 100;
    
    this.createHealthBar();
  }
  
  private createHealthBar(): void {
    const { width, height, borderWidth, borderColor, backgroundColor, fillColor, offsetY, showBorder, showBackground } = this.config;
    
    // Create border (optional)
    if (showBorder) {
      this.border = this.scene.add.rectangle(
        this.sprite.x,
        this.sprite.y - offsetY,
        width + borderWidth * 2,
        height + borderWidth * 2,
        borderColor
      );
      this.border.setDepth(100);
    }
    
    // Create background (optional)
    if (showBackground) {
      this.background = this.scene.add.rectangle(
        this.sprite.x,
        this.sprite.y - offsetY,
        width,
        height,
        backgroundColor
      );
      this.background.setDepth(101);
    }
    
    // Create health bar
    this.bar = this.scene.add.rectangle(
      this.sprite.x - width / 2,
      this.sprite.y - offsetY,
      width,
      height,
      fillColor
    );
    this.bar.setOrigin(0, 0.5);
    this.bar.setDepth(102);
  }
  
  public update(currentHealth: number, maxHealth: number): void {
    this.currentHealth = currentHealth;
    this.maxHealth = maxHealth;
    
    // Update position to follow sprite
    const x = this.sprite.x;
    const y = this.sprite.y - this.config.offsetY;
    
    if (this.border) {
      this.border.setPosition(x, y);
    }
    
    if (this.background) {
      this.background.setPosition(x, y);
    }
    
    // Update health bar width based on health percentage
    const healthPercentage = Math.max(0, Math.min(1, this.currentHealth / this.maxHealth));
    const barWidth = this.config.width * healthPercentage;
    
    this.bar.setPosition(x - this.config.width / 2, y);
    this.bar.width = barWidth;
    
    // Change color based on health percentage
    if (healthPercentage <= 0.2) {
      this.bar.fillColor = 0xff0000; // Red when low health
    } else if (healthPercentage <= 0.5) {
      this.bar.fillColor = 0xffff00; // Yellow when medium health
    } else {
      this.bar.fillColor = this.config.fillColor; // Default color
    }
  }
  
  public destroy(): void {
    if (this.border) {
      this.border.destroy();
    }
    
    if (this.background) {
      this.background.destroy();
    }
    
    if (this.bar) {
      this.bar.destroy();
    }
  }
}