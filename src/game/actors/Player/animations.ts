import { Animation } from '../../components/AnimationHelper';
import { PlayerSkins } from '.';

export const swordsMasterAnimationConfigs: Animation[] = [
  {
    key: 'swordMaster_player_idle',
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
    key: 'swordMaster_player_walk',
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
    key: 'swordMaster_player_run',
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
    key: 'swordMaster_player_jump',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Jump 0' },
      { key: 'swordMasterAtlas', frame: 'Jump 1' },
      { key: 'swordMasterAtlas', frame: 'Jump 2' }
    ],
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'swordMaster_player_fall',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Fall 0' },
      { key: 'swordMasterAtlas', frame: 'Fall 1' },
      { key: 'swordMasterAtlas', frame: 'Fall 2' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'swordMaster_player_land',
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
    key: 'swordMaster_player_dash',
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
    key: 'swordMaster_player_attack_1',
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
    key: 'swordMaster_player_attack_2',
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
    key: 'swordMaster_player_attack_3',
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
    key: 'swordMaster_player_slam_attack',
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
    key: 'swordMaster_player_hit',
    frames: [
      { key: 'swordMasterAtlas', frame: 'Hit 0' },
      { key: 'swordMasterAtlas', frame: 'Hit 1' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'swordMaster_player_death',
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
    key: 'bloodSwordsMan_player_idle',
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
    key: 'bloodSwordsMan_player_walk',
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
    key: 'bloodSwordsMan_player_run',
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
    key: 'bloodSwordsMan_player_jump',
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
    key: 'bloodSwordsMan_player_fall',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'jump to fall trans 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'jump to fall trans 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'fall 3' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {//TODO: handle landing
    key: 'bloodSwordsMan_player_land',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'land 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'land 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'land 2' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'bloodSwordsMan_player_dash',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 9' },
      { key: 'bloodSwordsmanAtlas', frame: 'death/blood teleport 10' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 1' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 2' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 3' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 4' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 5' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 6' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 7' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 8' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 9' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 10' },
      { key: 'bloodSwordsmanAtlas', frame: 'blood teleport 2 11' }
    ],
    frameRate: 20,
    repeat: 0
  },
  {
    key: 'bloodSwordsMan_player_attack_1',
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
    key: 'bloodSwordsMan_player_attack_2',
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
    key: 'bloodSwordsMan_player_attack_3',
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
    key: 'bloodSwordsMan_player_slam_attack',
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
    key: 'bloodSwordsMan_player_hit',
    frames: [
      { key: 'bloodSwordsmanAtlas', frame: 'hit 0' },
      { key: 'bloodSwordsmanAtlas', frame: 'hit 1' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'bloodSwordsMan_player_death',
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

export const lordOfFlamesAnimationConfigs: Animation[] = [
  {
    key: 'lordOfFlames_player_idle',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Idle 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 2' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 5' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 6' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 7' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Idle 11' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'lordOfFlames_player_walk',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Move 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 2' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 5' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 6' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 7' }
    ],
    frameRate: 12,
    repeat: -1
  },
  {
    key: 'lordOfFlames_player_run',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Move 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 11' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 12' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 13' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 14' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 15' }
    ],
    frameRate: 15,
    repeat: -1
  },
  {
    key: 'lordOfFlames_player_jump',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Move 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 2' }
    ],
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_fall',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Move 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 5' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'lordOfFlames_player_land',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Move 6' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_dash',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Move 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 11' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 12' },
      { key: 'lordOfFlamesAtlas', frame: 'Move 13' }
    ],
    frameRate: 20,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_attack_1',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Attack 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 2' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 5' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 6' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 7' }
    ],
    delay: 0,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_attack_2',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Attack 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 11' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 12' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 13' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 14' },
      { key: 'lordOfFlamesAtlas', frame: 'Attack 15' }
    ],
    delay: 0,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_attack_3',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Spear 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 2' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 5' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 6' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 7' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 11' },
      { key: 'lordOfFlamesAtlas', frame: 'Spear 12' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_slam_attack',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 2' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 5' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 6' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 7' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 11' },
      { key: 'lordOfFlamesAtlas', frame: 'Chain Stab 12' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_block',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'BUff 10' },
      { key: 'lordOfFlamesAtlas', frame: 'BUff 11' },
      { key: 'lordOfFlamesAtlas', frame: 'BUff 12' },
      { key: 'lordOfFlamesAtlas', frame: 'BUff 13' },
      { key: 'lordOfFlamesAtlas', frame: 'BUff 14' },
      { key: 'lordOfFlamesAtlas', frame: 'BUff 15' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 20,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_hit',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Death 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 1' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'lordOfFlames_player_death',
    frames: [
      { key: 'lordOfFlamesAtlas', frame: 'Death 0' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 1' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 2' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 3' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 4' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 5' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 6' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 7' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 8' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 9' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 10' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 11' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 12' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 13' },
      { key: 'lordOfFlamesAtlas', frame: 'Death 14' }
    ],
    frameRate: 8,
    repeat: 0
  }
];

export const holySamuraiAnimationConfigs: Animation[] = [
  {
    key: 'holySamurai_player_idle',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Idle 0' },
      { key: 'holySamuraiAtlas', frame: 'Idle 1' },
      { key: 'holySamuraiAtlas', frame: 'Idle 2' },
      { key: 'holySamuraiAtlas', frame: 'Idle 3' },
      { key: 'holySamuraiAtlas', frame: 'Idle 4' },
      { key: 'holySamuraiAtlas', frame: 'Idle 5' },
      { key: 'holySamuraiAtlas', frame: 'Idle 6' },
      { key: 'holySamuraiAtlas', frame: 'Idle 7' },
      { key: 'holySamuraiAtlas', frame: 'Idle 8' },
      { key: 'holySamuraiAtlas', frame: 'Idle 9' },
      { key: 'holySamuraiAtlas', frame: 'Idle 10' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'holySamurai_player_walk',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Run 0' },
      { key: 'holySamuraiAtlas', frame: 'Run 1' },
      { key: 'holySamuraiAtlas', frame: 'Run 2' },
      { key: 'holySamuraiAtlas', frame: 'Run 3' },
      { key: 'holySamuraiAtlas', frame: 'Run 4' },
      { key: 'holySamuraiAtlas', frame: 'Run 5' },
      { key: 'holySamuraiAtlas', frame: 'Run 6' },
      { key: 'holySamuraiAtlas', frame: 'Run 7' }
    ],
    frameRate: 12,
    repeat: -1
  },
  {
    key: 'holySamurai_player_run',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Run 8' },
      { key: 'holySamuraiAtlas', frame: 'Run 9' },
      { key: 'holySamuraiAtlas', frame: 'Run 10' },
      { key: 'holySamuraiAtlas', frame: 'Run 11' },
      { key: 'holySamuraiAtlas', frame: 'Run 0' },
      { key: 'holySamuraiAtlas', frame: 'Run 1' },
      { key: 'holySamuraiAtlas', frame: 'Run 2' },
      { key: 'holySamuraiAtlas', frame: 'Run 3' }
    ],
    frameRate: 15,
    repeat: -1
  },
  {
    key: 'holySamurai_player_jump',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Jump 0' },
      { key: 'holySamuraiAtlas', frame: 'Jump 1' },
      { key: 'holySamuraiAtlas', frame: 'Jump 2' },
      { key: 'holySamuraiAtlas', frame: 'Jump 3' }
    ],
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'holySamurai_player_fall',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Fall 0' },
      { key: 'holySamuraiAtlas', frame: 'Fall 1' },
      { key: 'holySamuraiAtlas', frame: 'Fall 2' },
      { key: 'holySamuraiAtlas', frame: 'Fall 3' }
    ],
    frameRate: 8,
    repeat: -1
  },
  {
    key: 'holySamurai_player_land',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Land 0' },
      { key: 'holySamuraiAtlas', frame: 'Land 1' },
      { key: 'holySamuraiAtlas', frame: 'Land 2' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'holySamurai_player_dash',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Run 8' },
      { key: 'holySamuraiAtlas', frame: 'Run 9' },
      { key: 'holySamuraiAtlas', frame: 'Run 10' },
      { key: 'holySamuraiAtlas', frame: 'Run 11' },
      { key: 'holySamuraiAtlas', frame: 'Run 0' },
      { key: 'holySamuraiAtlas', frame: 'Run 1' }
    ],
    frameRate: 20,
    repeat: 0
  },
  {
    key: 'holySamurai_player_attack_1',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Slash 1 0' },
      { key: 'holySamuraiAtlas', frame: 'Slash 1 1' },
      { key: 'holySamuraiAtlas', frame: 'Slash 1 2' },
      { key: 'holySamuraiAtlas', frame: 'Slash 1 3' },
      { key: 'holySamuraiAtlas', frame: 'Slash 1 4' },
      { key: 'holySamuraiAtlas', frame: 'Slash 1 5' },
      { key: 'holySamuraiAtlas', frame: 'Slash 1 6' }
    ],
    delay: 0,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'holySamurai_player_attack_2',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Slash 2 0' },
      { key: 'holySamuraiAtlas', frame: 'Slash 2 1' },
      { key: 'holySamuraiAtlas', frame: 'Slash 2 2' },
      { key: 'holySamuraiAtlas', frame: 'Slash 2 3' },
      { key: 'holySamuraiAtlas', frame: 'Slash 2 4' }
    ],
    delay: 0,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'holySamurai_player_attack_3',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 0' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 1' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 2' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 3' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 4' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 5' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 6' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 7' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 8' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 9' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 10' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 11' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 12' }
    ],
    delay: 50,
    showBeforeDelay: true,
    frameRate: 10,
    repeat: 0
  },
  {
    key: 'holySamurai_player_slam_attack',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 13' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 14' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 15' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 16' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 17' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 18' },
      { key: 'holySamuraiAtlas', frame: 'Gltich Attack 19' }
    ],
    delay: 100,
    showBeforeDelay: true,
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'holySamurai_player_hit',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Death Frame 0' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 1' }
    ],
    frameRate: 12,
    repeat: 0
  },
  {
    key: 'holySamurai_player_death',
    frames: [
      { key: 'holySamuraiAtlas', frame: 'Death Frame 0' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 1' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 2' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 3' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 4' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 5' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 6' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 7' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 8' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 9' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 10' },
      { key: 'holySamuraiAtlas', frame: 'Death Frame 11' }
    ],
    frameRate: 8,
    repeat: 0
  }
];

const animationConfigs: { [K in PlayerSkins]?: Animation[] } = {
  'swordMaster': swordsMasterAnimationConfigs,
  'bloodSwordsMan': bloodSwordsmanAnimationConfigs,
  'lordOfFlames': lordOfFlamesAnimationConfigs,
  'holySamurai': holySamuraiAnimationConfigs
};

export const getAllAnimationConfigs = (): Animation[] => {
  return [
    ...swordsMasterAnimationConfigs,
    ...bloodSwordsmanAnimationConfigs,
    ...lordOfFlamesAnimationConfigs,
    ...holySamuraiAnimationConfigs
  ];
};

export const getAnimationConfig = (playerSkin: PlayerSkins) => animationConfigs[playerSkin]
