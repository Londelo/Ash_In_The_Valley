import { Scene } from 'phaser';
import { createProphetAnimations, addProphetAnimationListeners } from './animations';
import type { Player } from '../Player/index';
import { ChatAI, ChatAIOptions } from '../../components/ChatAI';

export class Prophet {
  scene: Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private prophetScale: number = 4;
  private playerRef: Player;
  private readonly DETECTION_RANGE = 150;
  private isPlayerNear: boolean = false;
  private currentState: 'breathing' | 'looking_up' | 'blinking' | 'looking_down' = 'breathing';
  private chatAI: ChatAI;
  private inputKeys: { [key: string]: Phaser.Input.Keyboard.Key };

  constructor(scene: Scene, x: number, y: number, playerRef: Player) {
    this.scene = scene;
    this.playerRef = playerRef;

    this.sprite = scene.physics.add.staticSprite(x, y, 'prophetAtlas', 'prophet_idle_breathe 0');
    this.sprite.setScale(this.prophetScale);
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.sprite.setDepth(0);

    // Initialize ChatAI with placeholder agent ID
    // TODO: Replace with your actual ElevenLabs agent ID
    const chatAIOptions: ChatAIOptions = {
      agentId: 'agent_01jy5e6qfyear8247z07scjnrj',
      onMessageReceived: this.onAIMessageReceived.bind(this),
      onConversationStarted: this.onConversationStarted.bind(this),
      onConversationEnded: this.onConversationEnded.bind(this)
    };
    this.chatAI = new ChatAI(chatAIOptions);
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
    const prophetY = this.sprite.y;
    const playerX = this.playerRef.sprite.x;
    const playerY = this.playerRef.sprite.y;

    return Math.sqrt(Math.pow(playerX - prophetX, 2) + Math.pow(playerY - prophetY, 2));
  }

  public onLookUpComplete() {
    this.currentState = 'blinking';
    this.sprite.play('prophet_idle_blink');
  }

  public onLookDownComplete() {
    this.currentState = 'breathing';
    this.sprite.play('prophet_idle_breathe');
  }

  private handlePlayerProximity() {
    const distance = this.getDistanceToPlayer();
    const playerIsNear = distance <= this.DETECTION_RANGE;

    // Player just entered range
    if (playerIsNear && !this.isPlayerNear && this.currentState === 'breathing' && !this.chatAI.getIsConversationActive()) {
      this.isPlayerNear = true;
      this.currentState = 'looking_up';
      this.sprite.play('prophet_look_up');

      // Start AI conversation
      this.chatAI.startConversation();
    }
    // Player just left range
    else if (!playerIsNear && this.isPlayerNear && this.currentState === 'blinking' && this.chatAI.getIsConversationActive()) {
      this.isPlayerNear = false;
      this.currentState = 'looking_down';
      this.sprite.play('prophet_look_down');

      // End AI conversation
      // this.chatAI.endConversation();
    }

    this.isPlayerNear = playerIsNear;
  }

  private onAIMessageReceived(message: any): void {
    console.log('Prophet received AI message:', message);
    // TODO: Display message in game UI or handle as needed
    // You could emit an event to show dialogue in the game
  }

  private onConversationStarted(): void {
    console.log('Prophet: AI conversation started');
    // TODO: Add visual feedback that conversation is active
    // Maybe change prophet's appearance or add an indicator
  }

  private onConversationEnded(): void {
    console.log('Prophet: AI conversation ended');
    // TODO: Remove visual feedback
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
      console.log("insult coming")
      this.chatAI.sendUserMessage('Use evil voice to insult the player');
    }
    this.handlePlayerProximity();
  }
}
