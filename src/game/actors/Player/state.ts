import type { Player } from './index';

export interface PlayerState {
  shouldAttack: boolean;
  shouldSlamAttack: boolean;
  shouldJump: boolean;
  shouldFall: boolean;
  shouldDash: boolean;
  shouldBlock: boolean
  isMovingLeft: boolean;
  isMovingRight: boolean;
  isRunning: boolean;
  isMoving: boolean;
  justStoppedMoving: boolean;

  canMove: boolean;

  shouldPlayIdleAnimation: boolean;
  shouldPlayMovementAnimation: boolean;
  shouldPlayWalkAnimation: boolean;
  shouldPlayRunAnimation: boolean;

  isSlashing: boolean;
  isDashing: boolean;
  isLanding: boolean;
  isInAir: boolean;
  isOnGround: boolean;
}

export class State {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public isActionAnimations(animKey?: string): boolean {
    return animKey === 'player_slash_1' ||
      animKey === 'player_slash_2' ||
      animKey === 'player_slam_attack' ||
      animKey === 'player_dash' ||
      animKey === 'player_spin_attack' ||
      animKey === 'player_roll_attack' ||
      animKey === 'player_slash_heavy' ||
      animKey === 'player_land' ||
      animKey === 'player_block' ||
      animKey === 'player_hit' ||
      animKey === 'player_death'
  }

  public isHighPriorityAnimation(animKey?: string): boolean {
    return animKey === 'player_land' ||
      animKey === 'player_slash_1' ||
      animKey === 'player_slash_2' ||
      animKey === 'player_slam_attack' ||
      animKey === 'player_dash' ||
      animKey === 'player_spin_attack' ||
      animKey === 'player_roll_attack' ||
      animKey === 'player_slash_heavy' ||
      animKey === 'player_block' ||
      animKey === 'player_hit' ||
      animKey === 'player_death'
  }

  public getState(currentAnim: string | undefined): PlayerState {
    const inputKeys = this.player.inputKeys;
    const cursors = this.player.cursors;
    const isOnGround = this.player.sprite.body.onFloor();

    const isSlashing = currentAnim === 'player_slash_1' || currentAnim === 'player_slash_2' || currentAnim === 'player_spin_attack';;;
    const isDashing = currentAnim === 'player_dash';
    const isLanding = currentAnim === 'player_land';
    const isSlamming = currentAnim === 'player_slam_attack'
    const isBlocking = currentAnim === 'player_block'
    const isInAir = !isOnGround;

    const isMovingLeft = cursors.left.isDown;
    const isMovingRight = cursors.right.isDown;
    const justStoppedMoving = Phaser.Input.Keyboard.JustUp(cursors.left) || Phaser.Input.Keyboard.JustUp(cursors.right)

    const isMoving = isMovingLeft || isMovingRight;

    const spacePressed = inputKeys.SPACE.isDown;
    const isRunning = spacePressed && isOnGround;

    const shouldDash = Phaser.Input.Keyboard.JustDown(inputKeys.Q) &&
                       !isSlamming &&
                       !isSlashing &&
                       !isDashing

    const shouldAttack = Phaser.Input.Keyboard.JustDown(inputKeys.R) && isOnGround

    const shouldBlock = Phaser.Input.Keyboard.JustDown(inputKeys.W) && isOnGround && !isBlocking && !isDashing && !isInAir

    const shouldSlamAttack = Phaser.Input.Keyboard.JustDown(inputKeys.E)

    const shouldJump = Phaser.Input.Keyboard.JustDown(cursors.up) &&
                       isOnGround &&
                       !isSlamming &&
                       !isSlashing &&
                       !isDashing

    const shouldFall = this.player.sprite.body.velocity.y > 0 &&
                       isInAir &&
                       !isSlamming &&
                       !isSlashing &&
                       !isDashing

    const canMove = !isSlashing && !isDashing && !isLanding && !isSlamming

    const shouldPlayIdleAnimation = isOnGround &&
                                   !isSlashing &&
                                   !isDashing &&
                                   !isLanding &&
                                   !isInAir &&
                                   !isMoving &&
                                   currentAnim !== 'player_idle';

    const shouldPlayMovementAnimation = isOnGround &&
                                       !isSlashing &&
                                       !isDashing &&
                                       !isLanding &&
                                       isMoving &&
                                       canMove;

    const shouldPlayWalkAnimation = shouldPlayMovementAnimation &&
                                   !isRunning &&
                                   currentAnim !== 'player_walk';

    const shouldPlayRunAnimation = shouldPlayMovementAnimation &&
                                  isRunning &&
                                  currentAnim !== 'player_run';

    return {
      shouldAttack,
      shouldSlamAttack,
      shouldJump,
      shouldFall,
      shouldDash,
      shouldBlock,
      isMovingLeft,
      isMovingRight,
      isRunning,
      isMoving,
      justStoppedMoving,

      canMove,

      shouldPlayIdleAnimation,
      shouldPlayMovementAnimation,
      shouldPlayWalkAnimation,
      shouldPlayRunAnimation,

      isSlashing,
      isDashing,
      isLanding,
      isInAir,
      isOnGround
    };
  }
}