import {
  setLoading,
  addRoom,
  clearRooms,
} from '../../redux/slices/roomsSlice';
import {apiConnector} from '../apiClient';
import { roomEndpoints } from '../api';

// Fetch all rooms with loading toggle, clears previous rooms, then adds new rooms one by one.
export const fetchRooms = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const roomsData = await apiConnector('get', roomEndpoints.GET_ALL_ROOMS);
    dispatch(clearRooms());
    const rooms = roomsData.data || [];
    console.log('Fetched rooms:', rooms);
    
    rooms.forEach(room => {
      dispatch(addRoom(room));
    });
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    // You can handle error via toast here or local UI state in component
    console.error('Failed to fetch rooms:', error);
  }
};

// Create a new room and add it to rooms slice
export const createRoom = (roomData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const newRoom = await apiConnector('post', roomEndpoints.CREATE_ROOM, roomData);
    console.log("new room : ",newRoom.data)
    dispatch(addRoom(newRoom.data));
    dispatch(setLoading(false));
    return newRoom;
  } catch (error) {
    dispatch(setLoading(false));
    console.error('Failed to create room:', error);
    throw error; // Throw to allow component-level error handling
  }
};

// Join a room; does NOT update rooms slice but returns response for redirection or errors
export const joinRoom = ({ roomId, password }) => async () => {
  try {
    const response = await apiConnector('post', roomEndpoints.JOIN_ROOM(roomId), { password });
    return response; // likely success message or data
  } catch (error) {
    console.error('Failed to join room:', error);
    throw error;
  }
};
