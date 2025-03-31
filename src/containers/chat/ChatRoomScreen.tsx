import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import socketService from '../../services/SocketService';
import ChatRoom from './ChatRoom';

const ChatRoomScreen: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasJoined, setHasJoined] = useState<boolean>(false);

  useEffect(() => {
    // Load user info from localStorage
    const savedNickname = localStorage.getItem('teleparty_nickname');
    const savedUserIcon = localStorage.getItem('teleparty_userIcon');
    
    if (savedNickname) {
      setNickname(savedNickname);
    }
    
    if (savedUserIcon) {
      setUserIcon(savedUserIcon);
    }

    // Subscribe to connection status
    const connectionUnsubscribe = socketService.onConnection(() => {
      setIsConnected(true);
    });

    const disconnectionUnsubscribe = socketService.onDisconnection(() => {
      setIsConnected(false);
      alert("Connection closed. Please reload the app.");
    });

    // Subscribe to messages
    const messageUnsubscribe = socketService.onMessage((message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Subscribe to typing updates
    const typingUnsubscribe = socketService.onTypingUpdate((typingUsers) => {
      setUsersTyping(typingUsers);
    });

    // Set initial connection status
    setIsConnected(socketService.getConnectionStatus());

    return () => {
      connectionUnsubscribe();
      disconnectionUnsubscribe();
      messageUnsubscribe();
      typingUnsubscribe();
    };
  }, []);

  // Effect to automatically join the room when connection is ready
  useEffect(() => {
    const joinRoom = async () => {
      if (isConnected && roomId && nickname && !hasJoined) {
        try {
          await socketService.joinChatRoom(nickname, roomId, userIcon);
          setHasJoined(true);
        } catch (error) {
          console.error("Error joining room:", error);
          alert("Failed to join room. Returning to lobby.");
          navigate('/');
        }
      }
    };

    joinRoom();
  }, [isConnected, roomId, nickname, userIcon, hasJoined, navigate]);

  // If we don't have a nickname yet but we're on the chat screen,
  // we should redirect to the lobby
  useEffect(() => {
    if (isConnected && !nickname) {
      navigate('/');
    }
  }, [isConnected, nickname, navigate]);

  const handleSendMessage = (message: string) => {
    try {
      socketService.sendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please check your connection.");
    }
  };

  const handleSetTyping = (isTyping: boolean) => {
    try {
      socketService.setTypingStatus(isTyping);
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  if (!roomId) {
    return <div>Invalid room ID. Redirecting...</div>;
  }

  return (
    <div>
      {!isConnected && (
        <div className="connection-status">
          Connecting to server... Please wait.
        </div>
      )}
      
      {isConnected && !hasJoined && nickname && (
        <div className="joining-status">
          Joining room {roomId}... Please wait.
        </div>
      )}
      
      {isConnected && hasJoined && (
        <ChatRoom 
          messages={messages} 
          nickname={nickname}
          userIcon={userIcon}
          onSendMessage={handleSendMessage}
          onSetTyping={handleSetTyping}
          usersTyping={usersTyping}
          roomId={roomId}
        />
      )}
    </div>
  );
};

export default ChatRoomScreen;