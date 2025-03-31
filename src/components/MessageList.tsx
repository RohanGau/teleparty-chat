import React, { useEffect, useRef } from 'react';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import './MessageList.css';

interface MessageListProps {
  messages: SessionChatMessage[];
  currentUserNickname: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserNickname }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div 
          key={`${message.permId}-${message.timestamp}-${index}`}
          className={`message ${message.isSystemMessage ? 'system-message' : 
                             message.userNickname === currentUserNickname ? 'current-user-message' : 'other-user-message'}`}
        >
          {!message.isSystemMessage && message.userNickname !== currentUserNickname && (
            <div className="message-header">
              {message.userIcon && (
                <div 
                  className="message-avatar" 
                  style={{ backgroundImage: `url(${message.userIcon})` }}
                />
              )}
              <span className="message-nickname">{message.userNickname}</span>
            </div>
          )}
          
          <div className="message-content">
            <p>{message.body}</p>
            <span className="message-time">{formatTimestamp(message.timestamp)}</span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;