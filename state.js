// Game state management for Xiangqi

// Game state variables
let selectedPiece = null;
let currentPlayer = RED;
let gameOver = false;
let moveHistory = [];
let aiEnabled = false;
let aiThinking = false;

// Reset game state
function resetGameState() {
    selectedPiece = null;
    currentPlayer = RED;
    gameOver = false;
    moveHistory = [];
    aiEnabled = false;
    aiThinking = false;
    updateGameInfo("Red's Turn");
    aiToggleButton.textContent = 'AI Opponent: OFF';
    aiToggleButton.classList.remove('active');
}

// Update game info text
function updateGameInfo(text) {
    gameInfoElement.textContent = text;
} 