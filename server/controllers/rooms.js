const Room = require('../models/Room');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate, password } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    let passwordHash;
    if (isPrivate) {
      if (!password) {
        return res.status(400).json({ message: 'Password required for private rooms' });
      }
      passwordHash = await bcrypt.hash(password, 10);
    }
     
    const room = new Room({
      name,
      isPrivate: !!isPrivate,
      passwordHash,
      owner: new mongoose.Types.ObjectId(ownerId),
      members: [ownerId],
    });

    await room.save();
    const roomData = await Room.findById(room._id).populate('owner').populate('members');

    res.status(201).json(roomData);
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ message: 'Server error during room creation' });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { id } = req.params; // room id
    const { password } = req.body;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.isPrivate) {
      if (!password) {
        return res.status(400).json({ message: 'Password required to join private room' });
      }
      const isPasswordValid = await bcrypt.compare(password, room.passwordHash);
      if (!isPasswordValid) {
        return res.status(403).json({ message: 'Incorrect room password' });
      }
    }

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    res.json({ message: 'Joined room successfully', room });
  } catch (err) {
    console.error('Join room error:', err);
    res.status(500).json({ message: 'Server error during joining room' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only room owner can delete room' });
    }

    await room.remove();

    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Delete room error:', err);
    res.status(500).json({ message: 'Server error during deleting room' });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    // console.log('Fetching all rooms...');
    const rooms = await Room.find()
      .populate('owner')
      .populate('members');

  //  console.log('Fetched rooms:', rooms);
    res.json(rooms);
  } catch (err) {
    console.error('Get rooms error:', err);
    res.status(500).json({ message: 'Server error fetching rooms' });
  }
};
exports.getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user.id;

    const room = await Room.findById(id)
      .populate('owner')
      .populate('members');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // if (!room.members.includes(userId)) {
    //   return res.status(403).json({ message: 'You are not a member of this room' });
    // }

    res.json(room);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ message: 'Server error fetching room' });
  }
};

