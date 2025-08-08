import { loginStart, loginSuccess, loginFailure, logout } from '../../redux/slices/authSlice';
import {apiConnector} from '../apiClient'; // Adjust path as needed
import { authEndpoints } from '../api'; // Your endpoints constants
// import { Navigate } from 'react-router-dom';
// Async thunk action for login
export const loginUser = (username, password) => {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const data = await apiConnector('post', authEndpoints.LOGIN, { username, password });
      // data should contain token as per backend response
      dispatch(loginSuccess({ token: data.data.token, username }));
      console.log('Login successful', data);
    //   Navigate('/rooms'); // Redirect to rooms after successful login
    } catch (error) {
      dispatch(loginFailure(error.data?.message || 'Login failed'));
    }
  };
};

// Async thunk action for signup
export const signupUser = (username, password) => {
  return async (dispatch) => {
    dispatch(loginStart()); // Or create separate signupStart if preferred
    try {
      await apiConnector('post', authEndpoints.SIGNUP, { username, password });
      // After successful signup, optionally auto-login or just inform success
      dispatch(loginSuccess({ token: null, username: null })); // Or omit and handle UI accordingly
    } catch (error) {
      dispatch(loginFailure(error.data?.message || 'Signup failed'));
    }
  };
};

// Optional logout thunk (if you want async logic later)
export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};
