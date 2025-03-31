import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LobbyScreen from '../containers/lobby/LobbyScreen';
import ChatRoomScreen from '../containers/chat/ChatRoomScreen';

  const AppRoutes: React.FC = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LobbyScreen />} />
          <Route path="/room/:roomId" element={<ChatRoomScreen />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    );
  };
  
  export default AppRoutes;