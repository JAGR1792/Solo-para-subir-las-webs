// Ciclo hamiltoniano válido para tablero 8x8 (Recorrido del caballo cerrado)
// Este es un ciclo conocido y verificado
const closedTour = [
    [0, 0], [1, 2], [2, 0], [4, 1], [6, 0], [7, 2], [6, 4], [7, 6],
    [5, 7], [3, 6], [1, 7], [0, 5], [1, 3], [0, 1], [2, 2], [3, 0],
    [1, 1], [0, 3], [1, 5], [0, 7], [2, 6], [4, 7], [6, 6], [7, 4],
    [5, 5], [4, 3], [3, 5], [1, 6], [0, 4], [2, 5], [3, 7], [4, 5],
    [2, 4], [3, 2], [5, 3], [3, 4], [4, 2], [2, 3], [4, 4], [5, 2],
    [3, 3], [5, 4], [6, 2], [7, 0], [5, 1], [6, 3], [7, 1], [5, 0],
    [3, 1], [1, 0], [0, 2], [1, 4], [0, 6], [2, 7], [4, 6], [6, 7],
    [7, 5], [5, 6], [7, 7], [6, 5], [7, 3], [6, 1], [4, 0], [2, 1]
];

// Constantes para movimientos del caballo
const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
];

// Variables de estado
let currentTourIndex = 0;
let isRunning = false;
let tourInterval = null;
let board = [];
let currentTour = [];

// Variables para modo manual
let isManualMode = false;
let manualVisited = Array(8).fill().map(() => Array(8).fill(false));
let manualMoveCount = 0;
let manualCurrentRow = -1;
let manualCurrentCol = -1;
let gameActive = false;

// Inicializar el tablero
function initBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    board = [];

    for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.id = `square-${row}-${col}`;
            square.textContent = '';
            square.addEventListener('click', () => handleSquareClick(row, col));
            chessboard.appendChild(square);
            board[row][col] = square;
        }
    }
}

// Manejar clic en casillas
function handleSquareClick(row, col) {
    if (isRunning) return;

    if (isManualMode) {
        handleManualMove(row, col);
    } else {
        setStartPosition(row, col);
    }
}

// Modo manual
function handleManualMove(row, col) {
    if (!gameActive) {
        startManualGame(row, col);
    } else {
        const validMoves = getValidMoves(manualCurrentRow, manualCurrentCol);
        const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

        if (isValidMove) {
            makeManualMove(row, col);
        }
    }
}

function startManualGame(row, col) {
    manualCurrentRow = row;
    manualCurrentCol = col;
    gameActive = true;
    makeManualMove(row, col);
    showPossibleMoves();
}

function makeManualMove(row, col) {
    manualMoveCount++;
    manualVisited[row][col] = true;

    clearKnightPositions();

    if (manualCurrentRow !== row || manualCurrentCol !== col && manualCurrentRow !== -1) {
        board[manualCurrentRow][manualCurrentCol].classList.add('visited');
        board[manualCurrentRow][manualCurrentCol].textContent = manualMoveCount - 1;
    }

    board[row][col].classList.add('knight', 'current');
    board[row][col].innerHTML = '<i class="fas fa-chess-knight"></i>';

    manualCurrentRow = row;
    manualCurrentCol = col;

    updateGameInfo(row, col, manualMoveCount);
    showPossibleMoves();

    if (manualMoveCount === 64) {
        alert('¡Felicitaciones! Has completado el recorrido del caballo!');
        gameActive = false;
        clearPossibleMoves();
    } else if (getValidMoves(row, col).length === 0 && manualMoveCount < 64) {
        alert(`Juego terminado. Has visitado ${manualMoveCount} casillas de 64.`);
        gameActive = false;
        clearPossibleMoves();
    }
}

function isValid(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getValidMoves(row, col) {
    const validMoves = [];
    for (const [dr, dc] of knightMoves) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isValid(newRow, newCol) && !manualVisited[newRow][newCol]) {
            validMoves.push([newRow, newCol]);
        }
    }
    return validMoves;
}

function showPossibleMoves() {
    clearPossibleMoves();

    if (manualCurrentRow !== -1 && manualCurrentCol !== -1 && isManualMode) {
        const validMoves = getValidMoves(manualCurrentRow, manualCurrentCol);
        validMoves.forEach(([row, col]) => {
            board[row][col].classList.add('possible');
        });
    }
}

function clearPossibleMoves() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            board[row][col].classList.remove('possible');
        }
    }
}

function clearKnightPositions() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            board[row][col].classList.remove('knight', 'current');
        }
    }
}

function updateGameInfo(row, col, moveNumber) {
    document.getElementById('currentPos').textContent = `(${row},${col})`;
    document.getElementById('moveNumber').textContent = moveNumber;
    document.getElementById('visitedCount').textContent = moveNumber;
    document.getElementById('remainingCount').textContent = 64 - moveNumber;
    document.getElementById('progress').textContent = Math.round((moveNumber / 64) * 100) + '%';
}

function toggleManualMode() {
    isManualMode = !isManualMode;
    const manualBtn = document.getElementById('manualModeBtn');
    const body = document.body;
    const instructions = document.getElementById('manualInstructions');
    const startControls = document.getElementById('startPositionControls');
    const startControls2 = document.getElementById('startPositionControls2');

    if (isManualMode) {
        manualBtn.innerHTML = '<i class="fas fa-robot"></i> Modo Automático';
        manualBtn.style.backgroundColor = '#27ae60';
        body.classList.add('manual-mode');
        instructions.classList.add('show');
        startControls.style.display = 'none';
        startControls2.style.display = 'none';
        resetBoard();
        clearPossibleMoves();
    } else {
        manualBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Modo Manual';
        manualBtn.style.backgroundColor = '';
        body.classList.remove('manual-mode');
        instructions.classList.remove('show');
        startControls.style.display = 'block';
        startControls2.style.display = 'block';
        resetBoard();
    }
}

// --- Funciones originales de tour automático ---

function setStartPosition(row, col) {
    if (!isRunning) {
        document.getElementById('startRow').value = row;
        document.getElementById('startCol').value = col;
        highlightStartPosition(row, col);
    }
}

function highlightStartPosition(row, col) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            board[r][c].style.border = '2px solid transparent';
        }
    }
    board[row][col].style.border = '2px solid #e74c3c';
}

function getKnightTour(startRow, startCol) {
    const start = [startRow, startCol];
    let startIndex = -1;
    for (let i = 0; i < closedTour.length; i++) {
        if (closedTour[i][0] === start[0] && closedTour[i][1] === start[1]) {
            startIndex = i;
            break;
        }
    }

    if (startIndex === -1) {
        let minDistance = Infinity;
        for (let i = 0; i < closedTour.length; i++) {
            const distance = Math.abs(closedTour[i][0] - start[0]) + Math.abs(closedTour[i][1] - start[1]);
            if (distance < minDistance) {
                minDistance = distance;
                startIndex = i;
            }
        }
    }

    const tour = [...closedTour.slice(startIndex), ...closedTour.slice(0, startIndex)];
    return tour;
}

function startTour() {
    if (isRunning) return;

    const startRow = parseInt(document.getElementById('startRow').value);
    const startCol = parseInt(document.getElementById('startCol').value);

    if (startRow < 0 || startRow > 7 || startCol < 0 || startCol > 7) {
        alert('Por favor, ingresa coordenadas válidas (0-7)');
        return;
    }

    resetBoard();
    currentTour = getKnightTour(startRow, startCol);
    currentTourIndex = 0;
    isRunning = true;

    const speed = parseInt(document.getElementById('speed').value);

    tourInterval = setInterval(() => {
        if (currentTourIndex < currentTour.length) {
            makeMove(currentTour[currentTourIndex], currentTourIndex);
            currentTourIndex++;
        } else {
            isRunning = false;
            clearInterval(tourInterval);
            alert('¡Recorrido completado! El caballo ha visitado todas las casillas.');
        }
    }, speed);
}

function pauseTour() {
    if (tourInterval) {
        clearInterval(tourInterval);
        tourInterval = null;
        isRunning = false;
    } else if (currentTour.length > 0 && currentTourIndex < currentTour.length) {
        isRunning = true;
        const speed = parseInt(document.getElementById('speed').value);

        tourInterval = setInterval(() => {
            if (currentTourIndex < currentTour.length) {
                makeMove(currentTour[currentTourIndex], currentTourIndex);
                currentTourIndex++;
            } else {
                isRunning = false;
                clearInterval(tourInterval);
                alert('¡Recorrido completado!');
            }
        }, speed);
    }
}

function makeMove(position, moveNumber) {
    const [row, col] = position;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            board[r][c].classList.remove('knight', 'current');
        }
    }

    if (moveNumber > 0) {
        const [prevRow, prevCol] = currentTour[moveNumber - 1];
        board[prevRow][prevCol].classList.add('visited');
        board[prevRow][prevCol].textContent = moveNumber;
        board[prevRow][prevCol].innerHTML = moveNumber;
    }

    board[row][col].classList.add('knight', 'current');
    board[row][col].innerHTML = '<i class="fas fa-chess-knight"></i>';

    document.getElementById('currentPos').textContent = `(${row},${col})`;
    document.getElementById('moveNumber').textContent = moveNumber + 1;
    document.getElementById('visitedCount').textContent = moveNumber + 1;
    document.getElementById('remainingCount').textContent = 64 - (moveNumber + 1);
    document.getElementById('progress').textContent = Math.round(((moveNumber + 1) / 64) * 100) + '%';
}

function resetBoard() {
    if (tourInterval) {
        clearInterval(tourInterval);
        tourInterval = null;
    }

    isRunning = false;
    currentTourIndex = 0;
    currentTour = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = board[row][col];
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.textContent = '';
            square.style.border = '2px solid transparent';
        }
    }

    manualVisited = Array(8).fill().map(() => Array(8).fill(false));
    manualMoveCount = 0;
    manualCurrentRow = -1;
    manualCurrentCol = -1;
    gameActive = false;

    document.getElementById('currentPos').textContent = '(0,0)';
    document.getElementById('moveNumber').textContent = '0';
    document.getElementById('visitedCount').textContent = '0';
    document.getElementById('remainingCount').textContent = '64';
    document.getElementById('progress').textContent = '0%';

    if (!isManualMode) {
        const startRow = parseInt(document.getElementById('startRow').value) || 0;
        const startCol = parseInt(document.getElementById('startCol').value) || 0;
        highlightStartPosition(startRow, startCol);
    }

    clearPossibleMoves();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initBoard();
    highlightStartPosition(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    highlightStartPosition(0, 0);

    const toggleBtn = document.getElementById('toggleControlsBtn');
    const controlsPanel = document.getElementById('controls');

    toggleBtn.addEventListener('click', () => {
        controlsPanel.classList.toggle('hidden');
        if (controlsPanel.classList.contains('hidden')) {
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar Controles';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Controles';
        }
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
        }
    });
});
