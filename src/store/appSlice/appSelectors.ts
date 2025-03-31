import { RootState } from "..";

export const selectRoomId = (state: RootState) => state.app.roomId;
export const selectNickname = (state: RootState) => state.app.nickname;
export const selectUserIcon = (state: RootState) => state.app.userIcon;
export const selectIsConnected = (state: RootState) => state.app.isConnected;
export const selectMessages = (state: RootState) => state.app.messages;
export const selectUsersTyping = (state: RootState) => state.app.usersTyping;
export const selectHasJoined = (state: RootState) => state.app.hasJoined;
export const selectCurrentSessionId = (state: RootState) => state.app.currentSessionId;
export const selectUserId = (state: RootState) => state.app.userId;

export const selectChatRoomData = (state: RootState) => ({
    messages: state.app.messages,
    nickname: state.app.nickname,
    userIcon: state.app.userIcon,
    usersTyping: state.app.usersTyping,
    roomId: state.app.roomId
  });

  
  export const selectLobbyData = (state: RootState) => ({
    isConnected: state.app.isConnected
  });
