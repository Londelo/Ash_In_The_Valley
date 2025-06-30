import type { Player } from './index';

export interface PlayerState {
  shouldAttack: boolean;
  shouldSlamAttack: boolean;
  shouldJump: boolean;
  shouldFall: boolean;
  shouldLand: boolean;
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
  
  // Wall slide states
  shouldWallSlide: boolean;
  shouldWallJump: boolean;
  isWallSliding: boolean;
}

export class State {
  private player: Player;
  private wasInAir: boolean = false;

  constructor(player: Player) {
    this.player = player;
  }

  public isActionAnimations(animKey?: string): boolean {
    if (!animKey) return false;
    return animKey.includes('_player_attack_1') ||
      animKey.includes('_player_attack_2') ||
      animKey.includes('_player_slam_attack') ||
      animKey.includes('_player_dash') ||
      animKey.includes('_player_attack_3') ||
      animKey.includes('_player_roll_attack') ||
      animKey.includes('_player_slash_heavy') ||
      animKey.includes('_player_land') ||
      animKey.includes('_player_heal') ||
      animKey.includes('_player_hit') ||
      animKey.includes('_player_death');
  }

  public isHighPriorityAnimation(animKey?: string): boolean {
    if (!animKey) return false;
    return animKey.includes('_player_land') ||
      animKey.includes('_player_attack_1') ||
      animKey.includes('_player_attack_2') ||
      animKey.includes('_player_slam_attack') ||
      animKey.includes('_player_dash') ||
      animKey.includes('_player_attack_3') ||
      animKey.includes('_player_roll_attack') ||
      animKey.includes('_player_slash_heavy') ||
      animKey.includes('_player_heal') ||
      animKey.includes('_player_hit') ||
      animKey.includes('_player_death');
  }

  private canWallSlide(): boolean {
    return this.player.playerSkin === 'swordMaster' || this.player.playerSkin === 'holySamurai';
  }

  private checkWallCollision(): 'left' | 'right' | null {
    const sprite = this.player.sprite;
    const worldBounds = this.player.scene.physics.world.bounds;
    const tolerance = 10;

    // Check left wall
    if (sprite.x - sprite.displayWidth/2 <= worldBounds.x + tolerance) {
      return 'left';
    }
    
    // Check right wall  
    if (sprite.x + sprite.displayWidth/2 >= worldBounds.width - tolerance) {
      return 'right';
    }

    return null;
  }

  public getState(currentAnim: string | undefined): PlayerState {
    const inputKeys = this.player.inputKeys;
    const cursors = this.player.cursors;
    const isOnGround = this.player.sprite.body.onFloor();

    const isSlashing = !!(currentAnim?.includes('_player_attack_1') || currentAnim?.includes('_player_attack_2') || currentAnim?.includes('_player_attack_3'));
    const isDashing = !!(currentAnim?.includes('_player_dash') || (this.player as any).isDashing);
    const isLanding = !!currentAnim?.includes('_player_land');
    const isSlamming = !!currentAnim?.includes('_player_slam_attack');
    const isBlocking = !!currentAnim?.includes('_player_heal');
    const isInAir = !isOnGround;
    const isWallSliding = !!currentAnim?.includes('_player_wall_hold');

    // Wall slide logic
    const wallCollision = this.checkWallCollision();
    const isMovingLeft = cursors.left.isDown;
    const isMovingRight = cursors.right.isDown;
    
    const shouldWallSlide = this.canWallSlide() && 
                           isInAir && 
                           !isSlashing && 
                           !isDashing && 
                           !isSlamming && 
                           !isLanding &&
                           wallCollision !== null &&
                           ((wallCollision === 'left' && isMovingLeft) || 
                            (wallCollision === 'right' && isMovingRight));

    const shouldWallJump = isWallSliding && 
                          Phaser.Input.Keyboard.JustDown(cursors.up);

    // Track landing state
    const shouldLand = this.wasInAir && isOnGround && !isSlashing && !isDashing && !isSlamming && !isBlocking && !isWallSliding;

    // Update air state tracking
    this.wasInAir = isInAir;

    const justStoppedMoving = Phaser.Input.Keyboard.JustUp(cursors.left) || Phaser.Input.Keyboard.JustUp(cursors.right)

    const isMoving = isMovingLeft || isMovingRight;

    const spacePressed = inputKeys.SPACE.isDown;
    const isRunning = spacePressed && isOnGround;

    const shouldDash = Phaser.Input.Keyboard.JustDown(inputKeys.Q) &&
                       !isSlamming &&
                       !isSlashing &&
                       !isDashing &&
                       !isLanding &&
                       !isWallSliding &&
                       this.player.playerSkin !== 'lordOfFlames'

    const shouldAttack = Phaser.Input.Keyboard.JustDown(inputKeys.R) &&
                        isOnGround &&
                        !isLanding &&
                        !isWallSliding

    const shouldBlock = Phaser.Input.Keyboard.JustDown(inputKeys.W) &&
                       isOnGround &&
                       !isBlocking &&
                       !isDashing &&
                       !isInAir &&
                       !isLanding &&
                       !isWallSliding

    const shouldSlamAttack = Phaser.Input.Keyboard.JustDown(inputKeys.E) && 
                            !isLanding && 
                            !isWallSliding

    const shouldJump = Phaser.Input.Keyboard.JustDown(cursors.up) &&
                       isOnGround &&
                       !isSlamming &&
                       !isSlashing &&
                       !isDashing &&
                       !isLanding &&
                       !isWallSliding &&
                       this.player.playerSkin !== 'lordOfFlames'

    const shouldFall = this.player.sprite.body.velocity.y > 0 &&
                       isInAir &&
                       !isSlamming &&
                       !isSlashing &&
                       !isDashing &&
                       !isLanding &&
                       !shouldWallSlide &&
                       !isWallSliding

    const canMove = !isSlashing && !isDashing && !isLanding && !isSlamming && !isWallSliding

    const shouldPlayIdleAnimation = isOnGround &&
                                   !isSlashing &&
                                   !isDashing &&
                                   !isLanding &&
                                   !isInAir &&
                                   !isMoving &&
                                   !isWallSliding &&
                                   !currentAnim?.includes('_player_idle');

    const shouldPlayMovementAnimation = isOnGround &&
                                       !isSlashing &&
                                       !isDashing &&
                                       !isLanding &&
                                       isMoving &&
                                       canMove;

    const shouldPlayWalkAnimation = shouldPlayMovementAnimation &&
                                   !isRunning &&
                                   !currentAnim?.includes('_player_walk');

    const shouldPlayRunAnimation = shouldPlayMovementAnimation &&
                                  isRunning &&
                                  !currentAnim?.includes('_player_run');

    return {
      shouldAttack,
      shouldSlamAttack,
      shouldJump,
      shouldFall,
      shouldLand,
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
      isOnGround,
      
      shouldWallSlide,
      shouldWallJump,
      isWallSliding
    };
  }
}