import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Canvas from '../../components/Canvas';

// import '../../../styles/globals.css'
const API_URL = 'https://whiteboards-ac2q.onrender.com';

export default function Room() {
  const router = useRouter();
  const { roomId, username, load } = router.query;
  const loadBool = load === 'true';

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-800 text-white p-4 shadow-lg flex-row justify-between items-center">
        <h1 className="text-xl font-bold">Collaborative Whiteboard</h1>
        {username !== 'undefined' && <span>Hi {username}</span>}
      </nav>
      <main className="flex-grow">
        <Canvas roomID={roomId} load={loadBool} user={username}/>
      </main>
    </div>
  );
}