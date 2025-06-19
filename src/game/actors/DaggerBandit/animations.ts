import { Scene } from 'phaser';
import { DaggerBandit } from '.';

export function createDaggerBanditAnimations(scene: Scene) {
  // Idle animation
  scene.anims.create({
    key: 'bandit_idle',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 6.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Idle 7.aseprite' }
    ],
    frameRate: 8,
    repeat: -1
  });

  // Run animation
  scene.anims.create({
    key: 'bandit_run',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 6.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Run 7.aseprite' }
    ],
    frameRate: 12,
    repeat: -1
  });

  // Jump animation
  scene.anims.create({
    key: 'bandit_jump',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Jump.aseprite' }
    ],
    frameRate: 10,
    repeat: 0
  });

  // Fall animation
  scene.anims.create({
    key: 'bandit_fall',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Fall.aseprite' }
    ],
    frameRate: 8,
    repeat: -1
  });

  // Basic attack animation
  scene.anims.create({
    key: 'bandit_attack',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Attack 6.aseprite' }
    ],
    frameRate: 15,
    repeat: 0
  });

  // Bat Fang Attack animation (special attack)
  scene.anims.create({
    key: 'bandit_bat_fang_attack',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 6.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 7.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 8.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 9.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 10.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 11.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 12.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 13.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 14.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 15.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 16.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 17.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 18.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Bat Fang Attack 19.aseprite' }
    ],
    frameRate: 20,
    repeat: 0
  });

  // Vanish animation
  scene.anims.create({
    key: 'bandit_vanish',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 6.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 7.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 8.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 9.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 10.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 11.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 12.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 13.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 14.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 15.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 16.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Vanish 17.aseprite' }
    ],
    frameRate: 18,
    repeat: 0
  });

  // Appear animation
  scene.anims.create({
    key: 'bandit_appear',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 6.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 7.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 8.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 9.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 10.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 11.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 12.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 13.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 14.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Appear 15.aseprite' }
    ],
    frameRate: 18,
    repeat: 0
  });

  // Death animation
  scene.anims.create({
    key: 'bandit_death',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 1.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 2.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 3.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 4.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 5.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 6.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 7.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 8.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 9.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 10.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 11.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 12.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 13.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 14.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #Death 15.aseprite' }
    ],
    frameRate: 12,
    repeat: 0
  });

  // Hit animation
  scene.anims.create({
    key: 'bandit_hit',
    frames: [
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #HIT 0.aseprite' },
      { key: 'daggerBanditAtlas', frame: 'Dagger Bandit #HIT 1.aseprite' }
    ],
    frameRate: 12,
    repeat: 0
  });
}

export function addDaggerBanditAnimationListeners(_this: DaggerBandit) {
  _this.sprite.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
    if (isActionAnimations(animation.key) && animation.key !== 'bandit_death') {
      _this.sprite.play('bandit_idle');
    } else if (animation.key === 'bandit_death') {
      // Stop the animation on the last frame
      _this.sprite.anims.stop();
    } else if (animation.key === 'bandit_vanish') {
      _this.onVanishComplete();
    } else if (animation.key === 'bandit_appear') {
      _this.onAppearComplete();
    }
  });
}

export function isActionAnimations(animKey?: string): boolean {
  return animKey === 'bandit_attack' ||
    animKey === 'bandit_bat_fang_attack' ||
    animKey === 'bandit_hit';
}

export function isHighPriorityAnimation(animKey?: string): boolean {
  return animKey === 'bandit_attack' ||
    animKey === 'bandit_bat_fang_attack' ||
    animKey === 'bandit_vanish' ||
    animKey === 'bandit_appear' ||
    animKey === 'bandit_death' ||
    animKey === 'bandit_hit';
}
