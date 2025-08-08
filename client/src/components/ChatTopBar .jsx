// src/components/ChatTopBar.jsx
import React from 'react';

export default function ChatTopBar({ ROOM_CODE }) {
  return (
    <div className="border-b p-4 flex justify-between items-center bg-gray-50 shadow-sm">
      <div className="font-bold text-lg">Room: {ROOM_CODE}</div>
      {/* You can add buttons or status indicators here */}
    </div>
  );
}
