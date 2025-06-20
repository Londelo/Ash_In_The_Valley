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

  constructor(options: ChatAIOptions) {
    this.agentId = options.agentId;
    this.onMessageCallback = options.onMessageReceived;
    this.onConversationStartedCallback = options.onConversationStarted;
    this.onConversationEndedCallback = options.onConversationEnded;

  }

  public async getMicPermissions(): Promise<void> {
      try {
      // Request microphone access
      console.log('Requesting microphone access...');
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

    } catch (error) {
      console.error('Failed to start conversation:', error);

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        console.error('Microphone access denied by user');
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        console.error('No microphone found on device');
      } else {
        console.error('Unknown error starting conversation:', error);
      }
    }
  }

  public async startConversation(): Promise<void> {
    if (this.isConversationActive) {
      console.log('Conversation is already active');
      return;
    }

    this.conversation = await Conversation.startSession({
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
      console.log('No active conversation to end');
      return;
    }

    try {
      console.log('Ending ElevenLabs conversation...');
      await this.conversation.endSession();
      this.isConversationActive = false;
      this.conversation = null;
      console.log('ElevenLabs conversation ended successfully');
      this.onConversationEndedCallback?.();
    } catch (error) {
      console.error('Error ending conversation:', error);
      // Force cleanup even if endSession fails
      this.isConversationActive = false;
      this.conversation = null;
    }
  }

  public sendUserMessage(message: string): void {
    if (!this.conversation || !this.isConversationActive) {
      console.warn('Cannot send message: no active conversation');
      return;
    }

    try {
      this.conversation.sendUserMessage(message);
      console.log('User message sent:', message);
    } catch (error) {
      console.error('Error sending user message:', error);
    }
  }

  public sendContextualUpdate(update: string): void {
    if (!this.conversation || !this.isConversationActive) {
      console.warn('Cannot send contextual update: no active conversation');
      return;
    }

    try {
      this.conversation.sendContextualUpdate(update);
      console.log('Contextual update sent:', update);
    } catch (error) {
      console.error('Error sending contextual update:', error);
    }
  }

  public getIsConversationActive(): boolean {
    return this.isConversationActive;
  }

  private onMessageReceived(message: any): void {
    console.log('Message received from AI:', message);
    this.onMessageCallback?.(message);
  }

  private onConversationError(error: any): void {
    console.error('Conversation error:', error);
    // Auto-cleanup on error
    this.isConversationActive = false;
    this.conversation = null;
  }

  private onConnect(): void {
    console.log('ElevenLabs conversation connected');
  }

  private onDisconnect(): void {
    console.log('ElevenLabs conversation disconnected');
    this.isConversationActive = false;
    this.conversation = null;
  }
}
