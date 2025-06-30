import type { DaggerBandit } from './index';
import type { Player } from '../Player/index';

export type AI_State = {
    shouldAttack: boolean;
    shouldPlayIdleAnim: boolean;
    shouldPlayMoveAnim: boolean;
    shouldMove: boolean;
    isOnGround: boolean
    playerDirection: "left" | "right";
    isCharging: boolean;
}
export class State {
  private bandit: DaggerBandit;
  private player: Player;

  private DETECTION_MADE = false;
  private readonly DETECTION_RANGE = 700;
  private readonly ATTACK_RANGE = 120;

  private lastAttackTime: number = 0;
  private readonly ATTACK_COOLDOWN = 1500;

  // Charge behavior properties
  private chargeStartTime: number = 0;
  private readonly CHARGE_DURATION = 2000; // 2 seconds
  private isCharging: boolean = false;

  constructor(bandit: DaggerBandit, player: Player) {
    this.bandit = bandit;
    this.player = player;
  }

  private getDistanceToPlayer(): number {
    const banditX = this.bandit.sprite.x;
    const banditY = this.bandit.sprite.y;
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;

    return Math.sqrt(Math.pow(playerX - banditX, 2) + Math.pow(playerY - banditY, 2));
  }

  private getDirectionToPlayer(): 'left' | 'right' {
    return this.player.sprite.x < this.bandit.sprite.x ? 'left' : 'right';
  }

  private checkAttackCooldown(currentTime: number): boolean {
    return currentTime - this.lastAttackTime > this.ATTACK_COOLDOWN;
  }

  private handleChargeLogic(currentTime: number, playerIsDetected: boolean): boolean {
    // Start charging when first detecting player
    if (playerIsDetected && !this.DETECTION_MADE && !this.isCharging) {
      this.isCharging = true;
      this.chargeStartTime = currentTime;
      return true;
    }

    // Continue charging for the duration
    if (this.isCharging) {
      const chargeElapsed = currentTime - this.chargeStartTime;
      if (chargeElapsed >= this.CHARGE_DURATION) {
        this.isCharging = false;
        return false;
      }
      return true;
    }

    return false;
  }

  public isActionAnimations(animKey?: string, uniqueId?: string): boolean {
    if (!animKey || !uniqueId) return false;
    return animKey === `${uniqueId}_dagger_bandit_attack` ||
      animKey === `${uniqueId}_dagger_bandit_bat_fang_attack` ||
      animKey === `${uniqueId}_dagger_bandit_hit`;
  }

  public isHighPriorityAnimation(animKey?: string, uniqueId?: string): boolean {
    if (!animKey || !uniqueId) return false;
    return animKey === `${uniqueId}_dagger_bandit_attack` ||
      animKey === `${uniqueId}_dagger_bandit_bat_fang_attack` ||
      animKey === `${uniqueId}_dagger_bandit_vanish` ||
      animKey === `${uniqueId}_dagger_bandit_appear` ||
      animKey === `${uniqueId}_dagger_bandit_death` ||
      animKey === `${uniqueId}_dagger_bandit_hit`;
  }

  public getState(time: number, _delta: number):AI_State {
    const distance = this.getDistanceToPlayer();
    const direction = this.getDirectionToPlayer();
    const currentAnim = this.bandit.sprite.anims.currentAnim?.key;

    const isMoving = currentAnim === `${this.bandit.uniqueId}_dagger_bandit_run`
    const isIdle = currentAnim === `${this.bandit.uniqueId}_dagger_bandit_idle`
    const isAttacking = currentAnim === `${this.bandit.uniqueId}_dagger_bandit_attack`
    const isBigAttacking = currentAnim === `${this.bandit.uniqueId}_dagger_bandit_bat_fang_attack`
    const isOnGround = this.bandit.sprite.body.onFloor();

    const playerDirection = direction
    const playerIsDetected = distance < this.DETECTION_RANGE || this.DETECTION_MADE
    const playerIsInAttackRange = distance <= this.ATTACK_RANGE
    const canAttack = this.checkAttackCooldown(time)

    // Handle charge behavior
    const isCharging = this.handleChargeLogic(time, playerIsDetected);

    // Attack when: detected, in range, can attack, not already attacking, not charging
    const shouldAttack = playerIsDetected && playerIsInAttackRange && canAttack && !isAttacking && !isBigAttacking && !isCharging

    // Move when: detected, NOT in attack range, not attacking, OR when charging
    const shouldMove = (playerIsDetected && !playerIsInAttackRange && !isAttacking && !isBigAttacking) || isCharging

    // Animation logic
    const shouldPlayMoveAnim = shouldMove && !isMoving
    const shouldPlayIdleAnim = !shouldMove && !isAttacking && !isBigAttacking && !isIdle

    // Update state tracking
    this.lastAttackTime = shouldAttack ? time : this.lastAttackTime
    this.DETECTION_MADE = playerIsDetected ? true : this.DETECTION_MADE

    return {
      shouldAttack,
      shouldPlayMoveAnim,
      shouldPlayIdleAnim,
      shouldMove,
      playerDirection,
      isOnGround,
      isCharging
    }
  }
}
