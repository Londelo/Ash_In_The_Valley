import { ActorConfig } from '../../components/Actor';

export type ElkSkins = 'elk';

const elkActorConfig: ActorConfig = {
  scale: 4,
  bodyWidth: 25,
  bodyHeight: 15,
  centerXLeft: 0.7,
  centerXRight: 0.3,
  centerY: 1,
  health: 10,
  attackPower: 0,
  invulnerabilityDuration: 500,
  bodyOffsetY: 20,
  knockbackForce: 100,
  deathAnimationKey: 'elk_death',
  hitAnimationKey: 'elk_death'
};

const actorConfigs: { [K in ElkSkins]: ActorConfig } = {
  elk: elkActorConfig
};

export const getElkActorConfig = (elkSkin: ElkSkins): ActorConfig => actorConfigs[elkSkin] || elkActorConfig;
