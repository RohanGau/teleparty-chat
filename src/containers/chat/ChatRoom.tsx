import React from 'react';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';
import './ChatRoom.css';

interface ChatRoomProps {
  messages: SessionChatMessage[];
  nickname: string;
  userIcon?: string;
  onSendMessage: (message: string) => void;
  onSetTyping: (isTyping: boolean) => void;
  usersTyping: string[];
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  nickname,
  userIcon,
  onSendMessage,
  onSetTyping,
  usersTyping,
  roomId
}) => {
  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Chat Room: {roomId}</h2>
        <div className="user-info">
          <span className="user-nickname">{nickname}</span>
          {userIcon && (
            <div 
              className="user-avatar" 
              style={{ backgroundImage: `url(${userIcon})` }}
            />
          )}
        </div>
      </div>

      <MessageList messages={messages} currentUserNickname={nickname} />
      
      <div className="typing-indicator">
        {usersTyping.length > 0 && usersTyping.length === 1
          ? "Someone is typing..."
          : usersTyping.length > 1
            ? "Multiple people are typing..."
            : ""}
      </div>
      
      <MessageInput onSendMessage={onSendMessage} onSetTyping={onSetTyping} />
    </div>
  );
};

export default ChatRoom;