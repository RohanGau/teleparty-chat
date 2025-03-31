import React, { useState } from 'react';
import UserProfile from './UserProfile';
import './CreateRoom.css';

interface CreateRoomProps {
  onCreateRoom: (nickname: string, userIcon?: string) => void;
  isConnected: boolean;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreateRoom, isConnected }) => {
  const [nickname, setNickname] = useState('');
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (nickname.trim()) {
      onCreateRoom(nickname, userIcon);
    }
  };

  const handleIconChange = (icon: string | undefined) => {
    setUserIcon(icon);
  };

  return (
    <div className="create-room">
      <h2>Create a New Chat Room</h2>
      <form onSubmit={handleSubmit}>
        <UserProfile 
          nickname={nickname} 
          onNicknameChange={setNickname} 
          userIcon={userIcon}
          onIconChange={handleIconChange}
        />
        
        <button 
          type="submit" 
          disabled={!isConnected || !nickname.trim()}
          className="create-button"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
