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
  (_this: Player) => ({});

const attackConfigs: { [K in PlayerSkins]?: PlayerAttackConfigFn } = {
  'swordMaster': swordsMasterAttackConfigs,
  'bloodSwordsMan': bloodSwordsManAttackConfigs
}

export const getAttackConfig = (playerSkin: PlayerSkins) => attackConfigs[playerSkin]
