import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoom from '../../components/CreateRoom';
import JoinRoom from '../../components/JoinRoom';
import socketService from '../../services/SocketService';
import './LobbyScreen.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsConnected } from '../../store/appSlice/appSelectors';
import { setConnectionStatus, setNickname, setRoomId, setUserIcon, setUserId } from '../../store/appSlice/appSlice';
import Status from '../../components/Status';

const LobbyScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const isConnected = useSelector(selectIsConnected);

  useEffect(() => {
    // Subscribe to connection status
    const connectionUnsubscribe = socketService.onConnection(() => {
      dispatch(setConnectionStatus(true));
    });

    const userIdUnsubscribe = socketService.onUserId((userId) => {
      dispatch(setUserId(userId));
    });

    const disconnectionUnsubscribe = socketService.onDisconnection(() => {
      dispatch(setConnectionStatus(false));
      alert("Connection closed. Please reload the app.");
    });

    // Set initial connection status
    dispatch(setConnectionStatus(socketService.getConnectionStatus()));

    return () => {
      connectionUnsubscribe();
      disconnectionUnsubscribe();
      userIdUnsubscribe();
    };
  }, []);

  const handleCreateRoom = async (nickname: string, userIcon?: string) => {
    try {
      const newRoomId = await socketService.createChatRoom(nickname, userIcon);
      // Navigate to the room
      dispatch(setNickname(nickname));
      dispatch(setUserIcon(userIcon || ''));
      dispatch(setRoomId(newRoomId));
      navigate(`/room/${newRoomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (roomIdToJoin: string, nickname: string, userIcon?: string) => {
    try {
      await socketService.joinChatRoom(nickname, roomIdToJoin, userIcon);
      dispatch(setNickname(nickname));
      dispatch(setUserIcon(userIcon || ''));
      dispatch(setRoomId(roomIdToJoin));
      // Navigate to the room
      navigate(`/room/${roomIdToJoin}`);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please check the room ID and try again.");
    }
  };

  return (
    <div className="lobby-container">
      <Status />
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