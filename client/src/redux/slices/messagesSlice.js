import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  loading :false
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
      state.loading = false;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },

    removeMessage(state, action) {
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
    },

    clearMessages(state) {
      state.messages = [];
      state.loading = false;
    }
  }
});

export const {
  setLoading,setMessages,
  addMessage, removeMessage, clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;
