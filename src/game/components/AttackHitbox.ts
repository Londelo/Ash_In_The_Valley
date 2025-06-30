export interface AttackHitboxConfig {
  width: number;
  height: number;
  offsetX_right: number;
  offsetX_left: number;
  offsetY: number;
  duration: number;
  damage: number;
  attackerId: string;
  delay?: number; // New delay property in milliseconds
}

export class AttackHitboxManager {
  private scene: Phaser.Scene;
  private activeHitboxes: AttackHitbox[] = [];
  private pendingHitboxes: PendingHitbox[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createAttackHitbox(
    x: number,
    y: number,
    config: AttackHitboxConfig,
    direction: 'left' | 'right' = 'right'
  ): AttackHitbox | null {
    const delay = config.delay || 0;

    if (delay > 0) {
      // Create pending hitbox that will spawn after delay
      const pendingHitbox = new PendingHitbox(this.scene, x, y, config, direction, delay);
      this.pendingHitboxes.push(pendingHitbox);
      return null; // Return null since hitbox isn't active yet
    } else {
      // Create hitbox immediately
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
  }

  public updateHitboxes(ownerX: number, ownerY: number, direction: 'left' | 'right') {
    // Update active hitboxes
    this.activeHitboxes.forEach(hitbox => {
      if (hitbox.isActive) {
        const offsetX = direction === 'left' ? hitbox.config.offsetX_left : hitbox.config.offsetX_right;
        const newX = ownerX + offsetX;
        const newY = ownerY + hitbox.config.offsetY;
        hitbox.updatePosition(newX, newY);
      }
    });

    // Update pending hitboxes
    this.pendingHitboxes.forEach(pendingHitbox => {
      if (pendingHitbox.isActive) {
        const offsetX = direction === 'left' ? pendingHitbox.config.offsetX_left : pendingHitbox.config.offsetX_right;
        const newX = ownerX + offsetX;
        const newY = ownerY + pendingHitbox.config.offsetY;
        pendingHitbox.updatePosition(newX, newY);
      }
    });
  }

  public cleanupInactiveHitboxes() {
    // Clean up active hitboxes
    this.activeHitboxes = this.activeHitboxes.filter(hitbox => {
      if (!hitbox.isActive) {
        return false;
      }
      return true;
    });

    // Clean up pending hitboxes and promote ready ones
    this.pendingHitboxes = this.pendingHitboxes.filter(pendingHitbox => {
      if (!pendingHitbox.isActive) {
        return false;
      }

      if (pendingHitbox.isReady()) {
        // Convert pending hitbox to active hitbox
        const activeHitbox = pendingHitbox.createActiveHitbox();
        this.activeHitboxes.push(activeHitbox);
        pendingHitbox.destroy();
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
    this.pendingHitboxes.forEach(pendingHitbox => pendingHitbox.destroy());
    this.activeHitboxes = [];
    this.pendingHitboxes = [];
  }
}

class PendingHitbox {
  public config: AttackHitboxConfig;
  public isActive: boolean = true;
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private direction: 'left' | 'right';
  private delayTimer: Phaser.Time.TimerEvent;
  private ready: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: AttackHitboxConfig, direction: 'left' | 'right', delay: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.config = config;
    this.direction = direction;

    this.delayTimer = scene.time.delayedCall(delay, () => {
      this.ready = true;
    });
  }

  public updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public createActiveHitbox(): AttackHitbox {
    const offsetX = this.direction === 'left' ? this.config.offsetX_left : this.config.offsetX_right;
    return new AttackHitbox(
      this.scene,
      this.x + offsetX,
      this.y + this.config.offsetY,
      this.config
    );
  }

  public destroy() {
    this.isActive = false;
    if (this.delayTimer) {
      this.delayTimer.destroy();
    }
  }
}

export class AttackHitbox {
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public config: AttackHitboxConfig;
  public isActive: boolean = true;
  public hitEntities: Set<string> = new Set();
  private scene: Phaser.Scene;
  private timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, config: AttackHitboxConfig) {
    this.scene = scene;
    this.config = config;
    this.hitEntities = new Set<string>();

    this.sprite = scene.physics.add.sprite(x, y, '');
    this.sprite.setVisible(false);
    this.sprite.setBodySize(config.width, config.height);
    this.sprite.attackHitbox = this;

    this.timer = scene.time.delayedCall(config.duration, () => {
      this.destroy();
    });
  }

  public hasHitEntity(entityId: string): boolean {
    return this.hitEntities.has(entityId);
  }

  public addHitEntity(entityId: string): void {
    this.hitEntities.add(entityId);
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
