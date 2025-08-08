import {apiConnector} from '../apiClient';
import { roomEndpoints } from '../api'; // Your API endpoints
import { setLoading, setUsersInRoom, setError } from '../../redux/slices/usersSlice';
export const fetchUsersInRoom = (roomId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const roomData = await apiConnector('get', roomEndpoints.GET_ROOM(roomId)); // Fetch full room details
    console.log('Fetched room data:', roomData);
    const users = roomData.data.members || []; // Extract users/members from the room data
     dispatch(setUsersInRoom({ roomId, users }));
    return users;
  } catch (error) {
    throw error;
  }
    finally {
        dispatch(setLoading(false));
    }
};
