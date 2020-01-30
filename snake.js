const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 16;
let count = 0;
const initialLength = 4;
const snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: initialLength
};
let pause = false;

const scoreElement = document.getElementById('apples');
const finalScore = document.getElementById('final');
const menu = document.getElementById('menu');
const startButton = document.getElementById('start');
startButton.onclick = () => {
    menu.classList.add('hidden');
    pause = false;
};


const apple = {
    x: 320,
    y: 320
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const snakeController = (snake, e) => {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
};

const loop = () => {
    requestAnimationFrame(loop);
    if (++count < 8 || pause) {
        return;
    }

    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    snake.cells.unshift({x: snake.x, y: snake.y});


    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = 'green';


    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    });

    const cell = snake.cells[0];

    if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        updateScore();
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    }


    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        gameOver()
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            gameOver();
        }
    }

    function gameOver() {
        updateScore(0);
        pause = true;
        menu.classList.toggle('hidden');
        updateFinalScore();
        snake.x = 160;
        snake.y = 160;

        snake.cells = [];
        snake.maxCells = initialLength;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    }

    function updateScore(x) {
        scoreElement.innerText = x !== undefined ? x : snake.maxCells - initialLength;
    }
    function updateFinalScore() {
        finalScore.innerText = snake.maxCells - initialLength;
    }
};

document.addEventListener('keydown', (e) => snakeController(snake, e));

requestAnimationFrame(loop);