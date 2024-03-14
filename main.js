//HTML Elements
const BOARD = document.getElementById('board');
const SCORE_BOARD = document.getElementById('score_board');
const START_BUTTON = document.getElementById('start');
const GAME_OVER = document.getElementById('game_over');

//Game Settings
const boardSize = 10;
const gameSpeed = 100;

const squareTypes = {
    empty_square: 0,
    snake_square: 1,
    food_square: 2
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

//Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snake_square'));
};


/*  Rellena cada cuadrado del tablero
    square: posicion del cuadrado
    type: tipo de cuadrado (empty_square, snake_square, food_square)
*/
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'empty_square') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    )
    .padStart(2, '0');
    const [row, column] = newSquare.split('');

    if(newSquare < 0 ||
        newSquare > boardSize * boardSize || 
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snake_square)) {
            gameOver();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.food_square) {
            addFood();
        } else {
            const empty_square = snake.shift();
            drawSquare(empty_square, 'empty_square');
        }
        drawSnake();
    }
};

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
    emptySquares = [];
};

const gameOver = () => {
    GAME_OVER.style.display = 'block';
    clearInterval(moveInterval);
    START_BUTTON.disabled = false;
};

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code);
            break;
    }
};

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'food_square');
};

const updateScore = () => {
    SCORE_BOARD.innerText = score;
};

const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square empty_square');
            squareElement.setAttribute('id', squareValue);
            BOARD.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
};

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length - 4;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.empty_square));
    console.log(boardSquares);
    BOARD.innerHTML = '';
    emptySquares = [];
    createBoard();
}
 
const startGame = () => {
    setGame();
    GAME_OVER.style.display = 'none';
    START_BUTTON.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
};

START_BUTTON.addEventListener('click', startGame);