const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roomsController = require('../Controllers/rooms');

// Get all rooms (no sensitive info)
router.get('/getRooms', authMiddleware, roomsController.getAllRooms);

// Create a new room
router.post('/create', authMiddleware, roomsController.createRoom);

// Join a room (private rooms require password in body)
router.post('/:id/join', authMiddleware, roomsController.joinRoom);

// Delete a room (only owner can delete)
router.delete('/:id', authMiddleware, roomsController.deleteRoom);

// Get room by ID (for chat page)
router.get('/getRoom/:id', authMiddleware, roomsController.getRoom);

module.exports = router;
