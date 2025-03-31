import React from 'react';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';
import './ChatRoom.css';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../store/appSlice/appSelectors';

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
    const currentUserId = useSelector(selectUserId);
    const otherUsersTyping = currentUserId 
    ? usersTyping.filter(id => id !== currentUserId)
    : usersTyping;

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
            
            {otherUsersTyping.length > 0 && (
                <div className="typing-indicator">
                {otherUsersTyping.length === 1
                    ? "Someone is typing..."
                    : "Multiple people are typing..."}
                </div>
            )}
            
            <MessageInput onSendMessage={onSendMessage} onSetTyping={onSetTyping} />
        </div>
    );
};

export default ChatRoom;