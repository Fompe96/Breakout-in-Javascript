var canvas = document.getElementById('gameArea');
var gameArea = canvas.getContext('2d');

let paddle = {
  paddleWidth: 0,
  paddleHeight: 0,
  bottomMargin: 0,
  xPos: 0,
  yPos: 0,
  movement: 0,
  color: 'rgb(240, 240, 240)',
  movingLeft: false,
  movingRight: false
};

const matrixGreen = 'rgb(21, 247, 0)';

function gameLoop() {
  displayPaddle();
}
// Listener for moving the paddle
document.addEventListener('keydown', function (event) {
  if (event.code !== 'ArrowRight' && event.code !== 'ArrowLeft') {
    return;
  } else if (event.code === 'ArrowRight') {
    paddle.movingRight = true;
  } else if (event.code === 'ArrowLeft') {
    paddle.movingLeft = true;
  }
});
  
document.addEventListener('keyup', function (event) {
  if (event.code !== 'ArrowRight' && event.code !== 'ArrowLeft') {
    return;
  } else if (event.code === 'ArrowRight') {
    paddle.movingRight = false;
  } else if (event.code === 'ArrowLeft') {
    paddle.movingLeft = false;
  }
});

function updatePaddlePosition() {
  if (paddle.movingRight && paddle.xPos + paddle.width < canvas.width && !paddle.movingLeft) {
    paddle.xPos += paddle.movement;
  } else if (paddle.movingLeft && paddle.xPos > 0 && !paddle.movingRight) {
    paddle.xPos -= paddle.movement;
  }
}

// Function to draw rectangle based on parameters
function displayRectangle (xCord, yCord, width, height) {
  gameArea.fillStyle = matrixGreen;
  gameArea.fillRect(xCord, yCord, width, height)
}

function displayPaddle() {
  gameArea.fillStyle = paddle.color;
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
// Listen for window resize events
function setupResizeListener() {
  window.addEventListener('resize', adaptCanvasToWindow, false);
}
// Adapt the canvas to match new window size
function adaptCanvasToWindow() {
  if (window.innerWidth > window.innerHeight) { // Landscape dimensions
    canvas.width = window.innerWidth * 0.20;
    canvas.height = window.innerHeight * 0.8;
  } else if (window.innerWidth < window.innerHeight) { // Portrait dimensions
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
  }
  scalePaddle(); // Scale the paddle porportionally to canvas size
}

function scalePaddle() {
  paddle.width = canvas.width * 0.25;
  paddle.height = canvas.height * 0.04;
  paddle.bottomMargin = canvas.height * 0.05;

  paddle.xPos = canvas.width / 2 - paddle.width / 2;
  paddle.yPos = ((canvas.height) - paddle.height) - paddle.bottomMargin;
  paddle.movement = canvas.width * 0.012;
}

setupResizeListener(); // Listen for rescale events
adaptCanvasToWindow(); // Scale the canvas appropriately for window size
gameLoop(); // Start the game loop