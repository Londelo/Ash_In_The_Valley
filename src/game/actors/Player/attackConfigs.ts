import { Player, PlayerSkins } from '.';
import { AttackHitboxConfig } from '../../components/AttackHitbox';

// Type alias for player attack config function
export type PlayerAttackConfigFn = (_this: Player) => { [key: string]: AttackHitboxConfig };

const swordsMasterAttackConfigs: PlayerAttackConfigFn =
  (_this: Player) => ({
    [`${_this.playerSkin}_player_attack_1`]: {
      width: 200,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: _this.attackPower,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_2`]: {
      width: 200,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: _this.attackPower,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_3`]: {
      width: 270,
      height: 70,
      offsetX_right: 45,
      offsetX_left: -45,
      offsetY: -35,
      duration: 400,
      damage: _this.attackPower * 1.5,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_slam_attack`]: {
      width: 220,
      height: 100,
      offsetX_right: 80,
      offsetX_left: -80,
      offsetY: -55,
      duration: 300,
      damage: _this.attackPower * 1.2,
      attackerId: 'player',
      delay: 0
    }
  });

const bloodSwordsManAttackConfigs: PlayerAttackConfigFn =
  (_this: Player) => ({
    [`${_this.playerSkin}_player_attack_1`]: {
      width: 150,
      height: 50,
      offsetX_right: 75,
      offsetX_left: -75,
      offsetY: -25,
      duration: 250,
      damage: _this.attackPower * 1.1,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_2`]: {
      width: 150,
      height: 60,
      offsetX_right: 85,
      offsetX_left: -85,
      offsetY: -30,
      duration: 300,
      damage: _this.attackPower * 1.3,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_3`]: {
      width: 220,
      height: 80,
      offsetX_right: 0,
      offsetX_left: -0,
      offsetY: -40,
      duration: 450,
      damage: _this.attackPower * 1.8,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_slam_attack`]: {
      width: 220,
      height: 80,
      offsetX_right: 0,
      offsetX_left: -0,
      offsetY: -40,
      duration: 450,
      damage: _this.attackPower * 1.8,
      attackerId: 'player',
      delay: 0
    }
  });

const lordOfFlamesAttackConfigs: PlayerAttackConfigFn =
  (_this: Player) => ({
    [`${_this.playerSkin}_player_attack_1`]: {
      width: 180,
      height: 60,
      offsetX_right: 55,
      offsetX_left: -55,
      offsetY: -30,
      duration: 400,
      damage: _this.attackPower * 0.9,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_2`]: {
      width: 200,
      height: 45,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -20,
      duration: 400,
      damage: _this.attackPower * 1.1,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_3`]: {
      width: 400,
      height: 60,
      offsetX_right: 150,
      offsetX_left: -150,
      offsetY: -40,
      duration: 800,
      damage: _this.attackPower * 1.6,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_slam_attack`]: {
      width: 250,
      height: 90,
      offsetX_right: 70,
      offsetX_left: -70,
      offsetY: -45,
      duration: 320,
      damage: _this.attackPower * 1.4,
      attackerId: 'player',
      delay: 0
    }
  });

const holySamuraiAttackConfigs: PlayerAttackConfigFn =
  (_this: Player) => ({
    [`${_this.playerSkin}_player_attack_1`]: {
      width: 220,
      height: 50,
      offsetX_right: 70,
      offsetX_left: -70,
      offsetY: -25,
      duration: 400,
      damage: _this.attackPower * 1.0,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_2`]: {
      width: 240,
      height: 55,
      offsetX_right: 75,
      offsetX_left: -75,
      offsetY: -28,
      duration: 400,
      damage: _this.attackPower * 1.2,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_attack_3`]: {
      width: 150,
      height: 80,
      offsetX_right: 60,
      offsetX_left: -60,
      offsetY: -40,
      duration: 500,
      damage: _this.attackPower * 2.0,
      attackerId: 'player',
      delay: 0
    },
    [`${_this.playerSkin}_player_slam_attack`]: {
      width: 280,
      height: 110,
      offsetX_right: 85,
      offsetX_left: -85,
      offsetY: -55,
      duration: 380,
      damage: _this.attackPower * 1.7,
      attackerId: 'player',
      delay: 0
    }
  });

const attackConfigs: { [K in PlayerSkins]?: PlayerAttackConfigFn } = {
  'swordMaster': swordsMasterAttackConfigs,
  'bloodSwordsMan': bloodSwordsManAttackConfigs,
  'lordOfFlames': lordOfFlamesAttackConfigs,
  'holySamurai': holySamuraiAttackConfigs
}

export const getAttackConfig = (playerSkin: PlayerSkins) => attackConfigs[playerSkin]