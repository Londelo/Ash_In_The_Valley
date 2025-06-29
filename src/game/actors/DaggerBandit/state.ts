import type { DaggerBandit } from './index';
import type { Player } from '../Player/index';

export type AI_State = {
    shouldAttack: boolean;
    shouldPlayIdleAnim: boolean;
    shouldPlayMoveAnim: boolean;
    shouldMove: boolean;
    isOnGround: boolean
    playerDirection: "left" | "right";
}
export class State {
  private bandit: DaggerBandit;
  private player: Player;

  private DETECTION_MADE = false;
  private readonly DETECTION_RANGE = 300;
  private readonly ATTACK_RANGE = 150;

  private lastAttackTime: number = 0;
  private readonly ATTACK_COOLDOWN = 1500;

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

    const shouldAttack = canAttack && playerIsInAttackRange && !isAttacking && !isBigAttacking
    const shouldMove = distance > this.ATTACK_RANGE && playerIsDetected
    const shouldPlayMoveAnim = shouldMove && !isMoving && !playerIsInAttackRange
    const shouldPlayIdleAnim = (playerIsInAttackRange || !playerIsDetected) && !isIdle

    this.lastAttackTime = shouldAttack ? time : this.lastAttackTime
    this.DETECTION_MADE = !this.DETECTION_MADE && playerIsDetected ? true : this.DETECTION_MADE

    return {
      shouldAttack,
      shouldPlayMoveAnim,
      shouldPlayIdleAnim,
      shouldMove,
      playerDirection,
      isOnGround
    }
  }
}