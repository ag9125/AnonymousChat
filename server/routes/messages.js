const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const messagesController = require('../Controllers/messages');

// Get messages for a specific room
router.get('/getMessages/:id', authMiddleware, messagesController.getMessagesByRoom);

// Delete a message by its ID (only sender can delete)
router.delete('/deleteMessage/:messageId', authMiddleware, messagesController.deleteMessage);

router.post('/sendMessage/:roomId', authMiddleware, messagesController.sendMessage);
module.exports = router;
