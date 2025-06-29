import { ActorConfig } from '../../components/Actor';
import { PlayerSkins } from '.';

const swordMasterActorConfig: ActorConfig = {
  scale: 3,
  bodyWidth: 15,
  bodyHeight: 34,
  centerXLeft: 0.7,
  centerXRight: 0.305,
  centerY: 1,
  health: 100,
  attackPower: 30,
  invulnerabilityDuration: 1000,
  bodyOffsetY: 0,
  knockbackForce: 200,
  deathAnimationKey: 'player_death',
  hitAnimationKey: 'player_hit'
};

const bloodSwordsManActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 30,
  bodyHeight: 40,
  bodyOffsetY: 40
};

const lordOfFlamesActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 25,
  bodyHeight: 30,
  centerXLeft: 0.65,
  centerXRight: 0.35,
  bodyOffsetY: 17
};

const holySamuraiActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  scale: 1.5,
  bodyWidth: 40,
  bodyHeight: 60,
  centerXLeft: 0.6,
  centerXRight: 0.4,
  bodyOffsetY: 132,
  attackPower: 35
};

const actorConfigs: { [K in PlayerSkins]: ActorConfig } = {
  swordMaster: swordMasterActorConfig,
  bloodSwordsMan: bloodSwordsManActorConfig,
  lordOfFlames: lordOfFlamesActorConfig,
  holySamurai: holySamuraiActorConfig
};

export const getActorConfig = (playerSkin: PlayerSkins): ActorConfig => actorConfigs[playerSkin] || swordMasterActorConfig;