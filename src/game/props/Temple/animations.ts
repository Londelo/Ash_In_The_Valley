import { Scene } from 'phaser';

export function createTempleAnimations(scene: Scene) {
  // Door light up animation
  scene.anims.create({
    key: 'temple_door_light_up',
    frames: [
      { key: 'templeAtlas', frame: 'door light up 0' },
      { key: 'templeAtlas', frame: 'door light up 1' },
      { key: 'templeAtlas', frame: 'door light up 2' },
      { key: 'templeAtlas', frame: 'door light up 3' },
      { key: 'templeAtlas', frame: 'door light up 4' },
      { key: 'templeAtlas', frame: 'door light up 5' },
      { key: 'templeAtlas', frame: 'door light up 6' },
      { key: 'templeAtlas', frame: 'door light up 7' },
      { key: 'templeAtlas', frame: 'door light up 8' },
      { key: 'templeAtlas', frame: 'door light up 9' },
      { key: 'templeAtlas', frame: 'door light up 10' },
      { key: 'templeAtlas', frame: 'door light up 11' },
      { key: 'templeAtlas', frame: 'door light up 12' },
      { key: 'templeAtlas', frame: 'door light up 13' },
      { key: 'templeAtlas', frame: 'door light up 14' },
      { key: 'templeAtlas', frame: 'door light up 15' },
      { key: 'templeAtlas', frame: 'door light up 16' },
      { key: 'templeAtlas', frame: 'door light up 17' },
      { key: 'templeAtlas', frame: 'door light up 18' }
    ],
    frameRate: 12,
    repeat: 0
  });

  // Door fade animation
  scene.anims.create({
    key: 'temple_door_fade',
    frames: [
      { key: 'templeAtlas', frame: 'door fade 0' },
      { key: 'templeAtlas', frame: 'door fade 1' },
      { key: 'templeAtlas', frame: 'door fade 2' },
      { key: 'templeAtlas', frame: 'door fade 3' },
      { key: 'templeAtlas', frame: 'door fade 4' },
      { key: 'templeAtlas', frame: 'door fade 5' },
      { key: 'templeAtlas', frame: 'door fade 6' },
      { key: 'templeAtlas', frame: 'door fade 7' },
      { key: 'templeAtlas', frame: 'door fade 8' },
      { key: 'templeAtlas', frame: 'door fade 9' },
      { key: 'templeAtlas', frame: 'door fade 10' },
      { key: 'templeAtlas', frame: 'door fade 11' },
      { key: 'templeAtlas', frame: 'door fade 12' },
      { key: 'templeAtlas', frame: 'door fade 13' },
      { key: 'templeAtlas', frame: 'door fade 14' },
      { key: 'templeAtlas', frame: 'door fade 15' },
      { key: 'templeAtlas', frame: 'door fade 16' },
      { key: 'templeAtlas', frame: 'door fade 17' },
      { key: 'templeAtlas', frame: 'door fade 18' }
    ],
    frameRate: 12,
    repeat: 0
  });
}

export function addTempleAnimationListeners(temple: any) {
  temple.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
    if (animation.key === 'temple_door_light_up') {
      temple.onLightUpComplete();
    } else if (animation.key === 'temple_door_fade') {
      temple.onFadeComplete();
    }
  });
}