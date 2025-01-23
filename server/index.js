const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();


const checkUniqueUsername = async (username) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      return 1;
    }
    return 0; 
  } catch (error) {
    console.error(error);
    return -1;
  }
}

const app = express();
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://whiteboards-three.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Store canvas state per room
const roomCanvasStates = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Send the current canvas state to the newly joined user
    if (roomCanvasStates[roomId]) {
      socket.emit('initializeCanvas', roomCanvasStates[roomId]);
    }
  });

  socket.on('draw', (data) => {
    const { roomId, x0, y0, x1, y1, color } = data;

    // Save the drawing data to the room's canvas state
    if (!roomCanvasStates[roomId]) {
      roomCanvasStates[roomId] = [];
    }
    roomCanvasStates[roomId].push({ x0, y0, x1, y1, color });

    // Broadcast drawing to other users in the room
    socket.to(roomId).emit('draw', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});



// const pool = require('./db');

const pool = new Pool({
  connectionString : process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/save-session', async (req, res) => {
  const { roomId, data, username } = req.body;

  try {
    const user = username === "undefined" ? null : username;
    const query = user ? 
      'INSERT INTO sessions (room_id, data, username) VALUES ($1, $2, $3) RETURNING *' :
      'INSERT INTO sessions (room_id, data) VALUES ($1, $2) RETURNING *';
    const params = user ? [roomId, data, username] : [roomId, data];
    const result = await pool.query(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving session');
  }
});

app.get('/load-session/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE room_id = $1 ORDER BY created_at DESC LIMIT 1',
      [roomId]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Session not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading session');
  }
});

app.get('/load-user-session', async (req, res) => {
  const { username } = req.query;

  try {
    const result = await pool.query(
      'SELECT room_id FROM sessions WHERE username = $1 ORDER BY created_at DESC',
      [username]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).send('Session not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading session');
  }
});
app.post('/create-user', async (req, res) => {
  const {username, password} = req.body;
  const unique = await checkUniqueUsername(username);
  if (unique === 1) {
    res.status(400).send('Username already exists');
    return;
  }
  if (unique === -1) {
    res.status(500).send('Error checking username');
    return;
  }
  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});