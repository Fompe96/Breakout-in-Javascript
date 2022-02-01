const canvas = document.getElementById('gameArea');
const gameArea = canvas.getContext('2d');

// Constants for determining paddle size based on canvas size
const paddleWidth = canvas.width * 0.25; 
const paddleHeight = canvas.height * 0.04;
const paddleBottomMargin = canvas.height * 0.05;

// Object literal containing all values of the paddle
const paddle = {
  xPos: canvas.width / 2 - paddleWidth / 2, // Starting x position of paddle
  yPos: ((canvas.height) - paddleHeight) - paddleBottomMargin, // Starting y position of paddle
  width: paddleWidth,
  height: paddleHeight,
  movement: 5 // How much the paddle will move
};

let movingLeft = false;
let movingRight = false;

const paddleColor = 'rgb(240, 240, 240)'
const matrixGreen = 'rgb(21, 247, 0)';

function gameLoop() {
  displayPaddle();
}
// Listener for moving the paddle
document.addEventListener('keydown', function (event) {
  if (event.code !== 'ArrowRight' && event.code !== 'ArrowLeft') {
    return;
  } else if (event.code === 'ArrowRight') {
    movingRight = true;
  } else if (event.code === 'ArrowLeft') {
    movingLeft = true;
  }
});
  
document.addEventListener('keyup', function (event) {
  if (event.code !== 'ArrowRight' && event.code !== 'ArrowLeft') {
    return;
  } else if (event.code === 'ArrowRight') {
    movingRight = false;
  } else if (event.code === 'ArrowLeft') {
    movingLeft = false;
  }
});

function updatePaddlePosition() {
  if (movingRight && paddle.xPos + paddle.width < canvas.width && !movingLeft) {
    paddle.xPos += paddle.movement;
  } else if (movingLeft && paddle.xPos > 0 && !movingRight) {
    paddle.xPos -= paddle.movement;
  }
}

// Function to draw rectangle based on parameters
function displayRectangle (xCord, yCord, width, height) {
  gameArea.fillStyle = matrixGreen;
  gameArea.fillRect(xCord, yCord, width, height)
}

function displayPaddle() {
  gameArea.fillStyle = paddleColor;
  gameArea.fillRect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
}

// Function to clear the contents of the game area
function clearGameArea() {
  gameArea.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  clearGameArea();
  updatePaddlePosition();
  displayPaddle();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// TODO Add canvas scaling?

