import { Conversation } from '@elevenlabs/client';

export interface ChatAIOptions {
  agentId: string;
  onMessageReceived?: (message: any) => void;
  onConversationStarted?: () => void;
  onConversationEnded?: () => void;
}

export class ChatAI {
  private conversation: Conversation | null = null;
  private isConversationActive: boolean = false;
  private agentId: string;
  private onMessageCallback?: (message: any) => void;
  private onConversationStartedCallback?: () => void;
  private onConversationEndedCallback?: () => void;
  private currentLocation: string | null = null;
  private currentPlayerSkin: string | null = null;

  constructor(options: ChatAIOptions) {
    this.agentId = options.agentId;
    this.onMessageCallback = options.onMessageReceived;
    this.onConversationStartedCallback = options.onConversationStarted;
    this.onConversationEndedCallback = options.onConversationEnded;
  }

  public async getMicPermissions(): Promise<void> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
      } else {
      }
    }
  }

  public async startConversation(overrides?: any): Promise<void> {
    if (this.isConversationActive) {
      return;
    }

    this.conversation = await Conversation.startSession({
      overrides: overrides || {},
      agentId: this.agentId,
      onMessage: this.onMessageReceived.bind(this),
      onError: this.onConversationError.bind(this),
      onConnect: this.onConnect.bind(this),
      onDisconnect: this.onDisconnect.bind(this)
    });

    this.isConversationActive = true;
    this.onConversationStartedCallback?.();
  }

  public async endConversation(): Promise<void> {
    if (!this.conversation || !this.isConversationActive) {
      return;
    }

    try {
      await this.conversation.endSession();
      this.isConversationActive = false;
      this.conversation = null;
      this.onConversationEndedCallback?.();
    } catch (error) {
      this.isConversationActive = false;
      this.conversation = null;
    }
  }

  public sendUserMessage(message: string): void {
    if (!this.conversation || !this.isConversationActive) {
      return;
    }

    try {
      this.conversation.sendUserMessage(message);
    } catch (error) {
    }
  }

  public sendContextualUpdate(update: string): void {
    if (!this.conversation || !this.isConversationActive) {
      return;
    }

    try {
      this.conversation.sendContextualUpdate(update);
    } catch (error) {
    }
  }

  public updateLocation(location: string | null): void {
    if (location === this.currentLocation) return;

    this.currentLocation = location;

    if (this.isConversationActive && location) {
      this.startConversation({agent: {prompt: {prompt: ''}}})
      this.sendContextualUpdate(`Player has entered location: ${location}`);
    }
  }

  public updatePlayerSkin(skin: string): void {
    if (skin === this.currentPlayerSkin) return;

    this.currentPlayerSkin = skin;

    if (this.isConversationActive) {
      this.startConversation({agent: {prompt: {prompt: ''}}})
      this.sendContextualUpdate(`Player has transformed into: ${skin}`);
    }
  }

  public getIsConversationActive(): boolean {
    return this.isConversationActive;
  }

  private onMessageReceived(message: any): void {
    this.onMessageCallback?.(message);
  }

  private onConversationError(error: any): void {
    this.isConversationActive = false;
    this.conversation = null;
  }

  private onConnect(): void {
  }

  private onDisconnect(): void {
    this.isConversationActive = false;
    this.conversation = null;
  }
}
