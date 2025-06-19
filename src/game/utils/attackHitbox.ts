export interface AttackHitboxConfig {
  width: number;
  height: number;
  offsetX_right: number;
  offsetX_left: number;
  offsetY: number;
  duration: number; // How long the hitbox stays active (ms)
  damage: number;
  attackerId: string; // Who created this attack
}

export class AttackHitboxManager {
  private scene: Phaser.Scene;
  private activeHitboxes: AttackHitbox[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createAttackHitbox(
    x: number,
    y: number,
    config: AttackHitboxConfig,
    direction: 'left' | 'right' = 'right'
  ): AttackHitbox {
    const offsetX = direction === 'left' ? config.offsetX_left : config.offsetX_right;
    const hitbox = new AttackHitbox(
      this.scene,
      x + offsetX,
      y + config.offsetY,
      config
    );
    this.activeHitboxes.push(hitbox);
    return hitbox;
  }

  public updateHitboxes(ownerX: number, ownerY: number, direction: 'left' | 'right') {
    this.activeHitboxes.forEach(hitbox => {
      if (hitbox.isActive) {
        const offsetX = direction === 'left' ? hitbox.config.offsetX_left : hitbox.config.offsetX_right;
        const newX = ownerX + offsetX;
        const newY = ownerY + hitbox.config.offsetY;
        hitbox.updatePosition(newX, newY);
      }
    });
  }

  public cleanupInactiveHitboxes() {
    this.activeHitboxes = this.activeHitboxes.filter(hitbox => {
      if (!hitbox.isActive) {
        return false;
      }
      return true;
    });
  }

  public getActiveHitboxes(): AttackHitbox[] {
    return this.activeHitboxes.filter(hitbox => hitbox.isActive);
  }

  public destroyAllHitboxes() {
    this.activeHitboxes.forEach(hitbox => hitbox.destroy());
    this.activeHitboxes = [];
  }
}

export class AttackHitbox {
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public config: AttackHitboxConfig;
  public isActive: boolean = true;
  private scene: Phaser.Scene;
  private timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, config: AttackHitboxConfig) {
    this.scene = scene;
    this.config = config;

    // Create invisible sprite for the hitbox
    this.sprite = scene.physics.add.sprite(x, y, '');
    this.sprite.setVisible(false); // Make it invisible
    this.sprite.setBodySize(config.width, config.height);

    // Store reference to this hitbox on the sprite
    this.sprite.attackHitbox = this;

    // Auto-destroy after duration
    this.timer = scene.time.delayedCall(config.duration, () => {
      this.destroy();
    });
  }

  public destroy() {
    this.isActive = false;
    if (this.timer) {
      this.timer.destroy();
    }
    if (this.sprite) {
      this.sprite.destroy();
    }
  }

  public updatePosition(x: number, y: number) {
    if (this.sprite && this.isActive) {
      this.sprite.setPosition(x, y);
    }
  }
}
