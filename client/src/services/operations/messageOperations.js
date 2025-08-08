import {apiConnector} from '../apiClient';
import { messageEndpoints } from '../api';
import { setLoading, setMessages, addMessage, removeMessage } from '../../redux/slices/messagesSlice';

// Fetch all messages for a specific room
export const fetchMessages = (roomId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const messages = await apiConnector('get', messageEndpoints.GET_MESSAGES(roomId));
    console.log('Fetched messages:', messages.data);
    dispatch(setMessages(messages.data));
  } catch (error) {
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Send a new message in a room
export const sendMessage = (roomId, messageData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const savedMessage = await apiConnector('post', messageEndpoints.SEND_MESSAGE(roomId), messageData);
    console.log('Message sent:', savedMessage.data);
    dispatch(addMessage(savedMessage.data));
    return savedMessage;
  } catch (error) {
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete a message by id
export const deleteMessage = (messageId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await apiConnector('delete', messageEndpoints.DELETE_MESSAGE(messageId));
    dispatch(removeMessage(messageId));
  } catch (error) {
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};
