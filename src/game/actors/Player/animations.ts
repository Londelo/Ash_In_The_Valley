import { Animation } from '../../components/AnimationHelper';
import { PlayerSkins } from '.';

export const swordsMasterAnimationConfigs: Animation[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
    key: 'player_jump',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Jump 0' },
      { key: 'swordMasterAtlas', frame: 'Jump 1' },
      { key: 'swordMasterAtlas', frame: 'Jump 2' }
    ],
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'player_fall',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Fall 0' },
      { key: 'swordMasterAtlas', frame: 'Fall 1' },
      { key: 'swordMasterAtlas', frame: 'Fall 2' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'player_land',
    frames: [
      { key: 'swordMasterAtlas', frame: 'crouch land 0' },
      { key: 'swordMasterAtlas', frame: 'crouch land 1' },
      { key: 'swordMasterAtlas', frame: 'crouch land 2' },
      { key: 'swordMasterAtlas', frame: 'crouch land 3' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
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
  },
  {
    key: 'player_attack_1',
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
  },
  {
    key: 'player_attack_2',
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
  },
  {
    key: 'player_slash_heavy',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Dash 1' },
      { key: 'swordMasterAtlas', frame: 'Dash 2' },
      { key: 'swordMasterAtlas', frame: 'Dash 3' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 1' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 2' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 3' },
      { key: 'swordMasterAtlas', frame: 'Slash 2 4' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 15,
    repeat: 0
  },
  {
    key: 'player_attack_3',
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    key: 'player_hit',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Hit 0' },
      { key: 'swordMasterAtlas', frame: 'Hit 1' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
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
  }
];

export const bloodSwordsmanAnimationConfigs: Animation[] = [
  {
    key: 'player_idle',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'idle 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 9' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 10' },
      { key: 'bloodSwordsmanAtlas', frame: 'idle 11' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'player_walk',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'run 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 7' }
    ],
    frameRate: 12,
    repeat: -1
  },
  {
    key: 'player_run',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'run 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 7' }
    ],
    frameRate: 15,
    repeat: -1
  },
  {
    key: 'player_jump',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'jump 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'jump 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'jump 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'jump 3' }
    ],
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'player_fall',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'fall 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 3' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'player_land',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'fall 3' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'player_dash',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'run 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'run 5' }
    ],
    frameRate: 20,
    repeat: 0
  },
  {
    key: 'player_attack_1',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 7' }
    ],
    delay: 0,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'player_attack_2',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 9' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 10' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 11' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 12' },
      { key: 'bloodSwordsmanAtlas', frame: 'double slash 13' }

    ],
    delay: 0,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'player_slash_heavy',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'heart slam 6' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 15,
    repeat: 0
  },
  {
    key: 'player_attack_3',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 9' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 10' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 11' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 12' },
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'player_slam_attack',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 9' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 10' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 11' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3 12' },
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'player_roll_attack',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'attack 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'attack 9' }
    ],
    frameRate: 7,
    repeat: 0
  },
  {
    key: 'player_block',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'charge 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'charge 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'charge 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'charge 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'charge 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'charge 5' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 20,
    repeat: 0
  },
  {
    key: 'player_hit',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'hit 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'hit 1' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'player_death',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 5' }
    ],
    frameRate: 8,
    repeat: 0
  }
];

const animationConfigs: { [K in PlayerSkins]?: Animation[] } = {
  'swordMaster': swordsMasterAnimationConfigs,
  'bloodSwordsMan': bloodSwordsmanAnimationConfigs
};

export const getAnimationConfig = (playerSkin: PlayerSkins) => animationConfigs[playerSkin]
