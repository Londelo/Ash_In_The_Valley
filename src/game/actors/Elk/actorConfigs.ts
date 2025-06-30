import { ActorConfig } from '../../components/Actor';
import { ElkSkins } from '.';

const blueElkActorConfig: ActorConfig = {
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
  deathAnimationKey: 'blueElk_death',
  hitAnimationKey: 'blueElk_death'
};

const redElkActorConfig: ActorConfig = {
  ...blueElkActorConfig,
  deathAnimationKey: 'redElk_death',
  hitAnimationKey: 'redElk_death'
};

const actorConfigs: { [K in ElkSkins]: ActorConfig } = {
  blueElk: blueElkActorConfig,
  redElk: redElkActorConfig
};

export const getElkActorConfig = (elkSkin: ElkSkins): ActorConfig => actorConfigs[elkSkin] || blueElkActorConfig;
