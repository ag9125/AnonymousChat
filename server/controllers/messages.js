const Message = require('../models/Message');
const mongoose = require('mongoose');

exports.getMessagesByRoom = async (req, res) => {
  try {
    const { id } = req.params; // room id

    const messages = await Message.find({ roomId: id })
      .sort({ createdAt: 1 })
      .populate('sender', 'username');

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Only sender can delete their message' });
    }
    //remove message from room messages array
    const roomId = message.roomId;
    const Room = require('../models/Room');
    await Room.updateOne({ _id: roomId }, { $pull: { messages: messageId } });
    await message.remove();

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ message: 'Server error deleting message' });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    // console.log('Sending message:', { roomId, content, userId });
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const message = new Message({
      roomId,
      sender:new mongoose.Types.ObjectId(userId),
      // sender: userId,
      content
    });

    const savedMessage = await message.save();

    // Add message to room's messages array
    const Room = require('../models/Room');
    await Room.updateOne({ _id: roomId }, { $push: { messages: savedMessage._id } });

    // Populate sender info
    await savedMessage.populate('sender');

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error sending message' });
  }
};  
