import { debugGraphics } from '../utils/debugGraphics';

export interface ActorConfig {
  scale: number;
  bodyWidth: number;
  bodyHeight: number;
  centerXLeft: number;
  centerXRight: number;
  centerY: number;
  health: number;
  attackPower: number;
  invulnerabilityDuration?: number;
  bodyOffsetY?: number;
  knockbackForce?: number;
  deathAnimationKey?: string;
  hitAnimationKey?: string;
}

export abstract class Actor {
  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public health: number;
  public maxHealth: number;
  public attackPower: number;
  public isDead: boolean = false;
  public isInvulnerable: boolean = false;

  protected config: ActorConfig;
  protected invulnerabilityTimer: number = 0;
  protected boundingBox: Phaser.GameObjects.Graphics;
  protected debugEnabled: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string, frameKey: string, config: ActorConfig) {
    this.scene = scene;
    this.config = config;
    this.health = config.health;
    this.maxHealth = config.health;
    this.attackPower = config.attackPower;

    this.sprite = scene.physics.add.sprite(x, y, textureKey, frameKey);
    this.setActorScale(config.scale);
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(300);
    this.sprite.setBodySize(config.bodyWidth, config.bodyHeight, false);
    this.adjustForCenterOffset('right');

    this.boundingBox = scene.add.graphics();
  }

  public setActorScale(scale: number): void {
    this.config.scale = scale;
    this.sprite.setScale(scale);
  }

  public adjustForCenterOffset = (direction: 'left' | 'right'): void => {
    if (direction === 'left') {
      this.sprite.setOrigin(this.config.centerXLeft, this.config.centerY);
    } else {
      this.sprite.setOrigin(this.config.centerXRight, this.config.centerY);
    }

    const offsetX = this.sprite.displayOriginX - this.config.bodyWidth / 2;
    const offsetY = this.getBodyOffsetY();
    this.sprite.body.setOffset(offsetX, offsetY);
  }

  protected getBodyOffsetY(): number {
    return this.config.bodyOffsetY ?? 0;
  }

  public takeDamage(amount: number): void {
    if (this.isInvulnerable || this.isDead) return;

    this.health = Math.max(0, this.health - amount);

    if (this.health <= 0) {
      this.onDeath();
    } else {
      this.onHit(amount);
    }
  }

  protected onDeath(): void {
    this.isDead = true;
    this.sprite.setVelocityX(0);
    this.playDeathAnimation();
  }

  protected onHit(damage: number): void {
    this.playHitAnimation();
    this.applyKnockback();
    this.startInvulnerability();
    this.showHitEffect();
  }

  protected applyKnockback(): void {
    const knockbackForce = this.getKnockbackForce();
    const knockbackDirection = this.sprite.flipX ? 1 : -1;
    this.sprite.setVelocityX(knockbackDirection * knockbackForce);
  }

  protected getKnockbackForce(): number {
    return this.config.knockbackForce ?? 200;
  }

  protected startInvulnerability(): void {
    if (this.config.invulnerabilityDuration) {
      this.isInvulnerable = true;
      this.invulnerabilityTimer = 0;
    }
  }

  protected showHitEffect(): void {
    this.sprite.setTint(0xf0f8ff);
    this.scene.time.delayedCall(200, () => {
      this.sprite.clearTint();
      this.sprite.setVelocityX(0);
    });
  }

  protected updateInvulnerabilityTimer(delta: number): void {
    if (this.isInvulnerable && this.config.invulnerabilityDuration) {
      this.invulnerabilityTimer += delta;
      if (this.invulnerabilityTimer >= this.config.invulnerabilityDuration) {
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
      }
    }
  }

  protected playDeathAnimation(): void {
    if (this.config.deathAnimationKey) {
      this.sprite.play(this.config.deathAnimationKey);
    }
  }

  protected playHitAnimation(): void {
    if (this.config.hitAnimationKey) {
      this.sprite.play(this.config.hitAnimationKey);
    }
  }

  public abstract create(): void;
  public abstract update(time: number, delta: number): void;

  protected renderDebugGraphics(activeHitboxes?: any[]): void {
    if (!this.debugEnabled) return;
    debugGraphics(this.boundingBox, this.sprite, this.config.scale, activeHitboxes);
  }
}