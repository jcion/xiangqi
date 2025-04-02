/*
XIANGQI PIECE MOVEMENT RULES - DO NOT MODIFY THESE RULES

General (King):
- Moves one point orthogonally (horizontally or vertically)
- Must stay within the palace (3x3 grid)
- Cannot leave palace (columns 3-5, rows 0-2 for black, 7-9 for red)
- Cannot face the other general directly on the same column with no pieces between

Advisor:
- Moves one point diagonally
- Must stay within the palace (3x3 grid)
- Cannot leave palace (columns 3-5, rows 0-2 for black, 7-9 for red)

Elephant:
- Moves exactly two points diagonally
- Cannot jump over pieces at the intervening point
- Cannot cross the river (stays on own side)
- Red elephants: rows 5-9, Black elephants: rows 0-4

Horse:
- Moves one point orthogonally then one point diagonally outward
- Cannot jump over pieces (blocked if piece is adjacent in orthogonal direction)
- Similar to chess knight but can be blocked

Chariot (Rook):
- Moves any number of points orthogonally (horizontally or vertically)
- Cannot jump over other pieces
- Similar to chess rook

Cannon:
- Moves like chariot when not capturing (any distance orthogonally, cannot jump)
- To capture: must jump exactly one piece (any color) and land on enemy piece
- Only piece that can jump, and only when capturing

Soldier (Pawn):
- Before crossing river: moves one point forward only
- After crossing river: can also move one point horizontally
- Never moves backward
- Red soldiers: start row 6, move up (decreasing y)
- Black soldiers: start row 3, move down (increasing y)
- Cross river at row 5 (middle)
*/

// Core game logic for Xiangqi

// Setup initial piece positions
function setupInitialPieces() {
    // Add pieces - only place pieces within the board boundaries
    const initialPieces = [
        // Red pieces
        {type: 'chariot', color: RED, x: 0, y: 9},
        {type: 'horse', color: RED, x: 1, y: 9},
        {type: 'elephant', color: RED, x: 2, y: 9},
        {type: 'advisor', color: RED, x: 3, y: 9},
        {type: 'general', color: RED, x: 4, y: 9},
        {type: 'advisor', color: RED, x: 5, y: 9},
        {type: 'elephant', color: RED, x: 6, y: 9},
        {type: 'horse', color: RED, x: 7, y: 9},
        {type: 'chariot', color: RED, x: 8, y: 9},
        {type: 'cannon', color: RED, x: 1, y: 7},
        {type: 'cannon', color: RED, x: 7, y: 7},
        {type: 'soldier', color: RED, x: 0, y: 6},
        {type: 'soldier', color: RED, x: 2, y: 6},
        {type: 'soldier', color: RED, x: 4, y: 6},
        {type: 'soldier', color: RED, x: 6, y: 6},
        {type: 'soldier', color: RED, x: 8, y: 6},
        
        // Black pieces
        {type: 'chariot', color: BLACK, x: 0, y: 0},
        {type: 'horse', color: BLACK, x: 1, y: 0},
        {type: 'elephant', color: BLACK, x: 2, y: 0},
        {type: 'advisor', color: BLACK, x: 3, y: 0},
        {type: 'general', color: BLACK, x: 4, y: 0},
        {type: 'advisor', color: BLACK, x: 5, y: 0},
        {type: 'elephant', color: BLACK, x: 6, y: 0},
        {type: 'horse', color: BLACK, x: 7, y: 0},
        {type: 'chariot', color: BLACK, x: 8, y: 0},
        {type: 'cannon', color: BLACK, x: 1, y: 2},
        {type: 'cannon', color: BLACK, x: 7, y: 2},
        {type: 'soldier', color: BLACK, x: 0, y: 3},
        {type: 'soldier', color: BLACK, x: 2, y: 3},
        {type: 'soldier', color: BLACK, x: 4, y: 3},
        {type: 'soldier', color: BLACK, x: 6, y: 3},
        {type: 'soldier', color: BLACK, x: 8, y: 3}
    ];
    
    // Filter to skip any pieces that would be placed outside board boundaries
    const validPieces = initialPieces.filter(piece => 
        piece.x >= 0 && piece.x < BOARD_COLS && 
        piece.y >= 0 && piece.y < BOARD_ROWS
    );
    
    validPieces.forEach(piece => {
        createPieceElement(piece);
    });
}

// Create a piece DOM element
function createPieceElement(piece) {
    const pieceElement = document.createElement('div');
    pieceElement.className = `piece ${piece.color}`;
    pieceElement.dataset.type = piece.type;
    pieceElement.dataset.color = piece.color;
    pieceElement.dataset.x = piece.x;
    pieceElement.dataset.y = piece.y;
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    // Create text element
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50");
    text.setAttribute("y", "65");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "60");
    
    // Add appropriate symbol based on piece type and notation style
    const westernSymbols = {
        'general': '♔',  // King
        'advisor': '♗',  // Bishop
        'elephant': '🐘', // Elephant
        'horse': '♘',    // Knight
        'chariot': '♖',  // Rook
        'cannon': '💣',   // Cannon/Bomb symbol
        'soldier': '♟'   // Back to pawn symbol
    };
    
    const chineseSymbols = {
        'general': piece.color === RED ? '帥' : '將',
        'advisor': piece.color === RED ? '仕' : '士',
        'elephant': piece.color === RED ? '相' : '象',
        'horse': piece.color === RED ? '傌' : '馬',
        'chariot': piece.color === RED ? '俥' : '車',
        'cannon': piece.color === RED ? '炮' : '砲',
        'soldier': piece.color === RED ? '兵' : '卒'
    };
    
    text.textContent = window.useChineseCharacters ? chineseSymbols[piece.type] : westernSymbols[piece.type];
    svg.appendChild(text);
    pieceElement.appendChild(svg);
    
    // Position the piece
    updatePiecePosition(pieceElement);
    
    // Add event listener
    pieceElement.addEventListener('click', handlePieceClick);
    
    boardElement.appendChild(pieceElement);
    return pieceElement;
}

// Position a piece on the board
function updatePiecePosition(pieceElement) {
    const x = parseInt(pieceElement.dataset.x);
    const y = parseInt(pieceElement.dataset.y);
    
    // Position piece directly on grid intersection point (vertex)
    const pieceLeft = (x * 100 / (BOARD_COLS - 1)) + "%";
    const pieceTop = (y * 100 / (BOARD_ROWS - 1)) + "%";
    
    pieceElement.style.left = pieceLeft;
    pieceElement.style.top = pieceTop;
    
    // Set transform to translate from center instead of top-left corner
    pieceElement.style.transform = 'translate(-50%, -50%)';
} 