import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

//import '../../styles/globals.css';



const API_URL = 'https://whiteboards-ac2q.onrender.com';

export default function Home() {
  const router = useRouter();
  const [roomID, setRoomID] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [retypePassword, setRetypePassword] = useState('');
  const [userSessions, setUserSessions] = useState([]);

  const handleCreateRoom = () => {
    const RoomID = Math.random().toString(36).substring(2, 8);
    const user = username ? username : undefined;
    router.push(`/room/${RoomID}?username=${user}&load=false`);
  };

  const handleJoinRoom = () => {
    const user = username ? username : undefined;
    if (roomID) router.push(`/room/${roomID}?username=${user}&load=false`);
  };

  useEffect(() => {
    const getUserSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/load-user-session?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserSessions(data);
        } else if (response.status === 404) {
          setUserSessions(['No saved sessions']);
        }
      }
      catch (error) {
        console.error(error);
        console.log('Error loading user sessions');
      }
    }
    if (isLoggedIn) getUserSessions();
  }, [isLoggedIn, username]);

  const handleSignup = async () => {
    if (password !== retypePassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 400) {
        alert('Username already exists! Try a different username.');
        return;
      }
      if (!response.ok) {
        alert('Error signing up!');
        return;
      }
      else {
        setIsLoggedIn(true);
      }
    }
    catch (error) {
      console.error(error);
      alert('Error signing up!');
    }
  };

  // return (
  //   <div className="items-center justify-between min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 text-gray-900">
  //     <Navbar 
  //       isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} showLoginPopup={showLoginPopup} setShowLoginPopup={setShowLoginPopup}
  //       username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
  //     <main className="flex flex-col items-center justify-center flex-grow px-4 py-8 text-center">
  //       <div className="flex flex-col items-center space-y-6">
  //         <button
  //           onClick={handleCreateRoom}
  //           className="px-8 py-4 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700"
  //         >
  //           Create New Room
  //         </button>
  //         <div className="flex items-center space-x-4">
  //           <input
  //             type="text"
  //             placeholder="Enter Room ID"
  //             value={roomID}
  //             onChange={(e) => setRoomID(e.target.value)}
  //             className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
  //           />
  //           <button
  //             onClick={handleJoinRoom}
  //             className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
  //           >
  //             Join Room
  //           </button>
  //         </div>
  //       </div>
  //       <button
  //         onClick={() => setShowSignupPopup(true)}
  //         className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700"
  //       >
  //         Sign Up
  //       </button>
  //     </main>

  //     {isLoggedIn && (
  //       <>
  //         <span> Previously Saved Sessions </span>
  //         {userSessions.map((session) => (
  //           <div key={session.room_id} className="flex items-center space-x-4">
  //             <span>{session.room_id}</span>
  //             <button
  //               onClick={() => router.push(`/room/${session.room_id}?username=${username}&load=true`)}
  //               className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
  //             >
  //               Load Session
  //             </button>
  //           </div>
  //         ))}
  //       </>
  //     )}

  //     {showSignupPopup && (
  //       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  //         <div className="bg-white p-6 rounded-lg shadow-lg">
  //           <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
  //           <input
  //             type="text"
  //             placeholder="Username"
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //             className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
  //           />
  //           <input
  //             type="password"
  //             placeholder="Password"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
  //           />
  //           <input
  //             type="password"
  //             placeholder="Retype Password"
  //             value={retypePassword}
  //             onChange={(e) => setRetypePassword(e.target.value)}
  //             className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
  //           />
  //           <div className="flex justify-end space-x-4">
  //             <button
  //               onClick={handleSignup}
  //               className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
  //             >
  //               Sign Up
  //             </button>
  //             <button
  //               onClick={() => setShowSignupPopup(false)}
  //               className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
  //             >
  //               Cancel
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 text-gray-900">
      <Navbar 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        showLoginPopup={showLoginPopup}
        setShowLoginPopup={setShowLoginPopup}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-8 text-center">
        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={handleCreateRoom}
            className="px-10 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
          >
            Create New Room
          </button>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinRoom}
              className="px-8 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Join Room
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowSignupPopup(true)}
          className="mt-10 px-8 py-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-400"
        >
          Sign Up
        </button>
      </main>
  
      {isLoggedIn && (
        <section className="px-6 py-4 bg-white rounded-t-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Previously Saved Sessions</h2>
          {userSessions.map((session) => (
            <div
              key={session.room_id}
              className="flex items-center justify-between p-4 mb-2 bg-gray-100 rounded-lg shadow-sm"
            >
              <span className="font-medium text-gray-700">{session.room_id}</span>
              <button
                onClick={() => router.push(`/room/${session.room_id}?username=${username}&load=true`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
              >
                Load Session
              </button>
            </div>
          ))}
        </section>
      )}
  
      {showSignupPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Retype Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSignup}
                className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowSignupPopup(false)}
                className="px-6 py-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}
