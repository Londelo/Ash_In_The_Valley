import type { DaggerBandit } from './index';
import type { Player } from '../Player/index';

export class BanditAI {
  private bandit: DaggerBandit;
  private player: Player;
  
  // Simple AI parameters
  private readonly DETECTION_RANGE = 300;
  private readonly ATTACK_RANGE = 100;
  
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

  private canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime > this.ATTACK_COOLDOWN;
  }

  public update(time: number, delta: number) {
    const deltaTime = delta / 1000;
    const distance = this.getDistanceToPlayer();
    const direction = this.getDirectionToPlayer();

    // If player is not detected, do nothing
    if (distance > this.DETECTION_RANGE) {
      return;
    }

    // If close enough and can attack, attack
    if (distance <= this.ATTACK_RANGE && this.canAttack(time)) {
      this.bandit.setCharacterDirection(direction === 'left');
      this.bandit.handleAttack();
      this.lastAttackTime = time;
      return;
    }

    // If player is detected but not in attack range, move towards player
    if (distance > this.ATTACK_RANGE) {
      const moveLeft = direction === 'left';
      const moveRight = direction === 'right';
      const isRunning = true; // Always run when chasing
      
      this.bandit.handleMovement(moveLeft, moveRight, isRunning, deltaTime);
      this.bandit.handleMovementAnimations(true, isRunning);
    }
  }
}