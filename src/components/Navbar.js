import React, { useState } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
// import '../../styles/globals.css'

const API_URL = 'http://localhost:5000';



export default function Navbar({ isLoggedIn, setIsLoggedIn , showLoginPopup, setShowLoginPopup, username, setUsername, password, setPassword }) {
  const handleLogin = async (username,password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUsername(username);
        setShowLoginPopup(false);
      } else if (response.status === 401) {
        alert('Invalid username or password');
      }
    }
    catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg flex-row justify-between items-center">
      <h1 className="text-xl font-bold">Collaborative Whiteboard</h1>
      
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <span>{username}</span>
            <button onClick={handleLogout} className="text-red-300">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginPopup(!showLoginPopup)}
            className="text-white flex items-center"
          >
            <FaSignInAlt />
            <span className="ml-1">Login</span>
          </button>
        )}

        {showLoginPopup && !isLoggedIn && (
          <div className="absolute top-14 right-0 bg-white text-black p-4 shadow-lg rounded-md w-48">
            <input
              type="text"
              placeholder="Username"
              className="border p-2 mb-2 w-full"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password"
              placeholder="Password"
              className="border p-2 mb-2 w-full" 
              onChange={(e) => setPassword(e.target.value)} // Update this line to handle password input
            >
            </input>
            <button
              onClick={() => handleLogin(username, password)} // Pass the username to handleLogin
              className="bg-blue-500 text-white p-2 w-full rounded-md"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
