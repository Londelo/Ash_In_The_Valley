import { ActorConfig } from '../../components/Actor';

export type DeerSkins = 'deer';

const deerActorConfig: ActorConfig = {
  scale: 4,
  bodyWidth: 22,
  bodyHeight: 14,
  centerXLeft: 0.5,
  centerXRight: 0.5,
  centerY: 1,
  health: 8,
  attackPower: 0,
  invulnerabilityDuration: 500,
  bodyOffsetY: 40,
  knockbackForce: 80,
  deathAnimationKey: 'deer_death',
  hitAnimationKey: 'deer_death'
};

const actorConfigs: { [K in DeerSkins]: ActorConfig } = {
  deer: deerActorConfig
};

export const getDeerActorConfig = (deerSkin: DeerSkins): ActorConfig => actorConfigs[deerSkin] || deerActorConfig;
