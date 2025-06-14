import type { DaggerBandit } from './index';
import type { Player } from '../Player/index';

export class BanditAI {
  private bandit: DaggerBandit;
  private player: Player;
  
  // AI behavior timers and states
  private actionTimer: number = 0;
  private nextActionTime: number = 0;
  private currentBehavior: 'idle' | 'chase' | 'attack' | 'retreat' | 'special' = 'idle';
  private behaviorTimer: number = 0;
  
  // AI parameters
  private readonly DETECTION_RANGE = 300;
  private readonly ATTACK_RANGE = 120;
  private readonly RETREAT_RANGE = 80;
  private readonly CHASE_SPEED_MULTIPLIER = 1.2;
  
  // Action probabilities and cooldowns
  private lastAttackTime: number = 0;
  private lastSpecialTime: number = 0;
  private lastVanishTime: number = 0;
  private readonly ATTACK_COOLDOWN = 1500; // ms
  private readonly SPECIAL_COOLDOWN = 4000; // ms
  private readonly VANISH_COOLDOWN = 8000; // ms

  constructor(bandit: DaggerBandit, player: Player) {
    this.bandit = bandit;
    this.player = player;
    this.setNextAction();
  }

  private setNextAction() {
    // Random delay between actions (0.5 to 2 seconds)
    this.nextActionTime = this.actionTimer + (500 + Math.random() * 1500);
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

  private canUseSpecial(currentTime: number): boolean {
    return currentTime - this.lastSpecialTime > this.SPECIAL_COOLDOWN;
  }

  private canVanish(currentTime: number): boolean {
    return currentTime - this.lastVanishTime > this.VANISH_COOLDOWN;
  }

  private decideBehavior(distance: number, currentTime: number): 'idle' | 'chase' | 'attack' | 'retreat' | 'special' {
    // If player is not detected, stay idle
    if (distance > this.DETECTION_RANGE) {
      return 'idle';
    }

    // If very close and can attack, attack
    if (distance <= this.ATTACK_RANGE && this.canAttack(currentTime)) {
      return 'attack';
    }

    // If too close, retreat
    if (distance <= this.RETREAT_RANGE) {
      return 'retreat';
    }

    // Random chance for special abilities
    if (this.canUseSpecial(currentTime) && Math.random() < 0.3) {
      return 'special';
    }

    // If player is in detection range but not attack range, chase
    if (distance <= this.DETECTION_RANGE && distance > this.ATTACK_RANGE) {
      return 'chase';
    }

    return 'idle';
  }

  private executeBehavior(behavior: 'idle' | 'chase' | 'attack' | 'retreat' | 'special', deltaTime: number, currentTime: number) {
    const direction = this.getDirectionToPlayer();
    
    switch (behavior) {
      case 'idle':
        // Just stand idle, maybe occasionally jump
        if (Math.random() < 0.001 && this.bandit.isOnGround) { // Very low chance
          this.bandit.handleJump();
        }
        break;

      case 'chase':
        // Move towards player
        const moveLeft = direction === 'left';
        const moveRight = direction === 'right';
        const isRunning = true; // AI always runs when chasing
        
        this.bandit.handleMovement(moveLeft, moveRight, isRunning, deltaTime);
        this.bandit.handleMovementAnimations(true, isRunning);
        
        // Occasionally jump while chasing
        if (Math.random() < 0.005 && this.bandit.isOnGround) {
          this.bandit.handleJump();
        }
        break;

      case 'attack':
        // Face the player and attack
        this.bandit.setCharacterDirection(direction === 'left');
        
        // Choose between regular attack and bat fang attack
        if (Math.random() < 0.7) {
          this.bandit.handleAttack();
        } else {
          this.bandit.handleBatFangAttack();
        }
        
        this.lastAttackTime = currentTime;
        break;

      case 'retreat':
        // Move away from player
        const retreatLeft = direction === 'right'; // Opposite of player direction
        const retreatRight = direction === 'left';
        
        this.bandit.handleMovement(retreatLeft, retreatRight, true, deltaTime);
        this.bandit.handleMovementAnimations(true, true);
        
        // Maybe vanish if available
        if (this.canVanish(currentTime) && Math.random() < 0.4) {
          this.bandit.handleVanishAppear();
          this.lastVanishTime = currentTime;
        }
        break;

      case 'special':
        // Use special abilities
        this.bandit.setCharacterDirection(direction === 'left');
        
        if (this.canVanish(currentTime) && Math.random() < 0.6) {
          this.bandit.handleVanishAppear();
          this.lastVanishTime = currentTime;
        } else {
          this.bandit.handleBatFangAttack();
        }
        
        this.lastSpecialTime = currentTime;
        break;
    }
  }

  public update(time: number, delta: number) {
    const deltaTime = delta / 1000;
    this.actionTimer += delta;
    this.behaviorTimer += delta;

    // Only make decisions at intervals, not every frame
    if (this.actionTimer >= this.nextActionTime) {
      const distance = this.getDistanceToPlayer();
      const newBehavior = this.decideBehavior(distance, time);
      
      // Change behavior or continue current one
      if (newBehavior !== this.currentBehavior || this.behaviorTimer > 2000) {
        this.currentBehavior = newBehavior;
        this.behaviorTimer = 0;
      }
      
      this.setNextAction();
    }

    // Execute current behavior
    this.executeBehavior(this.currentBehavior, deltaTime, time);
  }
}