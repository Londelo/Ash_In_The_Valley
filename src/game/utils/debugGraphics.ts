import Phaser from 'phaser';

/**
 * Draws debug graphics for a sprite including sprite bounds, physics body, and origin crosshairs.
 * Optionally draws attack hitboxes in blue.
 * Call this in the update loop to keep the border and lines in sync.
 * @param graphics The Phaser.GameObjects.Graphics object to draw with
 * @param sprite The Phaser.GameObjects.Sprite to outline
 * @param scale The scale of the sprite
 * @param attackHitboxes Optional array of attack hitboxes to draw
 * @param spriteBorderColor The color of the sprite border (default: 0xff0000)
 * @param lineWidth The width of the border line (default: 2)
 */
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

  // Draw sprite bounds (red border)
  graphics.lineStyle(lineWidth, spriteBorderColor, 1);
  // Get the sprite's bounds in world space
  const bounds = sprite.getBounds();
  graphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

  // Draw physics body hitbox (black border)
  graphics.lineStyle(lineWidth, 0x000000, 1);
  const body = sprite.body;
  graphics.strokeRect(body.x, body.y, body.width, body.height);

  graphics.setDepth(1000); // Ensure border is above the sprite

  // Draw crosshairs for the sprite's origin (green)
  const originX = bounds.x + sprite.displayOriginX * scale;
  const originY = bounds.y + sprite.displayOriginY * scale;
  graphics.lineStyle(1, 0x00ff00, 1);
  graphics.lineBetween(originX, bounds.y, originX, bounds.y + bounds.height);
  graphics.lineBetween(bounds.x, originY, bounds.x + bounds.width, originY);

  // Draw attack hitboxes (blue border)
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
