var canvas = document.getElementById('gameArea');
var gameArea = canvas.getContext('2d');

var gameOver = false;
var score = 0;
let turns = 3;

const matrixGreen = 'rgb(21, 247, 0)'; // Theme color

var levelTwoLoaded = false;
const numberOfRows = 8;
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
  topMargin: 0,
  distance: 0
};

const brickColors = ['rgb(255, 48, 48)','rgb(89, 255, 74)', 'rgb(15, 158, 241)', 'rgb(231, 247, 0)'];

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

function resetPaddlePosition() {
  paddle.xPos = canvas.width / 2 - paddle.width / 2;
  paddle.yPos = ((canvas.height) - paddle.height) - paddle.bottomMargin;
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

function resetBallPosition() {
  ball.xPos = canvas.width / 2;
  ball.yPos = paddle.yPos - ball.radius;
  ball.xMovement = ball.speed;
  ball.yMovement = - ball.speed;
}

function detectBallWallCollisions() {
  if (ball.xPos + ball.radius >= canvas.width || ball.xPos - ball.radius <= 0) { // Handle x-cordinate collisions
    ball.xMovement = -ball.xMovement;
  } if (ball.yPos - ball.radius <= 0) { // Handle y-cordinate collisions
    ball.yMovement = - ball.yMovement;
  } if (ball.yPos + ball.radius > canvas.height) {
    if (turns === 1) {
      gameOver = true;
    } else {
      turns--;
      resetPaddlePosition();
      resetBallPosition();
    }
  }
}

function generateBricks() {
  for (let row = 0; row < numberOfRows; row++) {
    bricks[row] = [];
    for (let column = 0; column < numberOfColumns; column++) {
      let generatedBrick = {
        width: brick.width,
        height: brick.height,
        xPos: column * (brick.width + brick.distance) + brick.distance,
        yPos: row * (brick.height + brick.distance) + brick.distance + brick.topMargin,
        destroyed: false
      }
      if (row < 2) {
        generatedBrick.color = brickColors[0];
      } else if (row < 4) {
        generatedBrick.color = brickColors[1];
      } else if (row < 6) {
        generatedBrick.color = brickColors[2];
      } else {
        generatedBrick.color = brickColors[3];
      }
      bricks[row][column] = generatedBrick;
    }
  }
}

function displayBricks() {
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      if (!bricks[row][column].destroyed) {
        let brickToDisplay = bricks[row][column];
        
        gameArea.fillStyle = brickToDisplay.color;
        gameArea.fillRect(brickToDisplay.xPos, brickToDisplay.yPos, brickToDisplay.width, brickToDisplay.height);
        gameArea.strokeStyle = '#000000';
        gameArea.strokeRect(brickToDisplay.xPos, brickToDisplay.yPos, brickToDisplay.width, brickToDisplay.height);
      }
    }
  }
}

function detectBallBrickCollisions() {
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      let brickToCheck = bricks[row][column];
      if (!brickToCheck.destroyed) {
        // Checks to see if the ball hits a brick
        if (ball.xPos + ball.radius / 2 >= brickToCheck.xPos &&
          ball.xPos - ball.radius / 2 <= brickToCheck.xPos + brickToCheck.width &&
          ball.yPos + ball.radius / 2 >= brickToCheck.yPos &&
          ball.yPos - ball.radius / 2 <= brickToCheck.yPos + brickToCheck.height) {

          ball.yMovement = - ball.yMovement;
         
          brickToCheck.destroyed = true;
          score += 10;
          console.log('Score: ' + score);
        }
      }
    }
  }
}

function checkLevelCompletion() {
  if (score === (numberOfRows * numberOfColumns * 10) &&  levelTwoLoaded === false) {
    startLevelTwo();
    levelTwoLoaded = true;
  }
}

function startLevelTwo() {
  resetPaddlePosition();
  resetBallPosition();
  generateBricks();
  ball.speed = ball.speed * 1.5;
  ball.xMovement = ball.speed;
  ball.yMovement = ball.speed;

  paddle.width *= 0.75;
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
    canvas.width = window.innerWidth * 0.25;
    canvas.height = window.innerHeight * 0.8;
  } else if (window.innerWidth < window.innerHeight) { // Portrait dimensions
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
  }
  scalePaddle(); // Scale the paddle porportionally to canvas size
  scaleBall();  // Scale the ball porportionally to canvas size
  scaleBricks();   // Scale the bricks porportionally to canvas size
  generateBricks();
}

function scaleBall() {
  ball.radius = canvas.width * 0.015;
  ball.xPos = canvas.width / 2;
  ball.yPos = paddle.yPos - ball.radius;
  ball.speed = ((canvas.width + canvas.height) / 2) * 0.006;
  ball.xMovement = ball.speed;
  ball.yMovement = - ball.speed;
}

function scalePaddle() {
  paddle.width = canvas.width * 0.3;
  paddle.height = canvas.height * 0.018;
  paddle.bottomMargin = canvas.height * 0.10;

  paddle.xPos = canvas.width / 2 - paddle.width / 2;
  paddle.yPos = ((canvas.height) - paddle.height) - paddle.bottomMargin;
  paddle.movement = canvas.width * 0.012;
}

function scaleBricks() {
  brick.width = canvas.width / (numberOfColumns + 1);
  brick.height = canvas.height * 0.025 * 0.8;
  brick.topMargin = canvas.height * 0.075;
  brick.distance = ((brick.width) / (numberOfColumns + 1))
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
  detectBallBrickCollisions();
}

function gameLoop() {
  clearGameArea();
  displayGraphics();
  updateMovingComponentsPositions();
  detectCollisions();
  checkLevelCompletion();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

setupResizeListener(); // Listen for rescale events
adaptCanvasToWindow(); // Scale the canvas appropriately for window size
gameLoop(); // Start the game loop