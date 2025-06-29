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

const lordOfFamesActorConfig: ActorConfig = {
  ...swordMasterActorConfig
  // TODO: Override any properties specific to lordOfFames here
};

const holySamuraiActorConfig: ActorConfig = {
  ...swordMasterActorConfig
  // TODO: Override any properties specific to holySamurai here
};

const actorConfigs: { [K in PlayerSkins]: ActorConfig } = {
  swordMaster: swordMasterActorConfig,
  bloodSwordsMan: bloodSwordsManActorConfig,
  lordOfFames: lordOfFamesActorConfig,
  holySamurai: holySamuraiActorConfig
};

export const getActorConfig = (playerSkin: PlayerSkins): ActorConfig => actorConfigs[playerSkin] || swordMasterActorConfig;
