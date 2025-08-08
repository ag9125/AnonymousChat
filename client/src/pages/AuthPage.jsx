import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../services/operations/authOperations';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const dispatch = useDispatch();
  const { status, error, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ username: false, password: false });
const [justLoggedIn, setJustLoggedIn] = useState(false);
  // Validation checks
  const isUsernameValid = username.trim().length >= 3;
  const isPasswordValid = password.length >= 6;

  // Clear form on mode toggle
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setTouched({ username: false, password: false });
  };

  // Track signup success state locally
  const [signupSuccess, setSignupSuccess] = useState(false);
//   const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!isUsernameValid || !isPasswordValid) return;

    if (isLogin) {
      // Login flow
      try {
        await dispatch(loginUser(username, password));
        toast.success('Login successful!');
        setJustLoggedIn(true);
       
        // loginUser dispatch handles state; token presence triggers useEffect
      } catch {
        // handled by slice error
      }
    } else {
      // Signup flow
      try {
        await dispatch(signupUser(username, password));
        toast.success('Signup successful! Please login.');
        setSignupSuccess(true);
      } catch {
        // handled by slice error
      }
    }
  };

  // After signup success, switch to login mode and clear form
  useEffect(() => {
    if (signupSuccess) {
      setIsLogin(true);
      setUsername('');
      setPassword('');
      setTouched({ username: false, password: false });
      setSignupSuccess(false);
    }
  }, [signupSuccess]);

  // Redirect after successful login (token available)
  useEffect(() => {
    console.log('Token:', token);
    if (token ) {
      navigate('/rooms');
    }
  }, [token,justLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? 'Login to Anonymous Chat' : 'Create an Account'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-center font-medium">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Choose your anonymous username"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                touched.username && !isUsernameValid
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              autoComplete="off"
              disabled={status === 'loading'}
            />
            {touched.username && !isUsernameValid && (
              <p className="text-red-500 text-sm mt-1">Username must be at least 3 characters.</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                touched.password && !isPasswordValid
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              autoComplete="current-password"
              disabled={status === 'loading'}
            />
            {touched.password && !isPasswordValid && (
              <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {status === 'loading' ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : isLogin ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleMode}
            className="text-indigo-600 hover:underline font-semibold"
            disabled={status === 'loading'}
          >
            {isLogin ? 'Sign Up here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}
