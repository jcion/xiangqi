// Game state management for Xiangqi

// Game state variables
let selectedPiece = null;
let currentPlayer = RED;
let gameOver = false;
let moveHistory = [];
let aiEnabled = true;  // Default to AI on
let aiThinking = false;

// Reset game state
function resetGameState() {
    selectedPiece = null;
    currentPlayer = RED;
    gameOver = false;
    moveHistory = [];
    aiEnabled = true;  // Keep AI enabled after reset
    aiThinking = false;
    updateGameInfo("Red's Turn");
    aiToggleButton.textContent = 'AI Opponent: ON';
    aiToggleButton.classList.add('active');
    
    // Reset move tracking
    resetMoveTracking();
    
    // Hide game over modal if it's visible
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.style.display = 'none';
    }
}

// Update game info text
function updateGameInfo(text) {
    gameInfoElement.textContent = text;
} 