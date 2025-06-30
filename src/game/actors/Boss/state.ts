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

  private readonly ARENA_CENTER_X = 600;
  private readonly DETECTION_RANGE = 400;
  private readonly ATTACK_RANGE = 200;
  private readonly ATTACK_COOLDOWN = 2000; // Reduced cooldown for more action
  private readonly SPECIAL_ATTACK_INTERVAL = 3; // Every 3rd attack

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

  private shouldUseSpecialAttack(): boolean {
    return this.attackCount > 0 && this.attackCount % this.SPECIAL_ATTACK_INTERVAL === 0;
  }

  private shouldUseVanishAttack(): boolean {
    const currentPhase = this.boss.health <= this.boss.maxHealth / 2 ? 'phase2' : 'phase1';
    return currentPhase === 'phase2' && !this.hasUsedVanishAttack && Math.random() < 0.3;
  }

  private checkAttackCooldown(currentTime: number): boolean {
    return currentTime - this.lastAttackTime > this.ATTACK_COOLDOWN;
  }

  private shouldMoveTowardsPlayer(currentTime: number): boolean {
    const distance = this.getDistanceToPlayer();
    const timeSinceLastMove = currentTime - this.lastMoveTime;
    
    // Move if player is too far or if we haven't moved in a while
    return distance > this.ATTACK_RANGE || timeSinceLastMove > this.MOVE_DURATION;
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
    const shouldUseSpecial = this.shouldUseSpecialAttack();
    const shouldUseVanish = this.shouldUseVanishAttack();

    // Attack logic - boss should be aggressive
    const shouldAttack1 = canAttack && playerInRange && shouldUseSpecial && !isAttacking;
    const shouldAttack2 = canAttack && playerInRange && !shouldUseSpecial && !shouldUseVanish && !isAttacking;
    const shouldVanish = shouldUseVanish && !isAttacking;

    // Movement logic - boss should actively pursue player
    const shouldMove = this.shouldMoveTowardsPlayer(time) && !isAttacking && !playerInRange;
    const shouldPlayMoveAnim = shouldMove && !isMoving;
    const shouldPlayIdleAnim = !shouldMove && !isAttacking && !isIdle;

    // Update move timer when starting to move
    if (shouldMove && !isMoving) {
      this.lastMoveTime = time;
    }

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