import type { Player } from './index';

export function setupPlayerInput(scene: Phaser.Scene) {
  if (scene.input && scene.input.keyboard) {
    const cursors = scene.input.keyboard.createCursorKeys();
    const inputKeys = scene.input.keyboard.addKeys('R,Q,E,W,SPACE') as { [key: string]: Phaser.Input.Keyboard.Key };
    return { cursors, inputKeys };
  } else {
    throw new Error('Keyboard input plugin is not available.');
  }
}

export interface InputState {
  // Input actions
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

  // Movement permissions
  canMove: boolean;

  // Animation conditions
  shouldPlayIdleAnimation: boolean;
  shouldPlayMovementAnimation: boolean;
  shouldPlayWalkAnimation: boolean;
  shouldPlayRunAnimation: boolean;

  // State checks
  isSlashing: boolean;
  isDashing: boolean;
  isLanding: boolean;
  isInAir: boolean;
  isOnGround: boolean;
}

export function getInputState(
  player: Player,
  currentAnim: string | undefined
): InputState {
  // Extract needed properties from player
  const inputKeys = player.inputKeys;
  const cursors = player.cursors;
  const isOnGround = player.sprite.body.onFloor();

  // Current state checks
  const isSlashing = currentAnim === 'player_slash_1' || currentAnim === 'player_slash_2' || currentAnim === 'player_spin_attack';;;
  const isDashing = currentAnim === 'player_dash';
  const isLanding = currentAnim === 'player_land';
  const isSlamming = currentAnim === 'player_slam_attack'
  const isBlocking = currentAnim === 'player_block'
  const isInAir = !isOnGround;

  // Input checks - using arrow keys for movement
  const isMovingLeft = cursors.left.isDown;
  const isMovingRight = cursors.right.isDown;
  const justStoppedMoving = Phaser.Input.Keyboard.JustUp(cursors.left) || Phaser.Input.Keyboard.JustUp(cursors.right)

  const isMoving = isMovingLeft || isMovingRight;

  // Running logic: spacebar for running, can only start running on ground, but maintain running state if jumped while running
  const spacePressed = inputKeys.SPACE.isDown;
  const isRunning = spacePressed && isOnGround;

  // Double-click detection for dash using the reusable utility
  const shouldDash = Phaser.Input.Keyboard.JustDown(inputKeys.Q) &&
                     !isSlamming &&
                     !isSlashing &&
                     !isDashing

  // Action conditions
  const shouldAttack = Phaser.Input.Keyboard.JustDown(inputKeys.R) && isOnGround

  const shouldBlock = Phaser.Input.Keyboard.JustDown(inputKeys.W) && isOnGround && !isBlocking && !isDashing && !isInAir

  const shouldSlamAttack = Phaser.Input.Keyboard.JustDown(inputKeys.E)

  const shouldJump = Phaser.Input.Keyboard.JustDown(cursors.up) &&
                     isOnGround &&
                     !isSlamming &&
                     !isSlashing &&
                     !isDashing

  const shouldFall = player.sprite.body.velocity.y > 0 &&
                     isInAir &&
                     !isSlamming &&
                     !isSlashing &&
                     !isDashing

  // Movement permissions
  const canMove = !isSlashing && !isDashing && !isLanding && !isSlamming

  // Animation conditions
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
    // Input actions
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

    // Movement permissions
    canMove,

    // Animation conditions
    shouldPlayIdleAnimation,
    shouldPlayMovementAnimation,
    shouldPlayWalkAnimation,
    shouldPlayRunAnimation,

    // State checks
    isSlashing,
    isDashing,
    isLanding,
    isInAir,
    isOnGround
  };
}
