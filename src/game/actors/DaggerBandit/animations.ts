import { Animation } from '../../components/AnimationHelper';

export function getDaggerBanditAnimationConfigs(uniqueId: string): Animation[] {
  return [
    {
      key: `${uniqueId}_dagger_bandit_idle`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Idle 0' },
        { key: 'daggerBanditAtlas', frame: 'Idle 1' },
        { key: 'daggerBanditAtlas', frame: 'Idle 2' },
        { key: 'daggerBanditAtlas', frame: 'Idle 3' },
        { key: 'daggerBanditAtlas', frame: 'Idle 4' },
        { key: 'daggerBanditAtlas', frame: 'Idle 5' },
        { key: 'daggerBanditAtlas', frame: 'Idle 6' },
        { key: 'daggerBanditAtlas', frame: 'Idle 7' }
      ],
      frameRate: 8,
      repeat: -1
    },
    {
      key: `${uniqueId}_dagger_bandit_run`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Run 0' },
        { key: 'daggerBanditAtlas', frame: 'Run 1' },
        { key: 'daggerBanditAtlas', frame: 'Run 2' },
        { key: 'daggerBanditAtlas', frame: 'Run 3' },
        { key: 'daggerBanditAtlas', frame: 'Run 4' },
        { key: 'daggerBanditAtlas', frame: 'Run 5' },
        { key: 'daggerBanditAtlas', frame: 'Run 6' },
        { key: 'daggerBanditAtlas', frame: 'Run 7' }
      ],
      frameRate: 12,
      repeat: -1
    },
    {
      key: `${uniqueId}_dagger_bandit_jump`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Jump' }
      ],
      frameRate: 10,
      repeat: 0
    },
    {
      key: `${uniqueId}_dagger_bandit_fall`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Fall' }
      ],
      frameRate: 8,
      repeat: -1
    },
    {
      key: `${uniqueId}_dagger_bandit_attack`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Attack 0' },
        { key: 'daggerBanditAtlas', frame: 'Attack 1' },
        { key: 'daggerBanditAtlas', frame: 'Attack 2' },
        { key: 'daggerBanditAtlas', frame: 'Attack 3' },
        { key: 'daggerBanditAtlas', frame: 'Attack 4' },
        { key: 'daggerBanditAtlas', frame: 'Attack 5' },
        { key: 'daggerBanditAtlas', frame: 'Attack 6' }
      ],
      frameRate: 15,
      repeat: 0
    },
    {
      key: `${uniqueId}_dagger_bandit_bat_fang_attack`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 0' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 1' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 2' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 3' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 4' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 5' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 6' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 7' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 8' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 9' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 10' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 11' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 12' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 13' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 14' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 15' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 16' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 17' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 18' },
        { key: 'daggerBanditAtlas', frame: 'Bat Fang Attack 19' }
      ],
      frameRate: 20,
      repeat: 0
    },
    {
      key: `${uniqueId}_dagger_bandit_vanish`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Vanish 0' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 1' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 2' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 3' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 4' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 5' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 6' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 7' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 8' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 9' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 10' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 11' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 12' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 13' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 14' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 15' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 16' },
        { key: 'daggerBanditAtlas', frame: 'Vanish 17' }
      ],
      frameRate: 18,
      repeat: 0
    },
    {
      key: `${uniqueId}_dagger_bandit_appear`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Appear 0' },
        { key: 'daggerBanditAtlas', frame: 'Appear 1' },
        { key: 'daggerBanditAtlas', frame: 'Appear 2' },
        { key: 'daggerBanditAtlas', frame: 'Appear 3' },
        { key: 'daggerBanditAtlas', frame: 'Appear 4' },
        { key: 'daggerBanditAtlas', frame: 'Appear 5' },
        { key: 'daggerBanditAtlas', frame: 'Appear 6' },
        { key: 'daggerBanditAtlas', frame: 'Appear 7' },
        { key: 'daggerBanditAtlas', frame: 'Appear 8' },
        { key: 'daggerBanditAtlas', frame: 'Appear 9' },
        { key: 'daggerBanditAtlas', frame: 'Appear 10' },
        { key: 'daggerBanditAtlas', frame: 'Appear 11' },
        { key: 'daggerBanditAtlas', frame: 'Appear 12' },
        { key: 'daggerBanditAtlas', frame: 'Appear 13' },
        { key: 'daggerBanditAtlas', frame: 'Appear 14' },
        { key: 'daggerBanditAtlas', frame: 'Appear 15' }
      ],
      frameRate: 18,
      repeat: 0
    },
    {
      key: `${uniqueId}_dagger_bandit_death`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'Death 0' },
        { key: 'daggerBanditAtlas', frame: 'Death 1' },
        { key: 'daggerBanditAtlas', frame: 'Death 2' },
        { key: 'daggerBanditAtlas', frame: 'Death 3' },
        { key: 'daggerBanditAtlas', frame: 'Death 4' },
        { key: 'daggerBanditAtlas', frame: 'Death 5' },
        { key: 'daggerBanditAtlas', frame: 'Death 6' },
        { key: 'daggerBanditAtlas', frame: 'Death 7' },
        { key: 'daggerBanditAtlas', frame: 'Death 8' },
        { key: 'daggerBanditAtlas', frame: 'Death 9' },
        { key: 'daggerBanditAtlas', frame: 'Death 10' },
        { key: 'daggerBanditAtlas', frame: 'Death 11' },
        { key: 'daggerBanditAtlas', frame: 'Death 12' },
        { key: 'daggerBanditAtlas', frame: 'Death 13' },
        { key: 'daggerBanditAtlas', frame: 'Death 14' },
        { key: 'daggerBanditAtlas', frame: 'Death 15' }
      ],
      frameRate: 12,
      repeat: 0
    },
    {
      key: `${uniqueId}_dagger_bandit_hit`,
      frames: [
        { key: 'daggerBanditAtlas', frame: 'HIT 0' },
        { key: 'daggerBanditAtlas', frame: 'HIT 1' }
      ],
      frameRate: 12,
      repeat: 0
    }
  ];
}
