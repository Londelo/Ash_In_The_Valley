import { Scene } from 'phaser';

export function createProphetAnimations(scene: Scene) {
  // Base breathing animation
  scene.anims.create({
    key: 'prophet_idle_breathe',
    frames: [
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 0.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 1.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 2.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 3.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 4.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 5.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_breathe 6.aseprite' }
    ],
    frameRate: 6,
    repeat: -1
  });

  // Look up animation
  scene.anims.create({
    key: 'prophet_look_up',
    frames: [
      { key: 'prophetAtlas', frame: 'NPCs #prophet_look_up 0.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_look_up 1.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_look_up 2.aseprite' }
    ],
    frameRate: 8,
    repeat: 0
  });

  // Blinking animation
  scene.anims.create({
    key: 'prophet_idle_blink',
    frames: [
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 0.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 1.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 2.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 3.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 4.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 5.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 6.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 7.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 8.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 9.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 10.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 11.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 12.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 13.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_idle_blink 14.aseprite' }
    ],
    frameRate: 8,
    repeat: -1
  });

  // Look down animation
  scene.anims.create({
    key: 'prophet_look_down',
    frames: [
      { key: 'prophetAtlas', frame: 'NPCs #prophet_look_down 0.aseprite' },
      { key: 'prophetAtlas', frame: 'NPCs #prophet_look_down 1.aseprite' }
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