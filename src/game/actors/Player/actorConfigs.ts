import { ActorConfig } from '../../components/Actor';
import { PlayerSkins } from '.';

const swordMasterActorConfig: ActorConfig = {
  scale: 3,
  bodyWidth: 15,
  bodyHeight: 20,
  centerXLeft: 0.7,
  centerXRight: 0.305,
  centerY: 1,
  health: 300,
  attackPower: 10,
  invulnerabilityDuration: 1000,
  bodyOffsetY: 15,
  knockbackForce: 200,
  deathAnimationKey: 'swordMaster_player_death',
  hitAnimationKey: 'swordMaster_player_hit',
  healthBar:{
    width: 50,
    height: 6,
    borderWidth: 1,
    borderColor: 0x000000,
    backgroundColor: 0x000000,
    fillColor: 0x00ff00,
    offsetY: 100,
    showBorder: true,
    showBackground: true
  }
};

const bloodSwordsManActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 30,
  bodyHeight: 20,
  bodyOffsetY: 60,
  deathAnimationKey: 'bloodSwordsMan_player_death',
  hitAnimationKey: 'bloodSwordsMan_player_hit'
};

const lordOfFlamesActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 25,
  bodyHeight: 20,
  centerXLeft: 0.75,
  centerXRight: 0.25,
  bodyOffsetY: 27,
  deathAnimationKey: 'lordOfFlames_player_death',
  hitAnimationKey: 'lordOfFlames_player_hit'
};

const holySamuraiActorConfig: ActorConfig = {
  ...swordMasterActorConfig,
  bodyWidth: 15,
  bodyHeight: 20,
  centerXLeft: 0.65,
  centerXRight: 0.35,
  bodyOffsetY: 45,
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
