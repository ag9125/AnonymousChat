import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomsReducer from './slices/roomsSlice';
import messagesReducer from './slices/messagesSlice';
import usersReducer from './slices/usersSlice'; // Import the users slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    messages: messagesReducer,
    users: usersReducer, // Add the users slice to the store
  },
});
