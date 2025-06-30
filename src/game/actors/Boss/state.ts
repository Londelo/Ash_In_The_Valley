import type { Boss } from './index';
import type { Player } from '../Player/index';

export type BossState = {
  shouldAttack1: boolean;
  shouldAttack2: boolean;
  shouldVanish: boolean;
  shouldMove: boolean;
  shouldPlayIdleAnim: boolean;
  shouldPlayMoveAnim: boolean;
  playerDirection: 'left' | 'right';
  isOnGround: boolean;
  currentPhase: 'phase1' | 'phase2';
}

export class State {
  private boss: Boss;
  private player: Player;

  constructor(boss: Boss, player: Player) {
    this.boss = boss;
    this.player = player;
  }

  public isActionAnimations(animKey?: string): boolean {
    if (!animKey) return false;
    return animKey === 'boss_attack_1' ||
      animKey === 'boss_prep_attack_1' ||
      animKey === 'boss_attack_2' ||
      animKey === 'boss_attack_2_prep' ||
      animKey === 'boss_attack_2_end' ||
      animKey === 'boss_vanish' ||
      animKey === 'boss_appear' ||
      animKey === 'boss_hit' ||
      animKey === 'boss_death';
  }

  public isHighPriorityAnimation(animKey?: string): boolean {
    if (!animKey) return false;
    return animKey === 'boss_attack_1' ||
      animKey === 'boss_prep_attack_1' ||
      animKey === 'boss_attack_2' ||
      animKey === 'boss_attack_2_prep' ||
      animKey === 'boss_attack_2_end' ||
      animKey === 'boss_vanish' ||
      animKey === 'boss_appear' ||
      animKey === 'boss_hit' ||
      animKey === 'boss_death';
  }

  public onAttackComplete() {
    // Simplified - no longer tracking attack count
  }

  public onVanishUsed() {
    // Simplified - no longer tracking vanish state
  }

  public getState(time: number, _delta: number): BossState {
    const direction = this.player.sprite.x < this.boss.sprite.x ? 'left' : 'right';
    const isOnGround = this.boss.sprite.body.onFloor();
    const currentPhase = this.boss.health <= this.boss.maxHealth / 2 ? 'phase2' : 'phase1';

    // Default state values - these are now mostly unused in the simplified boss
    return {
      shouldAttack1: false,
      shouldAttack2: false,
      shouldVanish: false,
      shouldMove: false,
      shouldPlayIdleAnim: false,
      shouldPlayMoveAnim: false,
      playerDirection: direction,
      isOnGround,
      currentPhase
    };
  }
}