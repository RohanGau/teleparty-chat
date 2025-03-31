import React, { useState, useEffect } from 'react';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import AppRoutes from './routes/AppRoutes';
import LobbyScreen2 from './containers/lobby/LobbyScreen2';
import ChatRoom2 from './containers/chat/ChatRoom2';
import socketService from './services/SocketService';
import './App.css';
// import AppRoutes from './routes/AppRoutes';


// const App: React.FC = () => {

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Teleparty Chat</h1>
//       </header>
//       <main>
//         <AppRoutes />
//       </main>
//     </div>
//   );
// };

// export default App;


const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to socket service events
    const connectionUnsubscribe = socketService.onConnection(() => {
      setIsConnected(true);
    });

    const disconnectionUnsubscribe = socketService.onDisconnection(() => {
      setIsConnected(false);
      alert("Connection closed. Please reload the app.");
    });

    const messageUnsubscribe = socketService.onMessage((message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    const typingUnsubscribe = socketService.onTypingUpdate((typingUsers) => {
      setUsersTyping(typingUsers);
    });

    // Set initial connection status
    setIsConnected(socketService.getConnectionStatus());

    // Cleanup subscriptions when component unmounts
    return () => {
      connectionUnsubscribe();
      disconnectionUnsubscribe();
      messageUnsubscribe();
      typingUnsubscribe();
    };
  }, []);

  const handleCreateRoom = async (nickname: string, userIcon?: string) => {
    try {
      const newRoomId = await socketService.createChatRoom(nickname, userIcon);
      setRoomId(newRoomId);
      setNickname(nickname);
      setUserIcon(userIcon);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (roomIdToJoin: string, nickname: string, userIcon?: string) => {
    try {
      await socketService.joinChatRoom(nickname, roomIdToJoin, userIcon);
      setRoomId(roomIdToJoin);
      setNickname(nickname);
      setUserIcon(userIcon);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please check the room ID and try again.");
    }
  };

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Teleparty Chat</h1>
      </header>
      <main>
        {!roomId ? (
          <LobbyScreen2 
            onCreateRoom={handleCreateRoom} 
            onJoinRoom={handleJoinRoom}
            isConnected={isConnected}
          />
        ) : (
          <ChatRoom2 
            messages={messages} 
            nickname={nickname}
            userIcon={userIcon}
            onSendMessage={handleSendMessage}
            onSetTyping={handleSetTyping}
            usersTyping={usersTyping}
            roomId={roomId}
          />
        )}
      </main>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Teleparty Chat</h1>
      </header>
      <main>
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;