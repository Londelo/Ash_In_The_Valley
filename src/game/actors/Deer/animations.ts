import { Animation } from '../../components/AnimationHelper';
import { DeerSkins } from './actorConfigs';

export const deerAnimationConfigs: Animation[] = [
  {
    key: 'deer_eat',
    frames: [
      { key: 'deerAtlas', frame: 'eat 0' },
      { key: 'deerAtlas', frame: 'eat 1' },
      { key: 'deerAtlas', frame: 'eat 2' },
      { key: 'deerAtlas', frame: 'eat 3' },
      { key: 'deerAtlas', frame: 'eat 4' },
      { key: 'deerAtlas', frame: 'eat 5' }
    ],
    frameRate: 6,
    repeat: -1
  },
  {
    key: 'deer_look_up',
    frames: [
      { key: 'deerAtlas', frame: 'Look up 0' },
      { key: 'deerAtlas', frame: 'Look up 1' },
      { key: 'deerAtlas', frame: 'Look up 2' },
      { key: 'deerAtlas', frame: 'Look up 3' },
      { key: 'deerAtlas', frame: 'Look up 4' },
      { key: 'deerAtlas', frame: 'Look up 5' },
      { key: 'deerAtlas', frame: 'Look up 6' },
      { key: 'deerAtlas', frame: 'Look up 7' },
      { key: 'deerAtlas', frame: 'Look up 8' },
      { key: 'deerAtlas', frame: 'Look up 9' },
      { key: 'deerAtlas', frame: 'Look up 10' },
      { key: 'deerAtlas', frame: 'Look up 11' },
      { key: 'deerAtlas', frame: 'Look up 12' },
      { key: 'deerAtlas', frame: 'Look up 13' },
      { key: 'deerAtlas', frame: 'Look up 14' }
    ],
    frameRate: 8,
    repeat: 0
  },
  {
    key: 'deer_walk',
    frames: [
      { key: 'deerAtlas', frame: 'walk 0' },
      { key: 'deerAtlas', frame: 'walk 1' },
      { key: 'deerAtlas', frame: 'walk 2' },
      { key: 'deerAtlas', frame: 'walk 3' },
      { key: 'deerAtlas', frame: 'walk 4' },
      { key: 'deerAtlas', frame: 'walk 5' },
      { key: 'deerAtlas', frame: 'walk 6' },
      { key: 'deerAtlas', frame: 'walk 7' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'deer_death',
    frames: [
      { key: 'deerAtlas', frame: 'death 0' },
      { key: 'deerAtlas', frame: 'death 1' },
      { key: 'deerAtlas', frame: 'death 2' },
      { key: 'deerAtlas', frame: 'death 3' },
      { key: 'deerAtlas', frame: 'death 4' },
      { key: 'deerAtlas', frame: 'death 5' },
      { key: 'deerAtlas', frame: 'death 6' },
      { key: 'deerAtlas', frame: 'death 7' },
      { key: 'deerAtlas', frame: 'death 8' },
      { key: 'deerAtlas', frame: 'death 9' },
      { key: 'deerAtlas', frame: 'death 10' },
      { key: 'deerAtlas', frame: 'death 11' },
      { key: 'deerAtlas', frame: 'death 12' },
      { key: 'deerAtlas', frame: 'death 13' }
    ],
    frameRate: 8,
    repeat: 0
  }
];

export const getAllDeerAnimationConfigs = (): Animation[] => {
  return [
    ...deerAnimationConfigs
  ];
};

export const getDeerAnimationConfig = (deerSkin: DeerSkins) => {
  const animationConfigs: { [K in DeerSkins]?: Animation[] } = {
    deer: deerAnimationConfigs
  };
  return animationConfigs[deerSkin];
};
