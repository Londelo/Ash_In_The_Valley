
export function setSpriteDirection(
  sprite: Phaser.GameObjects.Sprite,
  direction: 'left' | 'right',
  adjustForCenterOffset?: (direction: 'left' | 'right') => void
) {
  const { isRight, isLeft } = getSpriteDirection(sprite);

  if (direction === 'left' && isRight) {
    adjustForCenterOffset?.(direction);
    sprite.setFlipX(true);
  } else if (direction === 'right' && isLeft) {
    adjustForCenterOffset?.(direction);
    sprite.setFlipX(false);
  }
}

export function getSpriteDirection(sprite: Phaser.GameObjects.Sprite) {
  return {
    isLeft: sprite.flipX === true,
    isRight: sprite.flipX === false,
  };
}
