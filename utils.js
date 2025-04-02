// Utility functions for Xiangqi game

// Check if a position is valid (within board boundaries)
function isValidPosition(x, y) {
    return x >= 0 && x < BOARD_COLS && y >= 0 && y < BOARD_ROWS;
}

// Get the piece at a specific position
function getPieceAtPosition(x, y) {
    return document.querySelector(`.piece[data-x="${x}"][data-y="${y}"]`);
}

// Check if a position is within the palace for a given color
function isWithinPalace(x, y, color) {
    if (x < 3 || x > 5) return false;
    if (color === RED) {
        return y >= 7 && y <= 9;
    } else {
        return y >= 0 && y <= 2;
    }
}

// Check if a piece has crossed the river
function hasCrossedRiver(y, color) {
    if (color === RED) {
        return y < 5;
    } else {
        return y > 4;
    }
}

// Check if a move is possible for a piece
function isPossibleMove(fromX, fromY, toX, toY) {
    const piece = getPieceAtPosition(fromX, fromY);
    if (!piece) return false;

    // Basic validation
    if (!isValidPosition(toX, toY)) return false;
    
    const targetPiece = getPieceAtPosition(toX, toY);
    if (targetPiece && targetPiece.dataset.color === piece.dataset.color) return false;

    const pieceType = piece.dataset.type;
    const pieceColor = piece.dataset.color;
    
    switch (pieceType) {
        case 'general':
            // Must stay in palace
            if (!isWithinPalace(toX, toY, pieceColor)) return false;
            
            // Can only move one step orthogonally
            const dx = Math.abs(toX - fromX);
            const dy = Math.abs(toY - fromY);
            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                return true;
            }
            return false;

        case 'advisor':
            // Must stay in palace
            if (!isWithinPalace(toX, toY, pieceColor)) return false;
            
            // Can only move one step diagonally
            if (Math.abs(toX - fromX) === 1 && Math.abs(toY - fromY) === 1) {
                return true;
            }
            return false;

        case 'elephant':
            // Cannot cross river
            if (pieceColor === RED && toY < 5) return false;
            if (pieceColor === BLACK && toY > 4) return false;
            
            // Must move exactly two points diagonally
            if (Math.abs(toX - fromX) === 2 && Math.abs(toY - fromY) === 2) {
                // Check if there's a piece at the intervening point
                const midX = (fromX + toX) / 2;
                const midY = (fromY + toY) / 2;
                if (!getPieceAtPosition(midX, midY)) {
                    return true;
                }
            }
            return false;

        case 'horse':
            // Moves one orthogonally then one diagonally
            const orthX = Math.abs(toX - fromX);
            const orthY = Math.abs(toY - fromY);
            if ((orthX === 1 && orthY === 2) || (orthX === 2 && orthY === 1)) {
                // Check if blocked
                const blockX = fromX + (orthX === 2 ? (toX > fromX ? 1 : -1) : 0);
                const blockY = fromY + (orthY === 2 ? (toY > fromY ? 1 : -1) : 0);
                if (!getPieceAtPosition(blockX, blockY)) {
                    return true;
                }
            }
            return false;

        case 'chariot':
            // Can move any distance orthogonally if path is clear
            if (toX === fromX || toY === fromY) {
                const dx = toX > fromX ? 1 : toX < fromX ? -1 : 0;
                const dy = toY > fromY ? 1 : toY < fromY ? -1 : 0;
                let x = fromX + dx;
                let y = fromY + dy;
                
                while (x !== toX || y !== toY) {
                    if (getPieceAtPosition(x, y)) return false;
                    x += dx;
                    y += dy;
                }
                return true;
            }
            return false;

        case 'cannon':
            // Moving without capturing (like chariot)
            if (toX === fromX || toY === fromY) {
                const dx = toX > fromX ? 1 : toX < fromX ? -1 : 0;
                const dy = toY > fromY ? 1 : toY < fromY ? -1 : 0;
                let x = fromX + dx;
                let y = fromY + dy;
                let jumpedOver = false;
                
                while (x !== toX || y !== toY) {
                    if (getPieceAtPosition(x, y)) {
                        if (!targetPiece || jumpedOver) return false;
                        jumpedOver = true;
                    }
                    x += dx;
                    y += dy;
                }
                
                // For capture, must jump exactly one piece
                if (targetPiece) return jumpedOver;
                // For non-capture move, must not jump any pieces
                return !jumpedOver;
            }
            return false;

        case 'soldier':
            // Cannot move backward
            if (pieceColor === RED && toY > fromY) return false;
            if (pieceColor === BLACK && toY < fromY) return false;
            
            // Before crossing river: only forward
            if (!hasCrossedRiver(fromY, pieceColor)) {
                return toX === fromX && Math.abs(toY - fromY) === 1;
            }
            
            // After crossing river: forward or sideways
            return (toX === fromX && Math.abs(toY - fromY) === 1) ||
                   (toY === fromY && Math.abs(toX - fromX) === 1);
    }
    
    return false;
}

// Select a piece
function selectPiece(piece) {
    // Deselect previously selected piece
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
        removePossibleMoves();
    }
    
    selectedPiece = piece;
    piece.classList.add('selected');
    showPossibleMoves(piece);
}

// Deselect the currently selected piece
function deselectPiece() {
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
        removePossibleMoves();
        selectedPiece = null;
    }
}

// Show possible moves for a piece
function showPossibleMoves(piece) {
    const x = parseInt(piece.dataset.x);
    const y = parseInt(piece.dataset.y);
    const pieceType = piece.dataset.type;
    const pieceColor = piece.dataset.color;
    
    // Check all possible positions based on piece type
    for (let toX = 0; toX < BOARD_COLS; toX++) {
        for (let toY = 0; toY < BOARD_ROWS; toY++) {
            if (isPossibleMove(x, y, toX, toY)) {
                const highlight = document.createElement('div');
                highlight.className = 'move-highlight';
                
                // Position the highlight
                highlight.style.left = `${(toX * 100 / (BOARD_COLS - 1))}%`;
                highlight.style.top = `${(toY * 100 / (BOARD_ROWS - 1))}%`;
                highlight.style.transform = 'translate(-50%, -50%)';
                
                // Add click event
                highlight.addEventListener('click', () => {
                    movePiece(selectedPiece, toX, toY);
                });
                
                // If there's a piece that can be captured, add visual indicator
                const targetPiece = getPieceAtPosition(toX, toY);
                if (targetPiece && targetPiece.dataset.color !== pieceColor) {
                    highlight.classList.add('capture-highlight');
                }
                
                boardElement.appendChild(highlight);
            }
        }
    }
}

// Remove all possible move highlights
function removePossibleMoves() {
    const highlights = document.querySelectorAll('.move-highlight');
    highlights.forEach(highlight => highlight.remove());
}

// Move a piece to a new position
function movePiece(piece, toX, toY) {
    if (!piece || !isValidPosition(toX, toY)) return;
    
    const fromX = parseInt(piece.dataset.x);
    const fromY = parseInt(piece.dataset.y);
    
    // Capture any piece at the destination
    const targetPiece = getPieceAtPosition(toX, toY);
    if (targetPiece) {
        targetPiece.remove();
    }
    
    // Update piece position
    piece.dataset.x = toX;
    piece.dataset.y = toY;
    updatePiecePosition(piece);
    
    // Add move to history
    moveHistory.push({
        piece: piece.cloneNode(true),
        fromX,
        fromY,
        toX,
        toY,
        captured: targetPiece ? targetPiece.cloneNode(true) : null
    });
    
    // Deselect the piece
    deselectPiece();
    
    // Switch turns
    currentPlayer = currentPlayer === RED ? BLACK : RED;
    updateGameInfo(`${currentPlayer === RED ? "Red" : "Black"}'s Turn`);
    
    // If AI is enabled and it's black's turn, make AI move
    if (aiEnabled && currentPlayer === BLACK) {
        makeAIMove();
    }
}

// Undo the last move
function undoLastMove() {
    if (moveHistory.length === 0 || aiThinking) return;
    
    const lastMove = moveHistory.pop();
    const piece = getPieceAtPosition(lastMove.toX, lastMove.toY);
    
    if (piece) {
        // Move piece back
        piece.dataset.x = lastMove.fromX;
        piece.dataset.y = lastMove.fromY;
        updatePiecePosition(piece);
        
        // Restore captured piece if any
        if (lastMove.captured) {
            const capturedPiece = lastMove.captured.cloneNode(true);
            capturedPiece.addEventListener('click', handlePieceClick);
            boardElement.appendChild(capturedPiece);
            updatePiecePosition(capturedPiece);
        }
        
        // Switch turns back
        currentPlayer = currentPlayer === RED ? BLACK : RED;
        updateGameInfo(`${currentPlayer === RED ? "Red" : "Black"}'s Turn`);
    }
}

// Toggle AI opponent
function toggleAI() {
    if (aiThinking) return;
    
    aiEnabled = !aiEnabled;
    aiToggleButton.textContent = `AI Opponent: ${aiEnabled ? 'ON' : 'OFF'}`;
    aiToggleButton.classList.toggle('active');
    
    if (aiEnabled && currentPlayer === BLACK) {
        makeAIMove();
    }
}

// Get all possible moves for a color
function getAllPossibleMoves(color) {
    const moves = [];
    const pieces = document.querySelectorAll(`.piece[data-color="${color}"]`);
    
    pieces.forEach(piece => {
        const fromX = parseInt(piece.dataset.x);
        const fromY = parseInt(piece.dataset.y);
        
        // Check all board positions
        for (let toX = 0; toX < BOARD_COLS; toX++) {
            for (let toY = 0; toY < BOARD_ROWS; toY++) {
                if (isPossibleMove(fromX, fromY, toX, toY)) {
                    moves.push({ fromX, fromY, toX, toY });
                }
            }
        }
    });
    
    return moves;
}

// Check if a player is in check
function isInCheck(color) {
    // For now, just return false
    // This would need to be implemented with proper chess rules
    return false;
} 