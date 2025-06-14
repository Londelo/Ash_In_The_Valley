import type { DaggerBandit } from './index';

export function setupDaggerBanditInput(scene: Phaser.Scene) {
  if (scene.input && scene.input.keyboard) {
    const cursors = scene.input.keyboard.createCursorKeys();
    const inputKeys = scene.input.keyboard.addKeys('R,Q,E,W,SPACE') as { [key: string]: Phaser.Input.Keyboard.Key };
    return { cursors, inputKeys };
  } else {
    throw new Error('Keyboard input plugin is not available.');
  }
}

export interface DaggerBanditInputState {
  // Input actions
  shouldAttack: boolean;
  shouldBatFangAttack: boolean;
  shouldJump: boolean;
  shouldVanish: boolean;
  shouldBlock: boolean;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  isRunning: boolean;
  isMoving: boolean;

  // Movement permissions
  canMove: boolean;

  // Animation conditions
  shouldPlayIdleAnimation: boolean;
  shouldPlayMovementAnimation: boolean;
  shouldPlayRunAnimation: boolean;

  // State checks
  isAttacking: boolean;
  isBatFangAttacking: boolean;
  isVanishing: boolean;
  isAppearing: boolean;
  isInAir: boolean;
  isOnGround: boolean;
}

export function getDaggerBanditInputState(
  bandit: DaggerBandit,
  currentAnim: string | undefined
): DaggerBanditInputState {
  // Extract needed properties from bandit
  const inputKeys = bandit.inputKeys;
  const cursors = bandit.cursors;
  const isOnGround = bandit.isOnGround;
  const wasRunningBeforeJump = bandit.wasRunningBeforeJump;

  // Current state checks
  const isAttacking = currentAnim === 'bandit_attack';
  const isBatFangAttacking = currentAnim === 'bandit_bat_fang_attack';
  const isVanishing = currentAnim === 'bandit_vanish';
  const isAppearing = currentAnim === 'bandit_appear';
  const isInAir = !isOnGround;

  // Input checks - using arrow keys for movement
  const isMovingLeft = cursors.left.isDown;
  const isMovingRight = cursors.right.isDown;
  const isMoving = isMovingLeft || isMovingRight;

  // Running logic: spacebar for running, can only start running on ground, but maintain running state if jumped while running
  const spacePressed = inputKeys.SPACE.isDown;
  const isRunning = spacePressed && (isOnGround || (isInAir && wasRunningBeforeJump));

  // Action conditions
  const shouldAttack = Phaser.Input.Keyboard.JustDown(inputKeys.R) && 
                       isOnGround && 
                       !isAttacking && 
                       !isBatFangAttacking && 
                       !isVanishing && 
                       !isAppearing;

  const shouldBatFangAttack = Phaser.Input.Keyboard.JustDown(inputKeys.E) && 
                              !isAttacking && 
                              !isBatFangAttacking && 
                              !isVanishing && 
                              !isAppearing;

  const shouldVanish = Phaser.Input.Keyboard.JustDown(inputKeys.Q) && 
                       isOnGround && 
                       !isAttacking && 
                       !isBatFangAttacking && 
                       !isVanishing && 
                       !isAppearing;

  const shouldBlock = Phaser.Input.Keyboard.JustDown(inputKeys.W) && 
                      isOnGround && 
                      !isAttacking && 
                      !isBatFangAttacking && 
                      !isVanishing && 
                      !isAppearing;

  const shouldJump = Phaser.Input.Keyboard.JustDown(cursors.up) &&
                     isOnGround &&
                     !isAttacking &&
                     !isBatFangAttacking &&
                     !isVanishing &&
                     !isAppearing;

  // Movement permissions
  const canMove = !isAttacking && 
                  !isBatFangAttacking && 
                  !isVanishing && 
                  !isAppearing;

  // Animation conditions
  const shouldPlayIdleAnimation = isOnGround &&
                                 !isAttacking &&
                                 !isBatFangAttacking &&
                                 !isVanishing &&
                                 !isAppearing &&
                                 !isInAir &&
                                 !isMoving &&
                                 currentAnim !== 'bandit_idle';

  const shouldPlayMovementAnimation = isOnGround &&
                                     !isAttacking &&
                                     !isBatFangAttacking &&
                                     !isVanishing &&
                                     !isAppearing &&
                                     isMoving &&
                                     canMove;

  const shouldPlayRunAnimation = shouldPlayMovementAnimation &&
                                currentAnim !== 'bandit_run';

  return {
    // Input actions
    shouldAttack,
    shouldBatFangAttack,
    shouldJump,
    shouldVanish,
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
    shouldPlayRunAnimation,

    // State checks
    isAttacking,
    isBatFangAttacking,
    isVanishing,
    isAppearing,
    isInAir,
    isOnGround
  };
}