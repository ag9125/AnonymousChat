import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [],
  loading: false,
  
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
     
    },
    // You can keep addRoom and clearRooms reducers
    addRoom(state, action) {
      state.rooms.push(action.payload);
    },
    clearRooms(state) {
      state.rooms = [];
      state.loading = false;
      
    },
  },
});

export const {
  setLoading,
  addRoom,
  clearRooms,
} = roomsSlice.actions;

export default roomsSlice.reducer;
