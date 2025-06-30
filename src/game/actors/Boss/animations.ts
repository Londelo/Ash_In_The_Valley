import { Animation } from '../../components/AnimationHelper';

export function getBossAnimationConfigs(): Animation[] {
  return [
    {
      key: 'boss_idle',
      frames: [
        { key: 'bossAtlas', frame: 'Idle 0' },
        { key: 'bossAtlas', frame: 'Idle 1' },
        { key: 'bossAtlas', frame: 'Idle 2' },
        { key: 'bossAtlas', frame: 'Idle 3' },
        { key: 'bossAtlas', frame: 'Idle 4' },
        { key: 'bossAtlas', frame: 'Idle 5' },
        { key: 'bossAtlas', frame: 'Idle 6' },
        { key: 'bossAtlas', frame: 'Idle 7' },
        { key: 'bossAtlas', frame: 'Idle 8' }
      ],
      frameRate: 8,
      repeat: -1
    },
    {
      key: 'boss_move',
      frames: [
        { key: 'bossAtlas', frame: 'Move 0' },
        { key: 'bossAtlas', frame: 'Move 1' },
        { key: 'bossAtlas', frame: 'Move 2' },
        { key: 'bossAtlas', frame: 'Move 3' },
        { key: 'bossAtlas', frame: 'Move 4' },
        { key: 'bossAtlas', frame: 'Move 5' },
        { key: 'bossAtlas', frame: 'Move 6' },
        { key: 'bossAtlas', frame: 'Move 7' }
      ],
      frameRate: 10,
      repeat: -1
    },
    {
      key: 'boss_attack_1',
      frames: [
        { key: 'bossAtlas', frame: 'attack_1 0' },
        { key: 'bossAtlas', frame: 'attack_1 1' },
        { key: 'bossAtlas', frame: 'attack_1 2' },
        { key: 'bossAtlas', frame: 'attack_1 3' },
        { key: 'bossAtlas', frame: 'attack_1 4' },
        { key: 'bossAtlas', frame: 'attack_1 5' },
        { key: 'bossAtlas', frame: 'attack_1 6' },
        { key: 'bossAtlas', frame: 'attack_1 7' },
        { key: 'bossAtlas', frame: 'attack_1 8' }
      ],
      frameRate: 12,
      repeat: 0
    },
    {
      key: 'boss_prep_attack_1',
      frames: [
        { key: 'bossAtlas', frame: 'prep_attack_1 0' },
        { key: 'bossAtlas', frame: 'prep_attack_1 1' },
        { key: 'bossAtlas', frame: 'prep_attack_1 2' },
        { key: 'bossAtlas', frame: 'prep_attack_1 3' },
        { key: 'bossAtlas', frame: 'prep_attack_1 4' },
        { key: 'bossAtlas', frame: 'prep_attack_1 5' },
        { key: 'bossAtlas', frame: 'prep_attack_1 6' },
        { key: 'bossAtlas', frame: 'prep_attack_1 7' },
        { key: 'bossAtlas', frame: 'prep_attack_1 8' }
      ],
      frameRate: 8,
      repeat: 0
    },
    {
      key: 'boss_attack_2',
      frames: [
        { key: 'bossAtlas', frame: 'attack_2 0' },
        { key: 'bossAtlas', frame: 'attack_2 1' },
        { key: 'bossAtlas', frame: 'attack_2 2' },
        { key: 'bossAtlas', frame: 'attack_2 3' },
        { key: 'bossAtlas', frame: 'attack_2 4' },
        { key: 'bossAtlas', frame: 'attack_2 5' },
        { key: 'bossAtlas', frame: 'attack_2 6' },
        { key: 'bossAtlas', frame: 'attack_2 7' },
        { key: 'bossAtlas', frame: 'attack_2 8' },
        { key: 'bossAtlas', frame: 'attack_2 9' },
        { key: 'bossAtlas', frame: 'attack_2 10' },
        { key: 'bossAtlas', frame: 'attack_2 11' },
        { key: 'bossAtlas', frame: 'attack_2 12' },
        { key: 'bossAtlas', frame: 'attack_2 13' },
        { key: 'bossAtlas', frame: 'attack_2 14' },
        { key: 'bossAtlas', frame: 'attack_2 15' }
      ],
      frameRate: 15,
      repeat: 0
    },
    {
      key: 'boss_attack_2_prep',
      frames: [
        { key: 'bossAtlas', frame: 'attack_2_prep 0' },
        { key: 'bossAtlas', frame: 'attack_2_prep 1' },
        { key: 'bossAtlas', frame: 'attack_2_prep 2' },
        { key: 'bossAtlas', frame: 'attack_2_prep 3' },
        { key: 'bossAtlas', frame: 'attack_2_prep 4' },
        { key: 'bossAtlas', frame: 'attack_2_prep 5' },
        { key: 'bossAtlas', frame: 'attack_2_prep 6' },
        { key: 'bossAtlas', frame: 'attack_2_prep 7' }
      ],
      frameRate: 10,
      repeat: 0
    },
    {
      key: 'boss_attack_2_end',
      frames: [
        { key: 'bossAtlas', frame: 'attack_2_end 0' },
        { key: 'bossAtlas', frame: 'attack_2_end 1' },
        { key: 'bossAtlas', frame: 'attack_2_end 2' },
        { key: 'bossAtlas', frame: 'attack_2_end 3' }
      ],
      frameRate: 8,
      repeat: 0
    },
    {
      key: 'boss_vanish',
      frames: [
        { key: 'bossAtlas', frame: 'Vanish 0' },
        { key: 'bossAtlas', frame: 'Vanish 1' },
        { key: 'bossAtlas', frame: 'Vanish 2' },
        { key: 'bossAtlas', frame: 'Vanish 3' },
        { key: 'bossAtlas', frame: 'Vanish 4' },
        { key: 'bossAtlas', frame: 'Vanish 5' },
        { key: 'bossAtlas', frame: 'Vanish 6' },
        { key: 'bossAtlas', frame: 'Vanish 7' },
        { key: 'bossAtlas', frame: 'Vanish 8' },
        { key: 'bossAtlas', frame: 'Vanish 9' }
      ],
      frameRate: 12,
      repeat: 0
    },
    {
      key: 'boss_appear',
      frames: [
        { key: 'bossAtlas', frame: 'Appear 0' },
        { key: 'bossAtlas', frame: 'Appear 1' },
        { key: 'bossAtlas', frame: 'Appear 2' },
        { key: 'bossAtlas', frame: 'Appear 3' },
        { key: 'bossAtlas', frame: 'Appear 4' },
        { key: 'bossAtlas', frame: 'Appear 5' },
        { key: 'bossAtlas', frame: 'Appear 6' },
        { key: 'bossAtlas', frame: 'Appear 7' },
        { key: 'bossAtlas', frame: 'Appear 8' }
      ],
      frameRate: 12,
      repeat: 0
    },
    {
      key: 'boss_hit',
      frames: [
        { key: 'bossAtlas', frame: 'Hit 0' },
        { key: 'bossAtlas', frame: 'Hit 1' }
      ],
      frameRate: 12,
      repeat: 0
    },
    {
      key: 'boss_death',
      frames: [
        { key: 'bossAtlas', frame: 'Death 0' },
        { key: 'bossAtlas', frame: 'Death 1' },
        { key: 'bossAtlas', frame: 'Death 2' },
        { key: 'bossAtlas', frame: 'Death 3' },
        { key: 'bossAtlas', frame: 'Death 4' },
        { key: 'bossAtlas', frame: 'Death 5' },
        { key: 'bossAtlas', frame: 'Death 6' },
        { key: 'bossAtlas', frame: 'Death 7' },
        { key: 'bossAtlas', frame: 'Death 8' },
        { key: 'bossAtlas', frame: 'Death 9' },
        { key: 'bossAtlas', frame: 'Death 10' },
        { key: 'bossAtlas', frame: 'Death 11' },
        { key: 'bossAtlas', frame: 'Death 12' },
        { key: 'bossAtlas', frame: 'Death 13' },
        { key: 'bossAtlas', frame: 'Death 14' },
        { key: 'bossAtlas', frame: 'Death 15' },
        { key: 'bossAtlas', frame: 'Death 16' },
        { key: 'bossAtlas', frame: 'Death 17' },
        { key: 'bossAtlas', frame: 'Death 18' },
        { key: 'bossAtlas', frame: 'Death 19' },
        { key: 'bossAtlas', frame: 'Death 20' },
        { key: 'bossAtlas', frame: 'Death 21' },
        { key: 'bossAtlas', frame: 'Death 22' },
        { key: 'bossAtlas', frame: 'Death 23' },
        { key: 'bossAtlas', frame: 'Death 24' },
        { key: 'bossAtlas', frame: 'Death 25' },
        { key: 'bossAtlas', frame: 'Death 26' },
        { key: 'bossAtlas', frame: 'Death 27' },
        { key: 'bossAtlas', frame: 'Death 28' },
        { key: 'bossAtlas', frame: 'Death 29' },
        { key: 'bossAtlas', frame: 'Death 30' },
        { key: 'bossAtlas', frame: 'Death 31' },
        { key: 'bossAtlas', frame: 'Death 32' },
        { key: 'bossAtlas', frame: 'Death 33' },
        { key: 'bossAtlas', frame: 'Death 34' },
        { key: 'bossAtlas', frame: 'Death 35' }
      ],
      frameRate: 10,
      repeat: 0
    }
  ];
}