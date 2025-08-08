import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersInRoom: {},   // { [roomId]: [user, user, ...] }
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when loading starts
      }
    },
    setUsersInRoom(state, action) {
      const { roomId, users } = action.payload;
      state.usersInRoom[roomId] = users;
      state.loading = false;
      state.error = null;
    },
    clearUsersInRoom(state, action) {
      const roomId = action.payload;
      delete state.usersInRoom[roomId];
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setUsersInRoom,
  clearUsersInRoom,
  setError,
} = usersSlice.actions;

export default usersSlice.reducer;
