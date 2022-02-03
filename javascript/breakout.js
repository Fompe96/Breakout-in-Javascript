var canvas = document.getElementById('gameArea');
var gameArea = canvas.getContext('2d');

const matrixGreen = 'rgb(21, 247, 0)'; // Theme color
var lost = false;

const numberOfRows = 6;
const numberOfColumns = 8;

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

let bricks = [];

let brick = {
  width: 0,
  height: 0,
  color: matrixGreen,
  xPos: 0,
  yPos: 0,
  destroyed: false,
  topMargin: 0
};

const brickColors = ['rgb(89, 255, 74)', 'rgb(15, 158, 241)', 'rgb(231, 247, 0)'];

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

function detectBallPaddleCollisions() {
  if (ball.yPos > paddle.yPos && ball.yPos < paddle.yPos + paddle.height &&
    ball.xPos > paddle.xPos && ball.xPos < paddle.xPos + paddle.width) {
    
    let hitPointOnPaddle = ball.xPos - (paddle.xPos + paddle.width / 2);
    hitPointOnPaddle = hitPointOnPaddle / (paddle.width / 2); // Convert value to 0-1 interval
    let angle = hitPointOnPaddle * (Math.PI / 3); // (0 - 1) * 60° to get variable push angles

    ball.xMovement = ball.speed * Math.sin(angle);
    ball.yMovement = - ball.speed * Math.cos(angle);
    if (ball.xMovement === 0) {
      ball.xMovement += 0.1;
    }
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

function generateBricks() {
  for (let row = 0; row < numberOfRows; row++) {
    bricks[row] = [];
    for (let column = 0; column < numberOfColumns; column++) {
      bricks[row][column] = {
        width: brick.width,
        height: brick.height,
        color: brick.color,
        xPos: column * brick.width,
        yPos: row * brick.height + brick.topMargin,
        destroyed: false
      }
    }
  }
}

function displayBricks() {
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (!bricks[row][column].destroyed) {
        let brickToDisplay = bricks[row][column];
        if (row === 0 || row === 1) {
          brickToDisplay.color = brickColors[0];
        } else if (row === 2 || row === 3) {
          brickToDisplay.color = brickColors[1];
        } else {
          brickToDisplay.color = brickColors[2];
        }
        gameArea.fillStyle = brickToDisplay.color;
        gameArea.fillRect(brickToDisplay.xPos, brickToDisplay.yPos, brickToDisplay.width, brickToDisplay.height);
        gameArea.strokeStyle = '#000000';
        gameArea.strokeRect(brickToDisplay.xPos, brickToDisplay.yPos, brickToDisplay.width, brickToDisplay.height);
      }
    }
  }
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
  scaleBall();  // Scale the ball porportionally to canvas size
  scaleBricks();   // Scale the bricks porportionally to canvas size
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
  paddle.width = canvas.width * 0.3;
  paddle.height = canvas.height * 0.025;
  paddle.bottomMargin = canvas.height * 0.10;

  paddle.xPos = canvas.width / 2 - paddle.width / 2;
  paddle.yPos = ((canvas.height) - paddle.height) - paddle.bottomMargin;
  paddle.movement = canvas.width * 0.012;
}

function scaleBricks() {
  brick.width = canvas.width / numberOfColumns;
  brick.height = paddle.height;
  brick.topMargin = canvas.height * 0.075
}

function displayGraphics() {
  displayPaddle();
  displayBall();
  displayBricks();
}

function updateMovingComponentsPositions() {
  updatePaddlePosition();
  updateBallPosition();
}

function detectCollisions() {
  detectBallWallCollisions();
  detectBallPaddleCollisions();
}

function gameLoop() {
  clearGameArea();
  generateBricks();
  displayGraphics();
  updateMovingComponentsPositions();
  detectCollisions();
  if (!lost) {
    requestAnimationFrame(gameLoop);
  }
}

setupResizeListener(); // Listen for rescale events
adaptCanvasToWindow(); // Scale the canvas appropriately for window size
gameLoop(); // Start the game loop