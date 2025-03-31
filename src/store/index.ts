import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import createSessionStorage from 'redux-persist/lib/storage/session';
import appReducer from "./appSlice/appSlice"

const persistConfig = {
    key: 'root',
    storage: createSessionStorage,
    whitelist: ['nickname', 'userIcon', 'roomId']
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
    reducer: {
        app: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false // Required for redux-persist
    })
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;