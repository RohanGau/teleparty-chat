import React, { useState, useRef } from 'react';
import './UserProfile.css';

interface UserProfileProps {
  nickname: string;
  onNicknameChange: (nickname: string) => void;
  userIcon?: string;
  onIconChange: (icon: string | undefined) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  nickname, 
  onNicknameChange, 
  userIcon, 
  onIconChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      setError('Image must be less than 1MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onIconChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="user-profile">
      <div className="icon-section">
        <div 
          className="user-icon" 
          onClick={handleIconClick}
          style={{ backgroundImage: userIcon ? `url(${userIcon})` : 'none' }}
        >
          {!userIcon && (
            <div className="icon-placeholder">
              <span>+</span>
              <span className="icon-text">Add Icon</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="nickname">Nickname:</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          placeholder="Enter your nickname"
          required
        />
      </div>
    </div>
  );
};

export default UserProfile;
