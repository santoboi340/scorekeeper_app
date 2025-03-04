const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Game state variables
let teamNames = {
  A: 'Team A',
  B: 'Team B',
};
let scores = {
  A: 0,
  B: 0,
};

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected');

  // Emit current team names and scores to the newly connected client
  socket.emit('teamNamesUpdated', teamNames);
  socket.emit('updateScore', scores);

  // Listen for updated team names from the client
  socket.on('updateTeamName', (data) => {
    teamNames[data.team] = data.name;
    io.emit('teamNamesUpdated', teamNames); // Broadcast updated team names to all clients
  });

  // Listen for score updates from the client
  socket.on('updateScore', (data) => {
    scores.A = data.teamA;
    scores.B = data.teamB;

    io.emit('updateScore', scores); // Broadcast updated scores to all clients
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
