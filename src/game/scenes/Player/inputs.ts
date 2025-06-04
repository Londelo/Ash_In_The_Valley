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
  shouldDash: boolean;
  shouldBlock: boolean
  isMovingLeft: boolean;
  isMovingRight: boolean;
  isRunning: boolean;
  isMoving: boolean;

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
  const isOnGround = player.isOnGround;
  const wasRunningBeforeJump = player.wasRunningBeforeJump;

  // Current state checks
  const isSlashing = currentAnim === 'slash_1' || currentAnim === 'slash_2' || currentAnim === 'spin_attack';;;
  const isDashing = currentAnim === 'dash';
  const isLanding = currentAnim === 'land';
  const isSlamming = currentAnim === 'slam_attack'
  const isBlocking = currentAnim === 'block'
  const isInAir = !isOnGround;

  // Input checks - using arrow keys for movement
  const isMovingLeft = cursors.left.isDown;
  const isMovingRight = cursors.right.isDown;
  const isMoving = isMovingLeft || isMovingRight;

  // Running logic: spacebar for running, can only start running on ground, but maintain running state if jumped while running
  const spacePressed = inputKeys.SPACE.isDown;
  const isRunning = spacePressed && (isOnGround || (isInAir && wasRunningBeforeJump));

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

  // Movement permissions
  const canMove = !isSlashing && !isDashing && !isLanding && !isSlamming

  // Animation conditions
  const shouldPlayIdleAnimation = isOnGround &&
                                 !isSlashing &&
                                 !isDashing &&
                                 !isLanding &&
                                 !isInAir &&
                                 !isMoving &&
                                 currentAnim !== 'idle';

  const shouldPlayMovementAnimation = isOnGround &&
                                     !isSlashing &&
                                     !isDashing &&
                                     !isLanding &&
                                     isMoving &&
                                     canMove;

  const shouldPlayWalkAnimation = shouldPlayMovementAnimation &&
                                 !isRunning &&
                                 currentAnim !== 'walk';

  const shouldPlayRunAnimation = shouldPlayMovementAnimation &&
                                isRunning &&
                                currentAnim !== 'run';

  return {
    // Input actions
    shouldAttack,
    shouldSlamAttack,
    shouldJump,
    shouldDash,
    shouldBlock,
    isMovingLeft,
    isMovingRight,
    isRunning,
    isMoving,

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
