import { SessionChatMessage } from "teleparty-websocket-lib";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../interface/types";

const initialState: AppState = {
    roomId: null,
    nickname: '',
    currentSessionId: null,
    userIcon: '',
    isConnected: false,
    hasJoined: false,
    userId: null,
    messages: [],
    usersTyping: []
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setRoomId: (state, action: PayloadAction<string | null>) => {
            state.roomId = action.payload;
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
        },
        setNickname: (state, action: PayloadAction<string>) => {
            state.nickname = action.payload;
        },
        setUserIcon: (state, action: PayloadAction<string | undefined>) => {
            state.userIcon = action.payload;
        },
        setHasJoined: (state, action: PayloadAction<boolean>) => {
            state.hasJoined = action.payload;
        },
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        addMessage: (state, action: PayloadAction<SessionChatMessage>) => {
            state.messages.push(action.payload);
        },
        setUsersTyping: (state, action: PayloadAction<string[]>) => {
            state.usersTyping = action.payload;
        },
        setCurrentSession: (state, action: PayloadAction<string | null>) => {
            state.currentSessionId = action.payload;
        },
        resetChatState: (state) => {
            state.roomId = null;
            state.messages = [];
            state.usersTyping = [];
            state.hasJoined = false;
        }
    },
});

export const {
    setRoomId,
    setUserId,
    setNickname,
    setUserIcon,
    setHasJoined,
    setConnectionStatus,
    addMessage,
    setUsersTyping,
    resetChatState,
    setCurrentSession
} = appSlice.actions;

export default appSlice.reducer;
 