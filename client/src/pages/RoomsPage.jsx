import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRooms, createRoom, joinRoom } from '../services/operations/roomOperations';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Modal components (defined below or separately)
import CreateRoomModal from '../components/CreateRoomModal';
import JoinRoomModal from '../components/JoinRoomModal';

export default function RoomsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rooms = useSelector(state => state.rooms.rooms);
  const loading = useSelector(state => state.rooms.loading);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    console.log('Fetching rooms...'); 
    dispatch(fetchRooms());
  }, [dispatch]);

  // Create room handler
  const handleCreateRoom = async (roomData) => {
    try {
      await dispatch(createRoom(roomData));
      toast.success('Room created successfully');
      setShowCreateModal(false);
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Failed to create room');
    }
  };

  // Join room handler
  const handleJoinRoom = async (room, password) => {
    try {
      await dispatch(joinRoom({ roomId: room._id, password }));
      setShowJoinModal(false);
      navigate(`/chat/${room._id}`);
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Failed to join room');
    }
  };

  // Click on a room to join it or open password modal if private
  const onRoomClick = (room) => {
    if (room.isPrivate) {
      setSelectedRoom(room);
      setShowJoinModal(true);
    } else {
      handleJoinRoom(room, null);
    }
  };

  return (
    <div className="min-h-full p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Chat Rooms</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create Room
        </button>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-600">Loading rooms...</div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center text-gray-500">No rooms available. Create one!</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div
            key={room._id}
            tabIndex={0}
            role="button"
            onClick={() => onRoomClick(room)}
            className="cursor-pointer bg-white shadow-md rounded-lg p-5 transition hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900">{room.name}</h2>
            <p className="text-gray-600 mb-3">
              {room.isPrivate ? 'Private Room 🔒' : 'Public Room'}
            </p>
            <p className="text-sm text-gray-500">Owner: {room.owner.username || 'N/A'}</p>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {showJoinModal && selectedRoom && (
        <JoinRoomModal
          room={selectedRoom}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinRoom}
        />
      )}
    </div>
  );
}
