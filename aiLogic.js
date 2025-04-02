// AI decision-making logic for Xiangqi

// Make AI move - main entry point for AI decision making
function makeAIMove() {
    if (gameOver || currentPlayer !== BLACK || !aiEnabled || aiThinking) return;
    
    console.log("AI is starting to think...");
    aiThinking = true;
    updateGameInfo("AI is thinking...");
    
    const timeoutId = setTimeout(() => {
        try {
            const moves = getAllPossibleMoves(BLACK);
            console.log("AI possible moves:", moves);
            
            if (moves.length > 0) {
                let bestMoves = moves.filter(move => 
                    getPieceAtPosition(move.toX, move.toY) !== null
                );
                
                if (bestMoves.length === 0) {
                    bestMoves = moves;
                }
                
                const randomIndex = Math.floor(Math.random() * bestMoves.length);
                const bestMove = bestMoves[randomIndex];
                console.log("AI selected move:", bestMove);
                
                executeAIMove(bestMove);
            } else {
                console.log("AI couldn't find a valid move");
                if (isInCheck(BLACK)) {
                    updateGameInfo("Checkmate! RED wins!");
                    gameOver = true;
                } else {
                    updateGameInfo("Stalemate! Game is a draw.");
                    gameOver = true;
                }
            }
        } catch (error) {
            console.error("AI error:", error);
            updateGameInfo("AI encountered an error. Try again.");
        } finally {
            aiThinking = false;
            clearTimeout(timeoutId);
            console.log("AI finished thinking.");
        }
    }, 300);
}

// Execute AI's selected move
function executeAIMove(bestMove) {
    console.log("Executing AI move:", bestMove);
    const pieceElement = getPieceAtPosition(bestMove.fromX, bestMove.fromY);
    if (pieceElement) {
        console.log("Piece found for AI move:", pieceElement.dataset);
        movePiece(pieceElement, bestMove.toX, bestMove.toY);
    } else {
        console.error("AI selected a non-existent piece:", bestMove);
        updateGameInfo("AI encountered an error. Try again.");
    }
} 