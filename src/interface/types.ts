import { SessionChatMessage } from 'teleparty-websocket-lib';

export interface User {
  nickname: string;
  icon?: string;
}

export interface ChatRoomState {
  roomId: string | null;
  isConnected: boolean;
  user: User | null;
}

export interface ChatMessage extends SessionChatMessage {
  // Add any additional properties you might need
}

export interface SocketConnectionState {
  isConnected: boolean;
  hasError: boolean;
  errorMessage?: string;
}