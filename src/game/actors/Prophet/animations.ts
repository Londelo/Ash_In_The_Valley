import { Scene } from 'phaser';

export function createProphetAnimations(scene: Scene) {
  // Base breathing animation
  scene.anims.create({
    key: 'prophet_idle_breathe',
    frames: [
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 0' },
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 1' },
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 2' },
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 3' },
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 4' },
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 5' },
      { key: 'prophetAtlas', frame: 'prophet_idle_breathe 6' }
    ],
    frameRate: 6,
    repeat: -1
  });

  // Look up animation
  scene.anims.create({
    key: 'prophet_look_up',
    frames: [
      { key: 'prophetAtlas', frame: 'prophet_look_up 0' },
      { key: 'prophetAtlas', frame: 'prophet_look_up 1' },
      { key: 'prophetAtlas', frame: 'prophet_look_up 2' }
    ],
    frameRate: 8,
    repeat: 0
  });

  // Blinking animation
  scene.anims.create({
    key: 'prophet_idle_blink',
    frames: [
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 0' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 1' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 2' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 3' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 4' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 5' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 6' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 7' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 8' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 9' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 10' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 11' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 12' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 13' },
      { key: 'prophetAtlas', frame: 'prophet_idle_blink 14' }
    ],
    frameRate: 8,
    repeat: -1
  });

  // Look down animation
  scene.anims.create({
    key: 'prophet_look_down',
    frames: [
      { key: 'prophetAtlas', frame: 'prophet_look_down 0' },
      { key: 'prophetAtlas', frame: 'prophet_look_down 1' }
    ],
    frameRate: 8,
    repeat: 0
  });
}

export function addProphetAnimationListeners(prophet: any) {
  prophet.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
    if (animation.key === 'prophet_look_up') {
      prophet.onLookUpComplete();
    } else if (animation.key === 'prophet_look_down') {
      prophet.onLookDownComplete();
    }
  });
}
