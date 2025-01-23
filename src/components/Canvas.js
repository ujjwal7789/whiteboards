import React, { useRef, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io('https://whiteboards-ac2q.onrender.com');

/**
 * Canvas Component - A collaborative whiteboard that allows multiple users to draw on the same canvas in real-time.
 * 
 * Props:
 * @param {string} roomID - Unique identifier for the collaboration room.
 * @param {boolean} load - Indicates whether to load a saved session.
 * @param {string} user - Username of the current user.
 */
export default function Canvas({ roomID, load, user }) {
  // Refs for the canvas and its context
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false); // Ref to track if the user is currently drawing

  // State for managing color and component mount status
  const [color, setColor] = useState('black');
  const [isMounted, setIsMounted] = useState(false);

  // Set the mounted state when the component loads
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set up the canvas and socket listeners
  useEffect(() => {
    if (canvasRef.current) {
      // Initialize the canvas size and context
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black';
      ctxRef.current = ctx;
    }

    // Join the specified room via socket
    socket.emit('joinRoom', roomID);

    // Receive and render the initial canvas state from the server
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

    // Listen for drawing updates from other users
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

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off('initializeCanvas');
      socket.off('draw');
    };
  }, [roomID]);

  // Helper function to get mouse position relative to the canvas
  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  // Event handlers for drawing actions
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

    // Draw on the canvas
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Emit the drawing event to other users
    socket.emit('draw', { roomId: roomID, x0, y0, x1, y1, color: ctx.strokeStyle });

    // Save the last position
    ctx.lastX = x1;
    ctx.lastY = y1;
  };

  const handleMouseUp = () => {
    drawing.current = false;
    delete ctxRef.current.lastX;
    delete ctxRef.current.lastY;
  };

  // Clear the canvas and notify other users
  const handleClear = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('clearCanvas', { roomId: roomID });
  };

  // Listen for canvas clear events from the server
  useEffect(() => {
    socket.on('clearCanvas', () => {
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });

    return () => socket.off('clearCanvas');
  }, []);

  // Handle color change
  const handleColorChange = (e) => {
    setColor(e.target.value);
    ctxRef.current.strokeStyle = e.target.value;
  };

  // Save the current canvas session to the server
  const saveSession = async () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();
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

  // Load a saved canvas session from the server
  const loadSession = useCallback(async () => {
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
  }, [roomID]); // Add roomID as a dependency
  
  // Automatically load a saved session if the load prop is true
  useEffect(() => {
    if (load) {
      loadSession();
    }
  }, [load, loadSession]);

  return (
    <div className="relative w-full h-full bg-gray-500">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-5/6 h-5/6 mx-auto bg-white"
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
