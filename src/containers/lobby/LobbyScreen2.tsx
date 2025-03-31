import React, { useState } from 'react';
import CreateRoom from '../../components/CreateRoom';
import JoinRoom from '../../components/JoinRoom';
import './LobbyScreen.css';

interface LobbyScreenProps {
  onCreateRoom: (nickname: string, userIcon?: string) => void;
  onJoinRoom: (roomId: string, nickname: string, userIcon?: string) => void;
  isConnected: boolean;
}

const LobbyScreen2: React.FC<LobbyScreenProps> = ({ onCreateRoom, onJoinRoom, isConnected }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

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
          <CreateRoom onCreateRoom={onCreateRoom} isConnected={isConnected} />
        ) : (
          <JoinRoom onJoinRoom={onJoinRoom} isConnected={isConnected} />
        )}
      </div>
    </div>
  );
};

export default LobbyScreen2;