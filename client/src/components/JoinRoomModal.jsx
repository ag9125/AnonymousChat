import React, { useState } from 'react';

export default function JoinRoomModal({ room, onClose, onJoin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (room.isPrivate && password.trim() === '') {
      setError('Password is required to join this private room');
      return;
    }
    setError('');
    onJoin(room, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Join Private Room</h2>

        <p className="mb-4">Enter password to join <strong>{room.name}</strong></p>

        {error && (
          <div className="mb-3 text-red-600 font-semibold">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomPassword" className="block font-semibold mb-1">
              Password
            </label>
            <input
              id="roomPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room password"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
