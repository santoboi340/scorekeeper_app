const socket = io(); // Connect to the server

// Get DOM elements for team scores, buttons, and game status
const teamAScore = document.getElementById('scoreA');
const teamBScore = document.getElementById('scoreB');
const gameStatus = document.getElementById('gameStatus');
const scoreStatus = document.getElementById('scoreStatus');
const attemptsStatus = document.getElementById('attemptsStatus');

// Team name elements
const teamAHeader = document.getElementById('teamAHeader');
const teamBHeader = document.getElementById('teamBHeader');

// Team name input fields
const teamANameInput = document.getElementById('teamAName');
const teamBNameInput = document.getElementById('teamBName');

// Update team names
const updateTeamAButton = document.getElementById('updateTeamA');
const updateTeamBButton = document.getElementById('updateTeamB');

updateTeamAButton.addEventListener('click', () => {
  const newNameA = teamANameInput.value;
  if (newNameA) {
    teamAHeader.textContent = newNameA;
    socket.emit('updateTeamName', { team: 'A', name: newNameA });
  }
});

updateTeamBButton.addEventListener('click', () => {
  const newNameB = teamBNameInput.value;
  if (newNameB) {
    teamBHeader.textContent = newNameB;
    socket.emit('updateTeamName', { team: 'B', name: newNameB });
  }
});

// Get player buttons for both teams
const playerA1Button = document.getElementById('playerA1');
const playerA2Button = document.getElementById('playerA2');
const missA1Button = document.getElementById('missA1');
const missA2Button = document.getElementById('missA2');
const playerB1Button = document.getElementById('playerB1');
const playerB2Button = document.getElementById('playerB2');
const missB1Button = document.getElementById('missB1');
const missB2Button = document.getElementById('missB2');

// Initial game state
let scoreA = 0;
let scoreB = 0;
let attemptsA = 0;
let attemptsB = 0;
let currentPlayerA = 1; // Start with Player 1 of Team A
let currentPlayerB = 1; // Start with Player 1 of Team B
let isTeamAServing = true; // Team A starts serving
let totalServes = 0; // Track serves

// Event listeners for buttons to increase scores and switch players
playerA1Button.addEventListener('click', () => {
  if (isTeamAServing && currentPlayerA === 1) {
    scoreA++;
    attemptsA++;
    updateScores();
  }
});

playerA2Button.addEventListener('click', () => {
  if (isTeamAServing && currentPlayerA === 2) {
    scoreA++;
    attemptsA++;
    updateScores();
  }
});

playerB1Button.addEventListener('click', () => {
  if (!isTeamAServing && currentPlayerB === 1) {
    scoreB++;
    attemptsB++;
    updateScores();
  }
});

playerB2Button.addEventListener('click', () => {
  if (!isTeamAServing && currentPlayerB === 2) {
    scoreB++;
    attemptsB++;
    updateScores();
  }
});

// Event listeners for "miss" buttons
missA1Button.addEventListener('click', () => {
  if (isTeamAServing && currentPlayerA === 1) {
    switchPlayerA();
  }
});

missA2Button.addEventListener('click', () => {
  if (isTeamAServing && currentPlayerA === 2) {
    switchPlayerA();
  }
});

missB1Button.addEventListener('click', () => {
  if (!isTeamAServing && currentPlayerB === 1) {
    switchPlayerB();
  }
});

missB2Button.addEventListener('click', () => {
  if (!isTeamAServing && currentPlayerB === 2) {
    switchPlayerB();
  }
});

// Function to update scores and check for game rules
function updateScores() {
  // Emit the score update to the server
  socket.emit('updateScore', { teamA: scoreA, teamB: scoreB });

  // Update the displayed scores locally
  teamAScore.innerText = scoreA;
  teamBScore.innerText = scoreB;

  // Update the attempts
  attemptsStatus.innerText = `Attempts: ${attemptsA} - ${attemptsB}`;

  // Switch the serving player and update game status
  if (++totalServes % 2 === 0) {
    // After every 2 serves, switch the server
    isTeamAServing = !isTeamAServing;
    gameStatus.innerText = `Serving: ${isTeamAServing ? 'Team A' : 'Team B'} - Player ${isTeamAServing ? currentPlayerA : currentPlayerB}`;
    highlightServer();
  }

  // Check if the game should end (team needs 11 points to win by at least 2)
  if (scoreA >= 11 && scoreA - scoreB >= 2) {
    gameStatus.innerText = "Team A Wins!";
    resetGame();
  } else if (scoreB >= 11 && scoreB - scoreA >= 2) {
    gameStatus.innerText = "Team B Wins!";
    resetGame();
  }

  // Update the score status
  scoreStatus.innerText = `Score: ${scoreA} - ${scoreB}`;
}

// Function to reset the game
function resetGame() {
  scoreA = 0;
  scoreB = 0;
  attemptsA = 0;
  attemptsB = 0;
  totalServes = 0;
  currentPlayerA = 1; // Start with Player 1 of Team A
  currentPlayerB = 1; // Start with Player 1 of Team B
  isTeamAServing = true; // Team A starts serving
  setTimeout(() => {
    gameStatus.innerText = "Game Over! Click to Restart.";
    scoreStatus.innerText = "Score: 0 - 0";
  }, 1000);
}

// Function to highlight the current serving player
function highlightServer() {
  // Reset the highlight for both teams
  playerA1Button.classList.remove('serving');
  playerA2Button.classList.remove('serving');
  playerB1Button.classList.remove('serving');
  playerB2Button.classList.remove('serving');

  // Highlight the current server
  if (isTeamAServing) {
    if (currentPlayerA === 1) {
      playerA1Button.classList.add('serving');
    } else {
      playerA2Button.classList.add('serving');
    }
  } else {
    if (currentPlayerB === 1) {
      playerB1Button.classList.add('serving');
    } else {
      playerB2Button.classList.add('serving');
    }
  }
}

// Function to switch player on Team A when they miss
function switchPlayerA() {
  currentPlayerA = currentPlayerA === 1 ? 2 : 1;
  gameStatus.innerText = `Serving: Team A - Player ${currentPlayerA}`;
  highlightServer();
}

// Function to switch player on Team B when they miss
function switchPlayerB() {
  currentPlayerB = currentPlayerB === 1 ? 2 : 1;
  gameStatus.innerText = `Serving: Team B - Player ${currentPlayerB}`;
  highlightServer();
}

// Listen for updated scores from the server
socket.on('updateScore', (data) => {
  console.log('Score updated from server:', data);
  scoreA = data.teamA;
  scoreB = data.teamB;
  teamAScore.innerText = scoreA;
  teamBScore.innerText = scoreB;
});

socket.on('teamNamesUpdated', (names) => {
  teamAHeader.textContent = names.A;
  teamBHeader.textContent = names.B;
});
