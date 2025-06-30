import type { Elk } from './index';

export type ElkState = {
  shouldMove: boolean;
  shouldEat: boolean;
  shouldLookUp: boolean;
  moveDirection: 'left' | 'right';
  shouldPlayMoveAnim: boolean;
  shouldPlayEatAnim: boolean;
  shouldPlayLookUpAnim: boolean;
}

export class State {
  private elk: Elk;
  private currentBehavior: 'moving' | 'eating' | 'looking' = 'eating';
  private behaviorTimer: number = 0;
  private behaviorDuration: number = 0;
  private moveDirection: 'left' | 'right' = 'right';

  constructor(elk: Elk) {
    this.elk = elk;
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
      this.moveDirection = Math.random() > 0.5 ? 'left' : 'right';
    }
  }

  public getState(time: number, delta: number): ElkState {
    this.behaviorTimer += delta;

    // Check if current behavior is finished
    if (this.behaviorTimer >= this.behaviorDuration) {
      this.startNewBehavior();
    }

    const currentAnim = this.elk.sprite.anims.currentAnim?.key;
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
