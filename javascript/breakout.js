var canvas = document.getElementById('gameArea');
var gameArea = canvas.getContext('2d');

const matrixGreen = 'rgb(21, 247, 0)'; // Theme color
var lost = false;

let paddle = { // Variables set in scalePaddle()
  paddleWidth: 0,
  paddleHeight: 0,
  bottomMargin: 0,
  xPos: 0,
  yPos: 0,
  movement: 0,
  color: 'rgb(218, 15, 140)',
  movingLeft: false,
  movingRight: false
};

let ball = {
  radius: 0,
  xPos: 0,
  yPos: 0,
  speed: 0,
  xMovement: 0,
  yMovement: 0,
  color: 'rgb(255, 255, 255)'
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

function displayPaddle() {
  gameArea.fillStyle = paddle.color;
  gameArea.fillRect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
}
function updatePaddlePosition() {
  if (paddle.movingRight && paddle.xPos + paddle.width < canvas.width && !paddle.movingLeft) {
    paddle.xPos += paddle.movement;
  } else if (paddle.movingLeft && paddle.xPos > 0 && !paddle.movingRight) {
    paddle.xPos -= paddle.movement;
  }
}

function displayBall() {
  gameArea.beginPath();
  gameArea.arc(ball.xPos, ball.yPos, ball.radius, 0, Math.PI * 2);
  gameArea.fillStyle = ball.color;
  gameArea.fill();
  gameArea.closePath();
}

function updateBallPosition() {
  ball.xPos += ball.xMovement;
  ball.yPos += ball.yMovement;
}

function detectBallWallCollisions() {
  if (ball.xPos + ball.radius >= canvas.width || ball.xPos - ball.radius <= 0) { // Handle x-cordinate collisions
    ball.xMovement = -ball.xMovement;
  } if (ball.yPos - ball.radius <= 0) { // Handle y-cordinate collisions
    ball.yMovement = - ball.yMovement;
  } if (ball.yPos + ball.radius > canvas.height) {
    lost = true;
  }
}

// Function to draw rectangle based on parameters
function displayRectangle (xCord, yCord, width, height) {
  gameArea.fillStyle = matrixGreen;
  gameArea.fillRect(xCord, yCord, width, height)
}

// Function to clear the contents of the game area
function clearGameArea() {
  gameArea.clearRect(0, 0, canvas.width, canvas.height);
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
  scaleBall();// Scale the ball porportionally to canvas size
}

function scaleBall() {
  ball.radius = canvas.width * 0.025;
  ball.xPos = canvas.width / 2;
  ball.yPos = paddle.yPos - ball.radius;
  ball.speed = canvas.width * 0.010;
  ball.xMovement = ball.speed;
  ball.yMovement = - ball.speed;
}

function scalePaddle() {
  paddle.width = canvas.width * 0.25;
  paddle.height = canvas.height * 0.03;
  paddle.bottomMargin = canvas.height * 0.10;

  paddle.xPos = canvas.width / 2 - paddle.width / 2;
  paddle.yPos = ((canvas.height) - paddle.height) - paddle.bottomMargin;
  paddle.movement = canvas.width * 0.012;
}

function gameLoop() {
  clearGameArea();
  displayPaddle();
  displayBall();
  updatePaddlePosition();
  updateBallPosition();
  detectBallWallCollisions();
  if (!lost) {
    requestAnimationFrame(gameLoop);
  }
}

setupResizeListener(); // Listen for rescale events
adaptCanvasToWindow(); // Scale the canvas appropriately for window size
gameLoop(); // Start the game loop