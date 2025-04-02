// Event listeners and handlers for Xiangqi

// Handle piece click event
function handlePieceClick(event) {
    try {
        if (gameOver || aiThinking || (aiEnabled && currentPlayer === BLACK)) return;
        
        const pieceElement = event.currentTarget;
        if (!pieceElement || !pieceElement.dataset) {
            console.error("Invalid piece element in handlePieceClick");
            return;
        }
        
        const pieceColor = pieceElement.dataset.color;
        const x = parseInt(pieceElement.dataset.x);
        const y = parseInt(pieceElement.dataset.y);
        
        if (!pieceColor || isNaN(x) || isNaN(y)) {
            console.error("Invalid piece data in handlePieceClick");
            return;
        }
        
        // If clicking on a piece of current player's color
        if (pieceColor === currentPlayer) {
            // Deselect if same piece is clicked
            if (selectedPiece === pieceElement) {
                deselectPiece();
            } else {
                // Select the piece
                selectPiece(pieceElement);
            }
        } 
        // If a piece is already selected and clicking on another position
        else if (selectedPiece && isPossibleMove(
            parseInt(selectedPiece.dataset.x),
            parseInt(selectedPiece.dataset.y),
            x, y
        )) {
            // Move the selected piece to the new position
            movePiece(selectedPiece, x, y);
        }
    } catch (error) {
        console.error("Error handling piece click:", error);
        // Reset selection state
        deselectPiece();
    }
}

// Event listeners
newGameButton.addEventListener('click', () => {
    try {
        initGame();
    } catch (error) {
        console.error("Error starting new game:", error);
        alert("Error starting new game. Please reload the page.");
    }
});

undoMoveButton.addEventListener('click', () => {
    try {
        undoLastMove();
    } catch (error) {
        console.error("Error undoing move:", error);
    }
});

aiToggleButton.addEventListener('click', () => {
    try {
        toggleAI();
    } catch (error) {
        console.error("Error toggling AI:", error);
    }
});

instructionsButton.addEventListener('click', () => {
    instructionsModal.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === instructionsModal) {
        instructionsModal.style.display = 'none';
    }
}); 