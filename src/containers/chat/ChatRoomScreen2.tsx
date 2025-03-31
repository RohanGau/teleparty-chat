import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import socketService from '../../services/SocketService';
import ChatRoom2 from './ChatRoom2';

const ChatRoomScreen: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const connectionUnsubscribe = socketService.onConnection(() => {
      setIsConnected(true);
    });

    const disconnectionUnsubscribe = socketService.onDisconnection(() => {
      setIsConnected(false);
      alert("Connection closed. Please reload the app.");
    });

    const messageUnsubscribe = socketService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    const typingUnsubscribe = socketService.onTypingUpdate((users) => {
      setUsersTyping(users);
    });

    setIsConnected(socketService.getConnectionStatus());

    return () => {
      connectionUnsubscribe();
      disconnectionUnsubscribe();
      messageUnsubscribe();
      typingUnsubscribe();
    };
  }, []);

  const handleSendMessage = (message: string) => {
    socketService.sendMessage(message);
  };

  const handleSetTyping = (isTyping: boolean) => {
    socketService.setTypingStatus(isTyping);
  };

  if (!roomId) {
    return <div>Invalid room ID. Redirecting...</div>;
  }

  return (
    <ChatRoom2
      messages={messages}
      nickname={nickname}
      userIcon={userIcon}
      onSendMessage={handleSendMessage}
      onSetTyping={handleSetTyping}
      usersTyping={usersTyping}
      roomId={roomId}
    />
  );
};

export default ChatRoomScreen;