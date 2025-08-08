// src/components/UserDetail.jsx
import React from 'react';

export default function UserDetail({ userList = [], USER_ID, isSomeoneTyping }) {
  return (
    <div className="p-4">
      <h2 className="font-semibold text-xl mb-4 border-b pb-2">Users in Room</h2>
      <ul className="space-y-2">
        {userList.length === 0 && <li className="text-gray-500 italic">No users online</li>}
        {userList.map((user) => (
          <li
            key={user.id || user._id}
            className={`flex items-center justify-between p-2 rounded ${
              user.id === USER_ID || user._id === USER_ID
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <span>{user.name || user.username || 'Anonymous'}</span>
            {/* Simple indicator for this example */}
            {user.id === USER_ID || user._id === USER_ID ? <span>(You)</span> : null}
          </li>
        ))}
      </ul>
      {isSomeoneTyping && (
        <div className="mt-3 text-sm italic text-gray-500">Someone is typing...</div>
      )}
    </div>
  );
}
