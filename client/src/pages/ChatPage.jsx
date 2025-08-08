import React, { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BiSolidSend } from 'react-icons/bi';
import { io } from 'socket.io-client';

import UserDetail from '../components/UserDetail ';
import ChatTopBar from '../components/ChatTopBar ';
import MessageItem from '../components/MessageItem ';

import {
  fetchMessages,
  sendMessage,
} from '../services/operations/messageOperations';
import { fetchUsersInRoom } from '../services/operations/userOperations';
import {
  addMessage
} from '../redux/slices/messagesSlice';

export default function ChatPage() {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Redux selectors
  const messageList = useSelector((state) => state.messages.messages) || [];
  const userList = useSelector((state) => state.users.usersInRoom?.[roomId] || []);
  const USER_ID = useSelector((state) => state.auth.username) || 'unknown';

  // Local state
  const [newMessage, setNewMessage] = useState('');
  const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);

  // --- SOCKET CONNECTION AND LISTENERS ---
  useEffect(() => {
    if (!roomId) return;

    // Create socket connection
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.emit('joinRoom', { roomId, userId: USER_ID });

    // Listen for newMessage from server
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    // Listen for typing indicator
    socket.on('typing', ({ roomId: typingRoomId, userId }) => {
      // console.log('Typing event received:', typingRoomId, userId);
      if (typingRoomId === roomId && userId !== USER_ID) {
        console.log('Someone is typing...');
        setIsSomeoneTyping(true);
      }
    });
    socket.on('stopTyping', ({ roomId: typingRoomId, userId }) => {
      if (typingRoomId === roomId && userId !== USER_ID) {
        setIsSomeoneTyping(false);
      }
    });

    // CLEANUP: leave room and remove listeners on unmount/room change
    return () => {
      socket.emit('leaveRoom', { roomId, userId: USER_ID });
      socket.off('newMessage');
      socket.off('typing');
      socket.off('stopTyping');
      socket.disconnect();
      setIsSomeoneTyping(false);
    };
    console.log('page re-renders')
  }, [dispatch, roomId, USER_ID]);

  // FETCH chat messages and users on room change
  useEffect(() => {
    if (!roomId) return;
    dispatch(fetchMessages(roomId));
    dispatch(fetchUsersInRoom(roomId));
  }, [dispatch, roomId,messageList.length]);

  // Scroll to bottom on messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // console.log('message List is : ' ,messageList)
  }, [messageList]);

  // TYPING INDICATOR EMITTER
  const startTyping = () => {
    if (socketRef.current) {
     
      socketRef.current.emit('typing', { roomId, userId: USER_ID });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('stopTyping', { roomId, userId: USER_ID });
      }
    }, 3000);
  };

  const stopTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('stopTyping', { roomId, userId: USER_ID });
    }
    clearTimeout(typingTimeoutRef.current);
  };

  // SEND MESSAGE - only persist, don't emit via socket (server will emit after saving)
 const handleSendMessage = async () => {
  if (!newMessage.trim()) return;

  socketRef.current.emit('sendMessage', {
    roomId,
    userId: USER_ID,
    content: newMessage.trim(),
  });

  setNewMessage('');
  stopTyping();
};

  // ENTER KEY to send
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sidebar for user list */}
      <div className="flex-1 h-full border-r overflow-y-auto hidden md:flex">
        <UserDetail userList={userList} USER_ID={USER_ID} isSomeoneTyping={isSomeoneTyping} />
      </div>

      {/* Main chat area */}
      <div className="flex-3 flex flex-col justify-between h-full">
        <div className="flex flex-col flex-grow">
          <ChatTopBar ROOM_CODE={roomId} />

          <div
            className="flex flex-col overflow-y-auto p-4 space-y-2 h-[calc(100vh-264px)]"
            ref={scrollRef}
          >
            {messageList.length === 0 && (
              <div className="text-center text-gray-500 italic">No messages yet. Say hi!</div>
            )}
            {messageList.map((data, index) => (
              <MessageItem
                key={data._id || index}
                isAuthor={
                  USER_ID === 
                    (data.sender?.username)
                    ? 'you'
                    : 'other'
                }
                data={{
                  USER_NAME: (data.sender && (data.sender.username || data.sender.name)) || data.USER_NAME || data.username || 'Anonymous',
                  CONTENT: data.CONTENT || data.content,
                  TIME:
                    data.TIME ||
                    new Date(data.createdAt || '').toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  USER_ID: (data.sender && (data.sender.username || data.sender)) || data.USER_ID || data.userId || '',
                }}
              />
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="sticky bottom-2 flex items-center px-4 py-2 border-t bg-white">
          <div className="flex-grow mx-3">
            <textarea
              className="w-full bg-gray-100 text-gray-900 rounded-xl p-2 resize-none outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your message here ..."
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onInput={startTyping}
              onBlur={stopTyping}
            />
          </div>

          <button
            onClick={handleSendMessage}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Send Message"
          >
            <BiSolidSend className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
