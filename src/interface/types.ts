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

export interface AppState {
  roomId: string | null,
  nickname: string,
  userId: null | string,
  hasJoined: boolean;
  userIcon?: string,
  isConnected: boolean;
  messages: SessionChatMessage[];
  usersTyping: string[];
  currentSessionId: string | null;
}
