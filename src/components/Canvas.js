import React, { useRef, useEffect, useState, use } from 'react';
import { io } from 'socket.io-client';
// import '../../styles/globals.css'
const socket = io('https://whiteboards-ac2q.onrender.com');

export default function Canvas({ roomID, load, user }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState('black');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
    
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //     const ctx = canvas.getContext('2d');
  //     ctx.lineCap = 'round';
  //     ctx.lineWidth = 3;
  //     ctx.strokeStyle = 'black';
  //     ctxRef.current = ctx;
  //   }
    
  //   socket.emit('joinRoom', roomID);
    
  //   socket.on('draw', ({ x0, y0, x1, y1, color }) => {
  //     const ctx = ctxRef.current;
  //     if (ctx) {
  //       ctx.strokeStyle = color;
  //       ctx.beginPath();
  //       ctx.moveTo(x0, y0);
  //       ctx.lineTo(x1, y1);
  //       ctx.stroke();
  //     }
  //   });
  //   return () => socket.off('draw');
  // }, [roomID]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black';
      ctxRef.current = ctx;
    }
  
    socket.emit('joinRoom', roomID);
  
    // Handle canvas initialization
    socket.on('initializeCanvas', (canvasState) => {
      const ctx = ctxRef.current;
      if (ctx && canvasState) {
        canvasState.forEach(({ x0, y0, x1, y1, color }) => {
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        });
      }
    });
  
    // Handle drawing updates
    socket.on('draw', ({ x0, y0, x1, y1, color }) => {
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    });
  
    return () => {
      socket.off('initializeCanvas');
      socket.off('draw');
    };
  }, [roomID]);

  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const handleMouseDown = (e) => {
    drawing.current = true;
    const { x, y } = getMousePosition(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const handleMouseMove = (e) => {
    if (!drawing.current) return;
    const ctx = ctxRef.current;
    const { x, y } = getMousePosition(e);
    const x0 = ctx.lastX || x;
    const y0 = ctx.lastY || y;
    const x1 = x;
    const y1 = y;

    ctx.lineTo(x1, y1);
    ctx.stroke();

    socket.emit('draw', { roomId: roomID, x0, y0, x1, y1, color: ctx.strokeStyle });

    ctx.lastX = x1;
    ctx.lastY = y1;
  };

  const handleMouseUp = () => {
    drawing.current = false;
    delete ctxRef.current.lastX;
    delete ctxRef.current.lastY;
  };

  const handleClear = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('clearCanvas', { roomId: roomID }); // Notify the server to clear the canvas for all users in the room
  };

  useEffect(() => {
    socket.on('clearCanvas', () => {
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });
  
    return () => socket.off('clearCanvas');
  }, []);

  const handleColorChange = (e) => {
    setColor(e.target.value);
    ctxRef.current.strokeStyle = e.target.value;
  };

  const saveSession = async () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL(); // Get canvas image as a base64 string
    try {
      const response = await fetch('https://whiteboards-ac2q.onrender.com/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomID, data, username: user }),
      });
      if (response.ok) {
        alert('Session saved successfully!');
      } else {
        alert('Failed to save session.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving session.');
    }
  };

  const loadSession = async () => {
    try {
      const response = await fetch(`https://whiteboards-ac2q.onrender.com/load-session/${roomID}`);
      if (response.ok) {
        const { data } = await response.json();
        const img = new Image();
        img.src = data;
        img.onload = () => {
          const ctx = ctxRef.current;
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0);
          }
        };
      } else {
        alert('No saved session found.');
      }
    } catch (error) {
      console.error(error);
      alert('Error loading session.');
    }
  };

  useEffect(() => {
    if (load) loadSession();
  });

  return (
    <div className="relative w-full h-full bg-gray-500">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-5/6 h-5/6 mx-auto bg-white"
        // style={{ cursor: 'url(/pencil-cursor.png) 0 0, auto' }}
      />
      <div className="absolute bottom-4 left-4 flex space-x-4">
        <button
          onClick={saveSession}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Save Session
        </button>
        <button
          onClick={loadSession}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Load Session
        </button>
        <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
        >
            Clear Board
        </button>
        {isMounted && (
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
