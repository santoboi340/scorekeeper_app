const socket = io();

// Elements
const teamAScore = document.getElementById('scoreA');
const teamBScore = document.getElementById('scoreB');
const gameStatus = document.getElementById('gameStatus');
const scoreStatus = document.getElementById('scoreStatus');
const attemptsStatus = document.getElementById('attemptsStatus');

const teamAHeader = document.getElementById('teamAHeader');
const teamBHeader = document.getElementById('teamBHeader');

const teamANameInput = document.getElementById('teamAName');
const teamBNameInput = document.getElementById('teamBName');
const updateTeamAButton = document.getElementById('updateTeamA');
const updateTeamBButton = document.getElementById('updateTeamB');

updateTeamAButton.addEventListener('click', () => {
    if (teamANameInput.value) {
        teamAHeader.textContent = teamANameInput.value;
        socket.emit('updateTeamName', { team: 'A', name: teamANameInput.value });
    }
});

updateTeamBButton.addEventListener('click', () => {
    if (teamBNameInput.value) {
        teamBHeader.textContent = teamBNameInput.value;
        socket.emit('updateTeamName', { team: 'B', name: teamBNameInput.value });
    }
});
