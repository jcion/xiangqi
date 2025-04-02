// Functions related to drawing the board

// Initialize game board
function initGame() {
    try {
        // Clear the board
        boardElement.innerHTML = '';
        
        // Add river
        const riverRect = document.createElement('div');
        riverRect.className = 'river';
        riverRect.style.top = `${(100 * 4.5 / BOARD_ROWS)}%`;
        riverRect.style.height = `${(100 * 1 / BOARD_ROWS)}%`;
        riverRect.style.backgroundColor = '#f8d7a3'; // Match board color
        
        const leftText = document.createElement('div');
        leftText.className = 'river-text left';
        leftText.textContent = '楚河';
        
        const rightText = document.createElement('div');
        rightText.className = 'river-text right';
        rightText.textContent = '漢界';
        
        riverRect.appendChild(leftText);
        riverRect.appendChild(rightText);
        boardElement.appendChild(riverRect);
        
        // Draw horizontal lines - exactly 9 lines for 10 rows
        for (let i = 0; i < BOARD_ROWS - 1; i++) {
            const line = document.createElement('div');
            line.className = 'horizontal-line';
            line.style.top = `${(i * (100 / (BOARD_ROWS - 1)))}%`;
            boardElement.appendChild(line);
        }
        
        // Draw vertical lines - exactly 8 lines for 9 columns
        for (let i = 0; i < BOARD_COLS - 1; i++) {
            const upperLine = document.createElement('div');
            upperLine.className = 'vertical-line';
            upperLine.style.left = `${(i * (100 / (BOARD_COLS - 1)))}%`;
            upperLine.style.height = `${(100 * 4.5 / BOARD_ROWS)}%`; // Stop at river top
            
            const lowerLine = document.createElement('div');
            lowerLine.className = 'vertical-line';
            lowerLine.style.left = `${(i * (100 / (BOARD_COLS - 1)))}%`;
            lowerLine.style.top = `${(100 * 5.5 / BOARD_ROWS)}%`;
            lowerLine.style.height = `${(100 * 4.5 / BOARD_ROWS)}%`; // Start from river bottom
            
            boardElement.appendChild(upperLine);
            boardElement.appendChild(lowerLine);
        }
        
        // Add palaces using SVG for better precision
        const palaceSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        palaceSvg.setAttribute("width", "100%");
        palaceSvg.setAttribute("height", "100%");
        palaceSvg.style.position = "absolute";
        palaceSvg.style.top = "0";
        palaceSvg.style.left = "0";
        palaceSvg.style.pointerEvents = "none";
        palaceSvg.style.zIndex = "0"; // Place behind pieces
        
        // Calculate palace coordinates based on intersections
        const gridWidth = 100 / BOARD_COLS;
        
        // Top palace (black) - 3x3 grid in columns 3-5 and rows 0-2
        const blackX1 = 3 * (100 / (BOARD_COLS - 1)); // Left x (column 3)
        const blackX2 = 5 * (100 / (BOARD_COLS - 1)); // Right x (column 5)
        const blackY1 = 0; // Top y (row 0)
        const blackY2 = 2 * (100 / (BOARD_ROWS - 1)); // Bottom y (row 2)
        
        // Bottom palace (red) - 3x3 grid in columns 3-5 and rows 7-9
        const redX1 = 3 * (100 / (BOARD_COLS - 1)); // Left x (column 3)
        const redX2 = 5 * (100 / (BOARD_COLS - 1)); // Right x (column 5)
        const redY1 = 7 * (100 / (BOARD_ROWS - 1)); // Top y (row 7)
        const redY2 = 9 * (100 / (BOARD_ROWS - 1)); // Bottom y (row 9)
        
        // Create rectangle backgrounds for palaces with distinct color
        const blackPalaceRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        blackPalaceRect.setAttribute("x", `${blackX1}%`);
        blackPalaceRect.setAttribute("y", `${blackY1}%`);
        blackPalaceRect.setAttribute("width", `${blackX2 - blackX1 + (100 / BOARD_COLS)}%`);
        blackPalaceRect.setAttribute("height", `${blackY2 - blackY1 + (100 / BOARD_ROWS)}%`);
        blackPalaceRect.setAttribute("fill", "transparent"); // Remove color
        blackPalaceRect.setAttribute("stroke", "none");
        
        const redPalaceRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        redPalaceRect.setAttribute("x", `${redX1}%`);
        redPalaceRect.setAttribute("y", `${redY1}%`);
        redPalaceRect.setAttribute("width", `${redX2 - redX1 + (100 / BOARD_COLS)}%`);
        redPalaceRect.setAttribute("height", `${redY2 - redY1 + (100 / BOARD_ROWS)}%`);
        redPalaceRect.setAttribute("fill", "transparent"); // Remove color
        redPalaceRect.setAttribute("stroke", "none");
        
        // Create diagonal lines for the palaces as described in Wikipedia - connecting opposite corners
        // Black palace diagonal
        const blackDiag1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        blackDiag1.setAttribute("x1", `${blackX1}%`);
        blackDiag1.setAttribute("y1", `${blackY1}%`);
        blackDiag1.setAttribute("x2", `${blackX2}%`);
        blackDiag1.setAttribute("y2", `${blackY2}%`);
        blackDiag1.setAttribute("stroke", "black");
        blackDiag1.setAttribute("stroke-width", "1.5");
        
        const blackDiag2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        blackDiag2.setAttribute("x1", `${blackX2}%`);
        blackDiag2.setAttribute("y1", `${blackY1}%`);
        blackDiag2.setAttribute("x2", `${blackX1}%`);
        blackDiag2.setAttribute("y2", `${blackY2}%`);
        blackDiag2.setAttribute("stroke", "black");
        blackDiag2.setAttribute("stroke-width", "1.5");
        
        // Red palace diagonal
        const redDiag1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        redDiag1.setAttribute("x1", `${redX1}%`);
        redDiag1.setAttribute("y1", `${redY1}%`);
        redDiag1.setAttribute("x2", `${redX2}%`);
        redDiag1.setAttribute("y2", `${redY2}%`);
        redDiag1.setAttribute("stroke", "black");
        redDiag1.setAttribute("stroke-width", "1.5");
        
        const redDiag2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        redDiag2.setAttribute("x1", `${redX2}%`);
        redDiag2.setAttribute("y1", `${redY1}%`);
        redDiag2.setAttribute("x2", `${redX1}%`);
        redDiag2.setAttribute("y2", `${redY2}%`);
        redDiag2.setAttribute("stroke", "black");
        redDiag2.setAttribute("stroke-width", "1.5");
        
        // Correct palace diagonal lines to connect the correct corners
        // Black palace diagonal
        blackDiag1.setAttribute("x2", `${blackX2}%`);
        blackDiag1.setAttribute("y2", `${blackY2}%`);
        blackDiag2.setAttribute("x1", `${blackX2}%`);
        blackDiag2.setAttribute("y1", `${blackY1}%`);

        // Red palace diagonal
        redDiag1.setAttribute("x2", `${redX2}%`);
        redDiag1.setAttribute("y2", `${redY2}%`);
        redDiag2.setAttribute("x1", `${redX2}%`);
        redDiag2.setAttribute("y1", `${redY1}%`);
        
        // Add rectangles and lines to the SVG
        palaceSvg.appendChild(blackPalaceRect);
        palaceSvg.appendChild(redPalaceRect);
        palaceSvg.appendChild(blackDiag1);
        palaceSvg.appendChild(blackDiag2);
        palaceSvg.appendChild(redDiag1);
        palaceSvg.appendChild(redDiag2);
        
        // Add the SVG to the board
        boardElement.appendChild(palaceSvg);
        
        // Initialize pieces
        setupInitialPieces();
        
        // Reset game state
        resetGameState();
        
    } catch (error) {
        console.error("Error initializing game:", error);
        alert("Error initializing game. Please refresh the page.");
    }
} 