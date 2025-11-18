import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer, // Manage user-related state
});

// Configuration for Redux Persist to maintain state across sessions
const persistConfig = {
  key: 'root', // Key to identify persisted data
  storage: AsyncStorage,     // Storage mechanism (local storage in this case)
  version: 1,  // Versioning for persist data
};

// Create a persisted version of the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability checks for actions/state
    }),
});

// Create the persistor to enable persisting the store
export const persistor = persistStore(store);
