import { Scene } from 'phaser';
import { Player } from '.';

export function createPlayerAnimations(scene: Scene) {
  scene.anims.create({
    key: 'idle',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Idle 0' },
      { key: 'mainCharacterAtlas', frame: 'Idle 1' },
      { key: 'mainCharacterAtlas', frame: 'Idle 2' },
      { key: 'mainCharacterAtlas', frame: 'Idle 3' },
      { key: 'mainCharacterAtlas', frame: 'Idle 4' },
      { key: 'mainCharacterAtlas', frame: 'Idle 5' },
      { key: 'mainCharacterAtlas', frame: 'Idle 6' },
      { key: 'mainCharacterAtlas', frame: 'Idle 7' },
      { key: 'mainCharacterAtlas', frame: 'Idle 8' }
    ],
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'walk',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Run 1' },
      { key: 'mainCharacterAtlas', frame: 'Run 2' },
      { key: 'mainCharacterAtlas', frame: 'Run 3' },
      { key: 'mainCharacterAtlas', frame: 'Run 4' },
      { key: 'mainCharacterAtlas', frame: 'Run 5' },
      { key: 'mainCharacterAtlas', frame: 'Run 6' },
      { key: 'mainCharacterAtlas', frame: 'Run 7' }
    ],
    frameRate: 12,
    repeat: -1
  });

  scene.anims.create({
    key: 'run',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Run Fast 0' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 1' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 2' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 3' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 4' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 5' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 6' },
      { key: 'mainCharacterAtlas', frame: 'Run Fast 7' }
    ],
    frameRate: 15,
    repeat: -1
  });

  scene.anims.create({
    key: 'jump',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Jump 0' },
      { key: 'mainCharacterAtlas', frame: 'Jump 1' },
      { key: 'mainCharacterAtlas', frame: 'Jump 2' }
    ],
    frameRate: 10,
    repeat: 0
  });

  scene.anims.create({
    key: 'fall',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Fall 0' },
      { key: 'mainCharacterAtlas', frame: 'Fall 1' },
      { key: 'mainCharacterAtlas', frame: 'Fall 2' }
    ],
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'land',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'crouch land 0' },
      { key: 'mainCharacterAtlas', frame: 'crouch land 1' },
      { key: 'mainCharacterAtlas', frame: 'crouch land 2' },
      { key: 'mainCharacterAtlas', frame: 'crouch land 3' }
    ],
    frameRate: 12,
    repeat: 0
  });

  scene.anims.create({
    key: 'dash',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Dash 0' },
      { key: 'mainCharacterAtlas', frame: 'Dash 1' },
      { key: 'mainCharacterAtlas', frame: 'Dash 2' },
      { key: 'mainCharacterAtlas', frame: 'Dash 3' },
      { key: 'mainCharacterAtlas', frame: 'Dash 4' },
      { key: 'mainCharacterAtlas', frame: 'Dash 5' }
    ],
    frameRate: 20,
    repeat: 0
  });

  scene.anims.create({
    key: 'slash_1',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Slash 1 0' },
      { key: 'mainCharacterAtlas', frame: 'Slash 1 1' },
      { key: 'mainCharacterAtlas', frame: 'Slash 1 2' },
      { key: 'mainCharacterAtlas', frame: 'Slash 1 3' },
      { key: 'mainCharacterAtlas', frame: 'Slash 1 4' },
      { key: 'mainCharacterAtlas', frame: 'Slash 1 5' },
      { key: 'mainCharacterAtlas', frame: 'Slash 1 6' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  });

  scene.anims.create({
    key: 'slash_2',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Slash 2 0' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 1' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 2' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 3' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 4' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 15,
    repeat: 0
  });

  scene.anims.create({
    key: 'slash_heavy',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Dash 1' },
      { key: 'mainCharacterAtlas', frame: 'Dash 2' },
      { key: 'mainCharacterAtlas', frame: 'Dash 3' },

      // { key: 'mainCharacterAtlas', frame: 'Slash 2 0' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 1' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 2' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 3' },
      { key: 'mainCharacterAtlas', frame: 'Slash 2 4' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 15,
    repeat: 0
  });

  scene.anims.create({
    key: 'spin_attack',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Block 0' },
      { key: 'mainCharacterAtlas', frame: 'Block 1' },
      { key: 'mainCharacterAtlas', frame: 'Spin Attack 0' },
      { key: 'mainCharacterAtlas', frame: 'Spin Attack 1' },
      { key: 'mainCharacterAtlas', frame: 'Spin Attack 2' },
      { key: 'mainCharacterAtlas', frame: 'Spin Attack 3' },
      { key: 'mainCharacterAtlas', frame: 'Spin Attack 4' },
      { key: 'mainCharacterAtlas', frame: 'Spin Attack 5' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  });

  scene.anims.create({
    key: 'slam_attack',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Slam 0' },
      { key: 'mainCharacterAtlas', frame: 'Slam 1' },
      { key: 'mainCharacterAtlas', frame: 'Slam 2' },
      { key: 'mainCharacterAtlas', frame: 'Slam 3' },
      { key: 'mainCharacterAtlas', frame: 'Slam 4' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  });

  scene.anims.create({
    key: 'roll_attack',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 0' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 1' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 2' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 3' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 4' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 5' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 6' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 7' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 8' },
      { key: 'mainCharacterAtlas', frame: 'Roll Attack 9' }
    ],
    frameRate: 7,
    repeat: 0
  });

  scene.anims.create({
    key: 'block',
    frames: [
      { key: 'mainCharacterAtlas', frame: 'Block 0' },
      { key: 'mainCharacterAtlas', frame: 'Block 1' },
      { key: 'mainCharacterAtlas', frame: 'Block 2' },
      { key: 'mainCharacterAtlas', frame: 'Block 3' },
      { key: 'mainCharacterAtlas', frame: 'Block 4' },
      { key: 'mainCharacterAtlas', frame: 'Block 5' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 20,
    repeat: 0
  });
}

export function addPlayerAnimationListeners(_this: Player) {
  _this.player.on('animationcomplete', (animation: Phaser.Animations.Animation) => {

    if (isActionAnimations(animation.key)) {
      _this.player.play('idle');
    }
  });
}

export function isActionAnimations(animKey?: string): boolean {
  return animKey === 'slash_1' ||
    animKey === 'slash_2' ||
    animKey === 'slam_attack' ||
    animKey === 'dash' ||
    animKey === 'spin_attack' ||
    animKey === 'roll_attack' ||
    animKey === 'slash_heavy' ||
    animKey === 'block'
}

export function isHighPriorityAnimation(animKey?: string): boolean {
  return animKey === 'land' ||
    animKey === 'slash_1' ||
    animKey === 'slash_2' ||
    animKey === 'slam_attack' ||
    animKey === 'dash' ||
    animKey === 'spin_attack' ||
    animKey === 'roll_attack' ||
    animKey === 'slash_heavy' ||
    animKey === 'block'
}
