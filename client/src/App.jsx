// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import RoomsPage from './pages/RoomsPage';
import ChatPage from './pages/ChatPage';
import PrivateRoute from './components/PrivateRoute';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Assuming you have some global styles
import { Toaster } from 'react-hot-toast';

function App() {
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
       <Toaster position="top-center" reverseOrder={false} />
      {/* Show header only if logged in */}
      {token && (
        <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Anonymous Chat</h1>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-sm">Hello, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto p-4">
        <Routes>
          {/* Public Auth route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/chat/:roomId" element={<ChatPage />} />
          </Route>

          {/* Redirects */}
          {/* If user is logged in redirect from /auth to /rooms */}
          <Route
            path="/"
            element={
              token ? <Navigate to="/rooms" /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="*"
            element={
              token ? <Navigate to="/rooms" /> : <Navigate to="/auth" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
