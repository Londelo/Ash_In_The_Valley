import type { DaggerBandit } from './index';
import type { Player } from '../Player/index';

export type AI_State = {
    // isMoving: boolean;
    // isAttacking: boolean;
    // isBigAttacking: boolean;
    shouldAttack: boolean;
    shouldPlayIdleAnim: boolean;
    shouldPlayMoveAnim: boolean;
    shouldMove: boolean;
    isOnGround: boolean
    playerDirection: "left" | "right";
}
export class BanditAI {
  private bandit: DaggerBandit;
  private player: Player;

  // Simple AI parameters
  private DETECTION_MADE = false; // Speed of the bandit in pixels per second
  private readonly DETECTION_RANGE = 300;
  private readonly ATTACK_RANGE = 150;

  // Attack cooldown
  private lastAttackTime: number = 0;
  private readonly ATTACK_COOLDOWN = 1500; // ms

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

  public getState(time: number, _delta: number):AI_State {
    const distance = this.getDistanceToPlayer();
    const direction = this.getDirectionToPlayer();
    const currentAnim = this.bandit.sprite.anims.currentAnim?.key;

    const isMoving = currentAnim === 'bandit_run'
    const isIdle = currentAnim === 'bandit_idle'
    const isAttacking = currentAnim === 'bandit_attack'
    const isBigAttacking = currentAnim === 'bandit_bat_fang_attack'
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
