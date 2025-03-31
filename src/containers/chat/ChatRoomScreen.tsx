import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socketService from '../../services/SocketService';
import ChatRoom from './ChatRoom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentSessionId, selectHasJoined, selectIsConnected, selectMessages, selectNickname, selectUserIcon, selectUsersTyping } from '../../store/appSlice/appSelectors';
import { addMessage, resetChatState, setConnectionStatus, setCurrentSession, setHasJoined, setUserId, setUsersTyping } from '../../store/appSlice/appSlice';
import Status from '../../components/Status';

const ChatRoomScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const messages = useSelector(selectMessages);
  const usersTyping = useSelector(selectUsersTyping);
  const nickname = useSelector(selectNickname);
  const userIcon = useSelector(selectUserIcon);
  const hasJoined = useSelector(selectHasJoined);
  const isConnected = useSelector(selectIsConnected);
  const currentSessionId = useSelector(selectCurrentSessionId);

  useEffect(() => {
    
    const initSocket = () => {
        const connectionUnsubscribe = socketService.onConnection(() => {
            dispatch(setConnectionStatus(true));
        });
    
        const disconnectionUnsubscribe = socketService.onDisconnection(() => {
            dispatch(setConnectionStatus(false));
            alert("Connection closed. Please reload the app.");
        });

        const userIdUnsubscribe = socketService.onUserId((userId) => {
            dispatch(setUserId(userId));
        });
    
        const messageUnsubscribe = socketService.onMessage((message) => {
            dispatch(addMessage(message))
        });
    
        const typingUnsubscribe = socketService.onTypingUpdate((users) => {
            dispatch(setUsersTyping(users)); 
        });
    
        return () => {
            connectionUnsubscribe();
            disconnectionUnsubscribe();
            messageUnsubscribe();
            userIdUnsubscribe();
            typingUnsubscribe();
        };
    }

    const cleanup = initSocket();
    dispatch(setConnectionStatus(socketService.getConnectionStatus()));
    
    return () => {
        cleanup?.();
        dispatch(resetChatState());
    }
  }, [dispatch, roomId]);


  useEffect(() => {
    const joinRoom = async () => {
      // Only join if we're not already in this session
      if (isConnected && roomId && nickname && !hasJoined && currentSessionId !== roomId) {
        try {
          await socketService.joinChatRoom(nickname, roomId, userIcon);
          dispatch(setHasJoined(true));
          dispatch(setCurrentSession(roomId));
        } catch (error) {
          console.error("Error joining room:", error);
          if (error instanceof Error && error.message.includes("already in a session")) {
            dispatch(setHasJoined(true));
            dispatch(setCurrentSession(roomId));
          } else {
            navigate('/');
          }
        }
      }
    };
    joinRoom();
  }, [isConnected, roomId, nickname, userIcon, hasJoined, currentSessionId]);

  useEffect(() => {
    return () => {
      // Only reset if we're leaving this specific room
      if (currentSessionId === roomId) {
        dispatch(resetChatState());
        dispatch(setCurrentSession(null));
      }
    };
  }, [currentSessionId, roomId]);

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
    <>
        <Status isJoining={true} />
        <ChatRoom
            messages={messages}
            nickname={nickname}
            userIcon={userIcon}
            onSendMessage={handleSendMessage}
            onSetTyping={handleSetTyping}
            usersTyping={usersTyping}
            roomId={roomId}
        />
    </>
  );
};

export default ChatRoomScreen;