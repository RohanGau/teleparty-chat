import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoom from '../../components/CreateRoom';
import JoinRoom from '../../components/JoinRoom';
import socketService from '../../services/SocketService';
import './LobbyScreen.css';

const LobbyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to connection status
    const connectionUnsubscribe = socketService.onConnection(() => {
      setIsConnected(true);
    });

    const disconnectionUnsubscribe = socketService.onDisconnection(() => {
      setIsConnected(false);
      alert("Connection closed. Please reload the app.");
    });

    // Set initial connection status
    setIsConnected(socketService.getConnectionStatus());

    return () => {
      connectionUnsubscribe();
      disconnectionUnsubscribe();
    };
  }, []);

  const handleCreateRoom = async (nickname: string, userIcon?: string) => {
    try {
      const newRoomId = await socketService.createChatRoom(nickname, userIcon);
      // Store user info in localStorage for persistence
      localStorage.setItem('teleparty_nickname', nickname);
      if (userIcon) {
        localStorage.setItem('teleparty_userIcon', userIcon);
      }
      // Navigate to the room
      navigate(`/room/${newRoomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (roomIdToJoin: string, nickname: string, userIcon?: string) => {
    try {
      await socketService.joinChatRoom(nickname, roomIdToJoin, userIcon);
      // Store user info in localStorage for persistence
      localStorage.setItem('teleparty_nickname', nickname);
      if (userIcon) {
        localStorage.setItem('teleparty_userIcon', userIcon);
      }
      // Navigate to the room
      navigate(`/room/${roomIdToJoin}`);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please check the room ID and try again.");
    }
  };

  return (
    <div className="lobby-container">
      {!isConnected && (
        <div className="connection-status">
          Connecting to server... Please wait.
        </div>
      )}
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create a Room
        </button>
        <button 
          className={`tab ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          Join a Room
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'create' ? (
          <CreateRoom onCreateRoom={handleCreateRoom} isConnected={isConnected} />
        ) : (
          <JoinRoom onJoinRoom={handleJoinRoom} isConnected={isConnected} />
        )}
      </div>
    </div>
  );
};

export default LobbyScreen;