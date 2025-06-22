import { Scene } from 'phaser';
import { Player } from '.';

export function createPlayerAnimations(scene: Scene) {
  scene.anims.create({
    key: 'player_idle',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Idle 0' },
      { key: 'swordMasterAtlas', frame: 'Idle 1' },
      { key: 'swordMasterAtlas', frame: 'Idle 2' },
      { key: 'swordMasterAtlas', frame: 'Idle 3' },
      { key: 'swordMasterAtlas', frame: 'Idle 4' },
      { key: 'swordMasterAtlas', frame: 'Idle 5' },
      { key: 'swordMasterAtlas', frame: 'Idle 6' },
      { key: 'swordMasterAtlas', frame: 'Idle 7' },
      { key: 'swordMasterAtlas', frame: 'Idle 8' }
    ],
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'player_walk',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Run 1' },
      { key: 'swordMasterAtlas', frame: 'Run 2' },
      { key: 'swordMasterAtlas', frame: 'Run 3' },
      { key: 'swordMasterAtlas', frame: 'Run 4' },
      { key: 'swordMasterAtlas', frame: 'Run 5' },
      { key: 'swordMasterAtlas', frame: 'Run 6' },
      { key: 'swordMasterAtlas', frame: 'Run 7' }
    ],
    frameRate: 12,
    repeat: -1
  });

  scene.anims.create({
    key: 'player_run',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Run Fast 0' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 1' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 2' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 3' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 4' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 5' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 6' },
      { key: 'swordMasterAtlas', frame: 'Run Fast 7' }
    ],
    frameRate: 15,
    repeat: -1
  });

  scene.anims.create({
    key: 'player_jump',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Jump 0' },
      { key: 'swordMasterAtlas', frame: 'Jump 1' },
      { key: 'swordMasterAtlas', frame: 'Jump 2' }
    ],
    frameRate: 10,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_fall',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Fall 0' },
      { key: 'swordMasterAtlas', frame: 'Fall 1' },
      { key: 'swordMasterAtlas', frame: 'Fall 2' }
    ],
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'player_land',
    frames: [
      { key: 'swordMasterAtlas', frame: 'crouch land 0' },
      { key: 'swordMasterAtlas', frame: 'crouch land 1' },
      { key: 'swordMasterAtlas', frame: 'crouch land 2' },
      { key: 'swordMasterAtlas', frame: 'crouch land 3' }
    ],
    frameRate: 12,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_dash',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Dash 0' },
      { key: 'swordMasterAtlas', frame: 'Dash 1' },
      { key: 'swordMasterAtlas', frame: 'Dash 2' },
      { key: 'swordMasterAtlas', frame: 'Dash 3' },
      { key: 'swordMasterAtlas', frame: 'Dash 4' },
      { key: 'swordMasterAtlas', frame: 'Dash 5' }
    ],
    frameRate: 20,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_slash_1',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Slash 1 0' },
      { key: 'swordMasterAtlas', frame: 'Slash 1 1' },
      { key: 'swordMasterAtlas', frame: 'Slash 1 2' },
      { key: 'swordMasterAtlas', frame: 'Slash 1 3' },
      { key: 'swordMasterAtlas', frame: 'Slash 1 4' },
      { key: 'swordMasterAtlas', frame: 'Slash 1 5' },
      { key: 'swordMasterAtlas', frame: 'Slash 1 6' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_slash_2',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Slash 2 0' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 1' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 2' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 3' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 4' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 15,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_slash_heavy',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Dash 1' },
      { key: 'swordMasterAtlas', frame: 'Dash 2' },
      { key: 'swordMasterAtlas', frame: 'Dash 3' },

      // { key: 'swordMasterAtlas', frame: 'Slash 2 0' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 1' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 2' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 3' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 4' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 15,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_spin_attack',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Block 0' },
      { key: 'swordMasterAtlas', frame: 'Block 1' },
      { key: 'swordMasterAtlas', frame: 'Spin Attack 0' },
      { key: 'swordMasterAtlas', frame: 'Spin Attack 1' },
      { key: 'swordMasterAtlas', frame: 'Spin Attack 2' },
      { key: 'swordMasterAtlas', frame: 'Spin Attack 3' },
      { key: 'swordMasterAtlas', frame: 'Spin Attack 4' },
      { key: 'swordMasterAtlas', frame: 'Spin Attack 5' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_slam_attack',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Slam 0' },
      { key: 'swordMasterAtlas', frame: 'Slam 1' },
      { key: 'swordMasterAtlas', frame: 'Slam 2' },
      { key: 'swordMasterAtlas', frame: 'Slam 3' },
      { key: 'swordMasterAtlas', frame: 'Slam 4' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_roll_attack',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Roll Attack 0' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 1' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 2' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 3' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 4' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 5' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 6' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 7' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 8' },
      { key: 'swordMasterAtlas', frame: 'Roll Attack 9' }
    ],
    frameRate: 7,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_block',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Block 0' },
      { key: 'swordMasterAtlas', frame: 'Block 1' },
      { key: 'swordMasterAtlas', frame: 'Block 2' },
      { key: 'swordMasterAtlas', frame: 'Block 3' },
      { key: 'swordMasterAtlas', frame: 'Block 4' },
      { key: 'swordMasterAtlas', frame: 'Block 5' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 20,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_hit',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Hit 0' },
      { key: 'swordMasterAtlas', frame: 'Hit 1' }
    ],
    frameRate: 12,
    repeat: 0
  });

  scene.anims.create({
    key: 'player_death',
    frames: [
      { key: 'swordMasterAtlas', frame: 'death 0' },
      { key: 'swordMasterAtlas', frame: 'death 1' },
      { key: 'swordMasterAtlas', frame: 'death 2' },
      { key: 'swordMasterAtlas', frame: 'death 3' },
      { key: 'swordMasterAtlas', frame: 'death 4' },
      { key: 'swordMasterAtlas', frame: 'death 5' }
    ],
    frameRate: 8,
    repeat: 0
  });
}

export function addPlayerAnimationListeners(_this: Player) {
  _this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {

    if (isActionAnimations(animation.key) && animation.key !== 'player_death') {
      _this.sprite.play('player_idle');
    } else if (animation.key === 'player_death') {
      // Stop the animation on the last frame
      _this.sprite.anims.stop();
    }
  });
}

export function isActionAnimations(animKey?: string): boolean {
  return animKey === 'player_slash_1' ||
    animKey === 'player_slash_2' ||
    animKey === 'player_slam_attack' ||
    animKey === 'player_dash' ||
    animKey === 'player_spin_attack' ||
    animKey === 'player_roll_attack' ||
    animKey === 'player_slash_heavy' ||
    animKey === 'player_land' ||
    animKey === 'player_block' ||
    animKey === 'player_hit' ||
    animKey === 'player_death'
}

export function isHighPriorityAnimation(animKey?: string): boolean {
  return animKey === 'player_land' ||
    animKey === 'player_slash_1' ||
    animKey === 'player_slash_2' ||
    animKey === 'player_slam_attack' ||
    animKey === 'player_dash' ||
    animKey === 'player_spin_attack' ||
    animKey === 'player_roll_attack' ||
    animKey === 'player_slash_heavy' ||
    animKey === 'player_block' ||
    animKey === 'player_hit' ||
    animKey === 'player_death'
}
