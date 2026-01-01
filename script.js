const cells = document.querySelectorAll('[data-cell]');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('.reset-button');
const board = document.querySelector('.board');
const container = document.querySelector('.container');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
};

const handleResultValidation = () => {
    let roundWon = false;
    let winningCombination;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCombination = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        drawWinningLine(winningCombination);
        showCelebration();
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {.
        statusText.textContent = `Draw!`;
        gameActive = false;
        return;
    }

    handlePlayerChange();
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
};

const drawWinningLine = (combination) => {
    const line = document.createElement('div');
    line.classList.add('winning-line');

    const startCell = cells[combination[0]];
    const endCell = cells[combination[2]];
    
    const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
    const startY = startCell.offsetTop + startCell.offsetHeight / 2;
    const endX = endCell.offsetLeft + endCell.offsetWidth / 2;
    const endY = endCell.offsetTop + endCell.offsetHeight / 2;

    const width = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    line.style.top = `${startY}px`;
    line.style.left = `${startX}px`;
    line.style.width = `${width}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';


    board.appendChild(line);
};

const showCelebration = () => {
    const celebration = document.createElement('div');
    celebration.classList.add('celebration');
    container.appendChild(celebration);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * -100}vh`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        celebration.appendChild(confetti);
    }
};

const handleResetGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
    });

    const winningLine = document.querySelector('.winning-line');
    if (winningLine) {
        winningLine.remove();
    }

    const celebration = document.querySelector('.celebration');
    if (celebration) {
        celebration.remove();
    }
};

cells.forEach((cell, index) => {
    cell.setAttribute('data-cell-index', index);
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', handleResetGame);