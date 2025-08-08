// src/services/api.js

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// AUTH ENDPOINTS
export const authEndpoints = {
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
};

// ROOM ENDPOINTS
export const roomEndpoints = {
  GET_ALL_ROOMS: `${BASE_URL}/rooms/getRooms`,
  CREATE_ROOM: `${BASE_URL}/rooms/create`,
  JOIN_ROOM: (roomId) => `${BASE_URL}/rooms/${roomId}/join`,
  DELETE_ROOM: (roomId) => `${BASE_URL}/rooms/${roomId}`,
  GET_ROOM: (roomId) => `${BASE_URL}/rooms/getRoom/${roomId}`,
};

// MESSAGE ENDPOINTS
export const messageEndpoints = {
  GET_MESSAGES: (roomId) => `${BASE_URL}/messages/getMessages/${roomId}`,
  DELETE_MESSAGE: (messageId) => `${BASE_URL}/messages/deleteMessage/${messageId}`,
  SEND_MESSAGE: (roomId) => `${BASE_URL}/messages/sendMessage/${roomId}`,
};
