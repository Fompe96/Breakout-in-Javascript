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

const paddleColor = 'rgb(240, 240, 240)'
const matrixGreen = 'rgb(21, 247, 0)';

function gameLoop() {
  
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
  gameArea.clearRect(0, 0, gameArea.width, gameArea.height);
}
//gameLoop();
displayPaddle();

