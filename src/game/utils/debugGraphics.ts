import Phaser from 'phaser';

export function debugGraphics(
  graphics: Phaser.GameObjects.Graphics,
  sprite: any,
  scale: number = 1,
  attackHitboxes?: any[],
  spriteBorderColor: number = 0xff0000,
  lineWidth: number = 2,
) {
  if (!graphics || !sprite) return;
  graphics.clear();

  graphics.lineStyle(lineWidth, spriteBorderColor, 1);
  const bounds = sprite.getBounds();
  graphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

  graphics.lineStyle(lineWidth, 0x000000, 1);
  const body = sprite.body;
  graphics.strokeRect(body.x, body.y, body.width, body.height);

  graphics.setDepth(1000);

  const originX = bounds.x + sprite.displayOriginX * scale;
  const originY = bounds.y + sprite.displayOriginY * scale;
  graphics.lineStyle(1, 0x00ff00, 1);
  graphics.lineBetween(originX, bounds.y, originX, bounds.y + bounds.height);
  graphics.lineBetween(bounds.x, originY, bounds.x + bounds.width, originY);

  if (attackHitboxes) {
    graphics.lineStyle(lineWidth, 0x0000ff, 1);
    attackHitboxes.forEach(hitbox => {
      if (hitbox.isActive && hitbox.sprite.body) {
        const body = hitbox.sprite.body;
        graphics.strokeRect(body.x, body.y, body.width, body.height);
      }
    });
  }
}