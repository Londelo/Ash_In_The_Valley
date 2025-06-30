import type { Deer } from './';

export type DeerState = {
  shouldMove: boolean;
  shouldEat: boolean;
  shouldLookUp: boolean;
  moveDirection: 'left' | 'right';
  shouldPlayMoveAnim: boolean;
  shouldPlayEatAnim: boolean;
  shouldPlayLookUpAnim: boolean;
}

export class State {
  private deer: Deer;
  private currentBehavior: 'moving' | 'eating' | 'looking' = 'eating';
  private behaviorTimer: number = 0;
  private behaviorDuration: number = 0;
  private moveDirection: 'left' | 'right' = 'right';

  constructor(deer: Deer) {
    this.deer = deer;
    this.startNewBehavior();
  }

  private startNewBehavior(): void {
    // Randomly choose between moving and eating
    const behaviors = ['moving', 'eating', 'looking'] as const;
    this.currentBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];

    // Set random duration (1-2 seconds)
    this.behaviorDuration = 1000 + Math.random() * 1000;
    this.behaviorTimer = 0;

    // If moving, choose random direction
    if (this.currentBehavior === 'moving') {
      this.moveDirection = this.moveDirection === 'left' ? 'right' : 'left';
    }
  }

  public getState(time: number, delta: number): DeerState {
    this.behaviorTimer += delta;

    // Check if current behavior is finished
    if (this.behaviorTimer >= this.behaviorDuration) {
      this.startNewBehavior();
    }

    const currentAnim = this.deer.sprite.anims.currentAnim?.key;
    const isMoving = currentAnim?.includes('_walk');
    const isEating = currentAnim?.includes('_eat');
    const isLookingUp = currentAnim?.includes('_look_up');

    const shouldMove = this.currentBehavior === 'moving';
    const shouldEat = this.currentBehavior === 'eating';
    const shouldLookUp = this.currentBehavior === 'looking';

    const shouldPlayMoveAnim = shouldMove && !isMoving;
    const shouldPlayEatAnim = shouldEat && !isEating;
    const shouldPlayLookUpAnim = shouldLookUp && !isLookingUp;

    return {
      shouldMove,
      shouldEat,
      shouldLookUp,
      moveDirection: this.moveDirection,
      shouldPlayMoveAnim,
      shouldPlayEatAnim,
      shouldPlayLookUpAnim
    };
  }
}
