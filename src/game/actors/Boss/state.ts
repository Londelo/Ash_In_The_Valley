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

  private readonly DETECTION_RANGE = 600;
  private readonly ATTACK_RANGE = 200;
  private readonly ATTACK_COOLDOWN = 2000;

  private lastAttackTime: number = 0;
  private attackCount: number = 0;
  private hasUsedVanishAttack: boolean = false;
  private lastMoveTime: number = 0;
  private readonly MOVE_DURATION = 1500;

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

  private checkAttackCooldown(currentTime: number): boolean {
    return currentTime - this.lastAttackTime > this.ATTACK_COOLDOWN;
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
    this.lastAttackTime = Date.now();
  }

  public onVanishUsed() {
    this.hasUsedVanishAttack = true;
    // Reset after some time so boss can vanish again
    setTimeout(() => {
      this.hasUsedVanishAttack = false;
    }, 15000);
  }

  public getState(time: number, _delta: number): BossState {
    const currentAnim = this.boss.sprite.anims.currentAnim?.key;
    const direction = this.getDirectionToPlayer();
    const isOnGround = this.boss.sprite.body.onFloor();
    const currentPhase = this.boss.health <= this.boss.maxHealth / 2 ? 'phase2' : 'phase1';
    const distance = this.getDistanceToPlayer();

    const isMoving = currentAnim === 'boss_move';
    const isIdle = currentAnim === 'boss_idle';
    const isAttacking = this.isActionAnimations(currentAnim);

    const canAttack = this.checkAttackCooldown(time);
    const playerInRange = distance <= this.ATTACK_RANGE;

    // Default state values - these can be overridden by the Boss class
    const shouldAttack1 = false;
    const shouldAttack2 = false;
    const shouldVanish = false;
    const shouldMove = false;
    
    // Animation logic
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