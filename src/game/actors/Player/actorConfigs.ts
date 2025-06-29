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
  deathAnimationKey: 'swordMaster_player_death',
  hitAnimationKey: 'swordMaster_player_hit'
};

const bloodSwordsManActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 30,
  bodyHeight: 40,
  bodyOffsetY: 40,
  deathAnimationKey: 'bloodSwordsMan_player_death',
  hitAnimationKey: 'bloodSwordsMan_player_hit'
};

const lordOfFlamesActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 25,
  bodyHeight: 30,
  centerXLeft: 0.75,
  centerXRight: 0.25,
  bodyOffsetY: 17,
  deathAnimationKey: 'lordOfFlames_player_death',
  hitAnimationKey: 'lordOfFlames_player_hit'
};

const holySamuraiActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 15,
  bodyHeight: 34,
  centerXLeft: 0.65,
  centerXRight: 0.35,
  bodyOffsetY: 30,
  attackPower: 35,
  deathAnimationKey: 'holySamurai_player_death',
  hitAnimationKey: 'holySamurai_player_hit'
};

const actorConfigs: { [K in PlayerSkins]: ActorConfig } = {
  swordMaster: swordMasterActorConfig,
  bloodSwordsMan: bloodSwordsManActorConfig,
  lordOfFlames: lordOfFlamesActorConfig,
  holySamurai: holySamuraiActorConfig
};

export const getActorConfig = (playerSkin: PlayerSkins): ActorConfig => actorConfigs[playerSkin] || swordMasterActorConfig;
