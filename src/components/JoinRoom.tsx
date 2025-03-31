import React, { useState } from 'react';
import UserProfile from './UserProfile';
import './JoinRoom.css';

interface JoinRoomProps {
  onJoinRoom: (roomId: string, nickname: string, userIcon?: string) => void;
  isConnected: boolean;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom, isConnected }) => {
  const [roomId, setRoomId] = useState('');
  const [nickname, setNickname] = useState('');
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (roomId.trim() && nickname.trim()) {
      onJoinRoom(roomId, nickname, userIcon);
    }
  };

  const handleIconChange = (icon: string | undefined) => {
    setUserIcon(icon);
  };

  return (
    <div className="join-room">
      <h2>Join an Existing Chat Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="roomId">Room ID:</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            required
          />
        </div>
        
        <UserProfile 
          nickname={nickname} 
          onNicknameChange={setNickname} 
          userIcon={userIcon}
          onIconChange={handleIconChange}
        />
        
        <button 
          type="submit" 
          disabled={!isConnected || !roomId.trim() || !nickname.trim()}
          className="join-button"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
