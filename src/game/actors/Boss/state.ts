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

  private readonly ARENA_CENTER_X = 750;
  private readonly WANDER_RANGE = 200;
  private readonly ATTACK_2_COOLDOWN = 4000;
  private readonly SPECIAL_ATTACK_INTERVAL = 5;

  private lastAttack2Time: number = 0;
  private attackCount: number = 0;
  private hasUsedVanishAttack: boolean = false;

  constructor(boss: Boss, player: Player) {
    this.boss = boss;
    this.player = player;
  }

  private getDistanceToPlayer(): number {
    const bossX = this.boss.sprite.x;
    const bossY = this.boss.sprite.y;
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;

    return Math.sqrt(Math.pow(playerX - bossX, 2) + Math.pow(playerY - bossY, 2));
  }

  private getDirectionToPlayer(): 'left' | 'right' {
    return this.player.sprite.x < this.boss.sprite.x ? 'left' : 'right';
  }

  private shouldUseSpecialAttack(): boolean {
    const randomChance = Math.random() < 0.3;
    return this.attackCount >= this.SPECIAL_ATTACK_INTERVAL && randomChance;
  }

  private shouldUseVanishAttack(): boolean {
    const currentPhase = this.boss.health <= this.boss.maxHealth / 2 ? 'phase2' : 'phase1';
    return currentPhase === 'phase2' && !this.hasUsedVanishAttack && Math.random() < 0.4;
  }

  private checkAttack2Cooldown(currentTime: number): boolean {
    return currentTime - this.lastAttack2Time > this.ATTACK_2_COOLDOWN;
  }

  private shouldWander(): boolean {
    const distanceFromCenter = Math.abs(this.boss.sprite.x - this.ARENA_CENTER_X);
    return distanceFromCenter < this.WANDER_RANGE;
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
    this.attackCount++;
    this.lastAttack2Time = Date.now();
  }

  public onVanishUsed() {
    this.hasUsedVanishAttack = true;
  }

  public getState(time: number, _delta: number): BossState {
    const currentAnim = this.boss.sprite.anims.currentAnim?.key;
    const direction = this.getDirectionToPlayer();
    const isOnGround = this.boss.sprite.body.onFloor();
    const currentPhase = this.boss.health <= this.boss.maxHealth / 2 ? 'phase2' : 'phase1';

    const isMoving = currentAnim === 'boss_move';
    const isIdle = currentAnim === 'boss_idle';
    const isAttacking = this.isActionAnimations(currentAnim);

    const canAttack2 = this.checkAttack2Cooldown(time);
    const shouldUseSpecial = this.shouldUseSpecialAttack();
    const shouldUseVanish = this.shouldUseVanishAttack();

    const shouldAttack1 = canAttack2 && shouldUseSpecial && !isAttacking;
    const shouldAttack2 = canAttack2 && !shouldUseSpecial && !shouldUseVanish && !isAttacking;
    const shouldVanish = shouldUseVanish && !isAttacking;

    const shouldMove = this.shouldWander() && !isAttacking && !isMoving;
    const shouldPlayMoveAnim = shouldMove && !isMoving;
    const shouldPlayIdleAnim = !shouldMove && !isAttacking && !isIdle;

    return {
      shouldAttack1,
      shouldAttack2,
      shouldVanish,
      shouldMove,
      shouldPlayIdleAnim,
      shouldPlayMoveAnim,
      playerDirection: direction,
      isOnGround,
      currentPhase
    };
  }
}