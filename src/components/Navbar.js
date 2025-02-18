import React, { useState } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const API_URL = 'https://whiteboards-ac2q.onrender.com';

/**
 * Navbar component to handle user authentication and navigation.
 *
 * Props:
 * @param {boolean} isLoggedIn - Indicates if the user is logged in.
 * @param {function} setIsLoggedIn - Function to update the logged-in status.
 * @param {boolean} showLoginPopup - Indicates if the login popup is visible.
 * @param {function} setShowLoginPopup - Function to toggle the login popup visibility.
 * @param {string} username - The username of the logged-in user.
 * @param {function} setUsername - Function to update the username.
 * @param {string} password - The password entered by the user.
 * @param {function} setPassword - Function to update the password.
 */
export default function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  showLoginPopup,
  setShowLoginPopup,
  username,
  setUsername,
  password,
  setPassword,
}) {
  /**
   * Handles user login by sending a POST request to the server.
   * @param {string} username - The username entered by the user.
   * @param {string} password - The password entered by the user.
   */
  const handleLogin = async (username, password) => {
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
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  /**
   * Handles user logout by clearing authentication data.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  // return (
  //   <nav className="bg-gray-800 text-white p-4 shadow-lg flex-row justify-between items-center">
  //     <h1 className="text-xl font-bold">Collaborative Whiteboard</h1>

  //     <div className="flex items-center space-x-4">
  //       {isLoggedIn ? (
  //         <div className="flex items-center space-x-2">
  //           <span>{username}</span>
  //           <button onClick={handleLogout} className="text-red-300">
  //             <FaSignOutAlt />
  //           </button>
  //         </div>
  //       ) : (
  //         <button
  //           onClick={() => setShowLoginPopup(!showLoginPopup)}
  //           className="text-white flex items-center"
  //         >
  //           <FaSignInAlt />
  //           <span className="ml-1">Login</span>
  //         </button>
  //       )}

  //       {showLoginPopup && !isLoggedIn && (
  //         <div className="absolute top-14 right-0 bg-white text-black p-4 shadow-lg rounded-md w-48">
  //           <input
  //             type="text"
  //             placeholder="Username"
  //             className="border p-2 mb-2 w-full"
  //             onChange={(e) => setUsername(e.target.value)}
  //           />
  //           <input
  //             type="password"
  //             placeholder="Password"
  //             className="border p-2 mb-2 w-full"
  //             onChange={(e) => setPassword(e.target.value)}
  //           />
  //           <button
  //             onClick={() => handleLogin(username, password)}
  //             className="bg-blue-500 text-white p-2 w-full rounded-md"
  //           >
  //             Login
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   </nav>
  // );


  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">Collaborative Whiteboard</h1>

      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium text-lg">{username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginPopup(!showLoginPopup)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        )}

        {showLoginPopup && !isLoggedIn && (
          <div className="absolute top-16 right-4 bg-white text-black p-6 shadow-lg rounded-lg w-60">
            <h3 className="text-lg font-bold mb-2">Login</h3>
            <input
              type="text"
              placeholder="Username"
              className="border p-2 mb-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => handleLogin(username, password)}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

