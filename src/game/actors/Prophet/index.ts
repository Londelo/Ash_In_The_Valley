import { Scene } from 'phaser';
import { createProphetAnimations, addProphetAnimationListeners } from './animations';
import type { Player } from '../Player/index';
import { ChatAI, ChatAIOptions } from '../../components/ChatAI';
import { EventBus } from '../../EventBus';

export class Prophet {
  scene: Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private prophetScale: number = 4;
  private playerRef: Player;
  private readonly DETECTION_RANGE = 400;
  private isPlayerNear: boolean = false;
  private chatAI: ChatAI;
  private inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.playerRef = playerRef;

    this.sprite = scene.physics.add.staticSprite(x, y, 'prophetAtlas', 'prophet_idle_breathe 0');
    this.sprite.setScale(this.prophetScale);
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setDepth(0);

    const chatAIOptions: ChatAIOptions = {
      agentId: 'agent_01jy5e6qfyear8247z07scjnrj',
      onMessageReceived: this.onAIMessageReceived.bind(this),
      onConversationStarted: this.onConversationStarted.bind(this),
      onConversationEnded: this.onConversationEnded.bind(this)
    };
    this.chatAI = new ChatAI(chatAIOptions);
    
    // Listen for player skin changes
    EventBus.on('player_skin_changed', this.handlePlayerSkinChange.bind(this));
    // Listen for location changes
    EventBus.on('location_changed', this.handleLocationChange.bind(this));
  }

  private handlePlayerSkinChange(skin: string): void {
    this.chatAI.updatePlayerSkin(skin);
  }
  
  private handleLocationChange(location: string | null): void {
    this.chatAI.updateLocation(location);
  }

  private setupInputKeys() {
    if (this.scene.input && this.scene.input.keyboard) {
      const inputKeys = this.scene.input.keyboard.addKeys('P') as { [key: string]: Phaser.Input.Keyboard.Key };
      return { inputKeys };
    } else {
      throw new Error('Keyboard input plugin is not available.');
    }
  }

  private getDistanceToPlayer(): number {
    const prophetX = this.sprite.x;
    const playerX = this.playerRef.sprite.x;

    return prophetX - playerX
  }

  public onLookUpComplete() {
    this.sprite.play('prophet_idle_blink');
  }

  public onLookDownComplete() {
    this.sprite.play('prophet_idle_breathe');
  }

  private handlePlayerProximity() {
    const distance = this.getDistanceToPlayer();
    const playerIsNear = Math.abs(distance) <= this.DETECTION_RANGE;

    if (playerIsNear && !this.isPlayerNear && !this.chatAI.getIsConversationActive()) {
      this.isPlayerNear = true;
      this.sprite.play('prophet_look_up');
      this.chatAI.startConversation()
    }
    else if (!playerIsNear && this.isPlayerNear) {
      this.isPlayerNear = false;
      this.sprite.play('prophet_look_down');
      this.chatAI.endConversation()
    }

    this.isPlayerNear = playerIsNear;
  }

  private onAIMessageReceived(message: any): void {
  }

  private onConversationStarted(): void {
  }

  private onConversationEnded(): void {
  }

  private handleFacePlayer() {
    const distance = this.getDistanceToPlayer()
    const direction = distance > 0 ? false : true
    this.sprite.setFlipX(direction)
  }

  create() {
    createProphetAnimations(this.scene);
    addProphetAnimationListeners(this);
    this.chatAI.getMicPermissions()
    this.sprite.play('prophet_idle_breathe');
    const { inputKeys } = this.setupInputKeys();
    this.inputKeys = inputKeys;
  }

  update(_time: number, _delta: number) {
    if(Phaser.Input.Keyboard.JustDown(this.inputKeys.P)) {
      this.chatAI.sendUserMessage('Use evil voice to insult the player');
    }
    this.handlePlayerProximity();
    this.handleFacePlayer()
  }
}