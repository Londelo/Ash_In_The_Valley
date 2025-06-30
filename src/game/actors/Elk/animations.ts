import { Animation } from '../../components/AnimationHelper';
import { ElkSkins } from './actorConfigs';

export const elkAnimationConfigs: Animation[] = [
  {
    key: 'elk_eat',
    frames: [
      { key: 'elkAtlas', frame: 'Eat 0' },
      { key: 'elkAtlas', frame: 'Eat 1' },
      { key: 'elkAtlas', frame: 'Eat 2' },
      { key: 'elkAtlas', frame: 'Eat 3' },
      { key: 'elkAtlas', frame: 'Eat 4' },
      { key: 'elkAtlas', frame: 'Eat 5' }
    ],
    frameRate: 6,
    repeat: -1
  },
  {
    key: 'elk_look_up',
    frames: [
      { key: 'elkAtlas', frame: 'look up 0' },
      { key: 'elkAtlas', frame: 'look up 1' },
      { key: 'elkAtlas', frame: 'look up 2' },
      { key: 'elkAtlas', frame: 'look up 3' },
      { key: 'elkAtlas', frame: 'look up 4' },
      { key: 'elkAtlas', frame: 'look up 5' },
      { key: 'elkAtlas', frame: 'look up 6' },
      { key: 'elkAtlas', frame: 'look up 7' },
      { key: 'elkAtlas', frame: 'look up 8' },
      { key: 'elkAtlas', frame: 'look up 9' },
      { key: 'elkAtlas', frame: 'look up 10' },
      { key: 'elkAtlas', frame: 'look up 11' },
      { key: 'elkAtlas', frame: 'look up 12' },
      { key: 'elkAtlas', frame: 'look up 13' },
      { key: 'elkAtlas', frame: 'look up 14' },
      { key: 'elkAtlas', frame: 'look up 15' },
      { key: 'elkAtlas', frame: 'look up 16' },
      { key: 'elkAtlas', frame: 'look up 17' },
      { key: 'elkAtlas', frame: 'look up 18' }
    ],
    frameRate: 8,
    repeat: 0
  },
  {
    key: 'elk_walk',
    frames: [
      { key: 'elkAtlas', frame: 'Walk 0' },
      { key: 'elkAtlas', frame: 'Walk 1' },
      { key: 'elkAtlas', frame: 'Walk 2' },
      { key: 'elkAtlas', frame: 'Walk 3' },
      { key: 'elkAtlas', frame: 'Walk 4' },
      { key: 'elkAtlas', frame: 'Walk 5' },
      { key: 'elkAtlas', frame: 'Walk 6' },
      { key: 'elkAtlas', frame: 'Walk 7' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'elk_death',
    frames: [
      { key: 'elkAtlas', frame: 'death 0' },
      { key: 'elkAtlas', frame: 'death 1' },
      { key: 'elkAtlas', frame: 'death 2' },
      { key: 'elkAtlas', frame: 'death 3' },
      { key: 'elkAtlas', frame: 'death 4' },
      { key: 'elkAtlas', frame: 'death 5' },
      { key: 'elkAtlas', frame: 'death 6' },
      { key: 'elkAtlas', frame: 'death 7' },
      { key: 'elkAtlas', frame: 'death 8' },
      { key: 'elkAtlas', frame: 'death 9' },
      { key: 'elkAtlas', frame: 'death 10' },
      { key: 'elkAtlas', frame: 'death 11' },
      { key: 'elkAtlas', frame: 'death 12' },
      { key: 'elkAtlas', frame: 'death 13' }
    ],
    frameRate: 8,
    repeat: 0
  }
];

export const getAllElkAnimationConfigs = (): Animation[] => {
  return [
    ...elkAnimationConfigs
  ];
};

export const getElkAnimationConfig = (elkSkin: ElkSkins) => {
  const animationConfigs: { [K in ElkSkins]?: Animation[] } = {
    elk: elkAnimationConfigs,
  };
  return animationConfigs[elkSkin];
};
