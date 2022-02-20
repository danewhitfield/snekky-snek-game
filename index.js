const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

function drawGame() {
  changeSnakePos();
  let res = isGameOver();
  if (res) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > 2) {
    speed = 10;
  }
  if (score > 5) {
    speed = 14;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (xVelocity === 0 && yVelocity === 0) {
    return false;
  }

  // check if we're hitting walls
  if (headX < 0) {
    gameOver = true;
  }
  if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let x of snakeParts) {
    let part = x;
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "50px sans-serif";

    ctx.fillText("GAME OVER!", canvas.width / 8, canvas.height / 2);
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px sans-serif";
  ctx.fillText(`Score: ${score}`, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "rgb(19, 19, 19)";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "rgba(81, 255, 0, 0.705)";

  for (let x of snakeParts) {
    let part = x;
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  // we put a block at the end next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // we remove the furthest block from the snakeParts if we have more than our tailLength
  }

  ctx.fillStyle = "green";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePos() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);

  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0.1;
  ctx.shadowOffsetY = 0.1;
  ctx.shadowColor = "rgb(166, 255, 0)";
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    // if our snake collides with the apple we want to make it look like the apple disappears
    // using math.random we can set the apple's new position to a random place on the canvas
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);

    // if we collide with an apple we want to add to our tailLength
    tailLength++;

    score++;
  }
}

document.addEventListener("keydown", keyDown);

function keyDown(e) {
  // up arrow key == 38
  if (e.keyCode == 38) {
    if (yVelocity == 1) {
      return;
    }
    yVelocity = -1;
    xVelocity = 0;
  }

  // down arrow == 40
  if (e.keyCode == 40) {
    if (yVelocity == -1) {
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }

  // left arrow == 37
  if (e.keyCode == 37) {
    if (xVelocity == 1) {
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }

  // right arrow == 39
  if (e.keyCode == 39) {
    if (xVelocity == -1) {
      return;
    }
    yVelocity = 0;
    xVelocity = 1;
  }
}

drawGame();
