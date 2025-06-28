import { Player, PlayerSkins } from '.';
import { AttackHitboxConfig } from '../../components/AttackHitbox';

// Type alias for player attack config function
export type PlayerAttackConfigFn = (_this: Player) => { [key: string]: AttackHitboxConfig };

const swordsMasterAttackConfigs: PlayerAttackConfigFn =
  (_this: Player) => ({
    'player_slash_1': {
      width: 200,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: _this.attackPower,
      attackerId: 'player'
    },
    'player_slash_2': {
      width: 200,
      height: 40,
      offsetX_right: 65,
      offsetX_left: -65,
      offsetY: -18,
      duration: 200,
      damage: _this.attackPower,
      attackerId: 'player'
    },
    'player_spin_attack': {
      width: 270,
      height: 70,
      offsetX_right: 45,
      offsetX_left: -45,
      offsetY: -35,
      duration: 400,
      damage: _this.attackPower * 1.5,
      attackerId: 'player'
    },
    'player_slam_attack': {
      width: 220,
      height: 100,
      offsetX_right: 80,
      offsetX_left: -80,
      offsetY: -55,
      duration: 300,
      damage: _this.attackPower * 1.2,
      attackerId: 'player'
    }
  });

const bloodSwordsManAttackConfigs: PlayerAttackConfigFn =
  (_this: Player) => ({
    'player_slash_1': {
      width: 250,
      height: 50,
      offsetX_right: 75,
      offsetX_left: -75,
      offsetY: -25,
      duration: 250,
      damage: _this.attackPower * 1.1,
      attackerId: 'player'
    },
    'player_slash_2': {
      width: 280,
      height: 60,
      offsetX_right: 85,
      offsetX_left: -85,
      offsetY: -30,
      duration: 300,
      damage: _this.attackPower * 1.3,
      attackerId: 'player'
    },
    'player_spin_attack': {
      width: 320,
      height: 80,
      offsetX_right: 55,
      offsetX_left: -55,
      offsetY: -40,
      duration: 450,
      damage: _this.attackPower * 1.8,
      attackerId: 'player'
    },
    'player_slam_attack': {
      width: 300,
      height: 120,
      offsetX_right: 100,
      offsetX_left: -100,
      offsetY: -60,
      duration: 350,
      damage: _this.attackPower * 1.5,
      attackerId: 'player'
    }
  });

const attackConfigs: { [K in PlayerSkins]?: PlayerAttackConfigFn } = {
  'swordMaster': swordsMasterAttackConfigs,
  'bloodSwordsMan': bloodSwordsManAttackConfigs
}

export const getAttackConfig = (playerSkin: PlayerSkins) => attackConfigs[playerSkin]