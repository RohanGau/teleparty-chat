import { TelepartyClient, SocketEventHandler, SocketMessageTypes, SessionChatMessage } from 'teleparty-websocket-lib';

// Define event types
export type MessageCallback = (message: SessionChatMessage) => void;
export type TypingCallback = (usersTyping: string[]) => void;
export type ConnectionCallback = () => void;
export type UserIdCallback = (userId: string) => void;

export class SocketService {
  private client: TelepartyClient | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private typingCallbacks: TypingCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private disconnectionCallbacks: (() => void)[] = [];
  private userIdCallbacks: UserIdCallback[] = [];
  private isConnected: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        console.log("WebSocket connection established");
        this.isConnected = true;
        this.notifyConnectionCallbacks();
      },
      onClose: () => {
        console.log("WebSocket connection closed");
        this.isConnected = false;
        this.notifyDisconnectionCallbacks();
      },
      onMessage: (message) => {
        console.log("Received message:", message);
        
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          const chatMessage = message.data as SessionChatMessage;
          this.notifyMessageCallbacks(chatMessage);
        } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const typingData = message.data as { anyoneTyping: boolean; usersTyping: string[] };
          this.notifyTypingCallbacks(typingData.usersTyping);
        } else if(message.type === "userId") {
          const userId = message.data.userId;
          this.notifyUserIdCallbacks(userId);
        }
      }
    };

    this.client = new TelepartyClient(eventHandler);
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public async createChatRoom(nickname: string, userIcon?: string): Promise<string> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    
    if (!this.isConnected) {
      throw new Error("Not connected to the server");
    }
    
    return await this.client.createChatRoom(nickname, userIcon);
  }

  public async joinChatRoom(nickname: string, roomId: string, userIcon?: string): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    
    if (!this.isConnected) {
      throw new Error("Not connected to the server");
    }
    
    await this.client.joinChatRoom(nickname, roomId, userIcon);
    return;
  }

  public sendMessage(message: string): void {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    
    this.client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
      body: message
    });
  }

  public setTypingStatus(isTyping: boolean): void {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    
    this.client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: isTyping
    });
  }

  // Event subscription methods
  public onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    
    // Return a function to unsubscribe
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  public onUserId(callback: UserIdCallback): () => void {
    this.userIdCallbacks.push(callback);
    return () => {
      this.userIdCallbacks = this.userIdCallbacks.filter(cb => cb !== callback);
    };
  }

  public onTypingUpdate(callback: TypingCallback): () => void {
    this.typingCallbacks.push(callback);
    
    // Return a function to unsubscribe
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    };
  }

  public onConnection(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.push(callback);
    
    // If already connected, call the callback immediately
    if (this.isConnected) {
      callback();
    }

    // Return a function to unsubscribe
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  public onDisconnection(callback: () => void): () => void {
    this.disconnectionCallbacks.push(callback);
    
    // Return a function to unsubscribe
    return () => {
      this.disconnectionCallbacks = this.disconnectionCallbacks.filter(cb => cb !== callback);
    };
  }

  // Private notification methods
  private notifyMessageCallbacks(message: SessionChatMessage): void {
    this.messageCallbacks.forEach(callback => callback(message));
  }

  private notifyTypingCallbacks(usersTyping: string[]): void {
    this.typingCallbacks.forEach(callback => callback(usersTyping));
  }

  private notifyConnectionCallbacks(): void {
    this.connectionCallbacks.forEach(callback => callback());
  }

  private notifyDisconnectionCallbacks(): void {
    this.disconnectionCallbacks.forEach(callback => callback());
  }

  private notifyUserIdCallbacks(userId: string): void {
    this.userIdCallbacks.forEach(callback => callback(userId));
  }
}

// Create a singleton instance
export const socketService = new SocketService();

// Export default for easier imports
export default socketService;