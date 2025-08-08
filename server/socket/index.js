const Message = require('../models/Message');
const Room = require('../models/Room');
const User  = require('../models/User')
module.exports = (io) => {
io.on('connection', (socket) => {
  console.log('User connected, socket id:', socket.id);

  socket.on('joinRoom', ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    io.to(roomId).emit('userJoined', { userId, roomId });
  });

  socket.on('leaveRoom', ({ roomId, userId }) => {
    socket.leave(roomId);
    console.log(`User ${userId} left room ${roomId}`);
    io.to(roomId).emit('userLeft', { userId, roomId });
  });

  socket.on('typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('typing', { roomId, userId });
  });

  socket.on('stopTyping', ({ roomId, userId }) => {
    socket.to(roomId).emit('stopTyping', { roomId, userId });
  });

  socket.on('sendMessage', async ({ roomId, userId, content }) => {
    try {
      const user = await User.findOne({username:userId});

      const message = new Message({ roomId, sender: user._id, content });
      await message.save();

      // Optionally fetch user data here
      // const user = await User.findById(userId);
      const populatedmessage = await message.populate('sender')
      console.log('Message sending in scoket:', populatedmessage);
      io.to(roomId).emit('newMessage', {
       message: populatedmessage,
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  socket.on('deleteMessage', async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      if (message.sender.toString() !== userId) {
        socket.emit('error', { message: 'Not authorized to delete this message' });
        return;
      }

      await message.remove();

      io.to(message.roomId.toString()).emit('messageDeleted', messageId);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected, socket id:', socket.id);
  });
});

};
