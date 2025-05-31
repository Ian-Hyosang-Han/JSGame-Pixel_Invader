// Setting the canvas
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d"); // Assign 2D context to the canvas

// Size of the canvas
canvas.width = 400;
canvas.height = 700;

// Append canvas to the HTML body
document.body.appendChild(canvas);

// Load all images
let backgroundImage, starfighterImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;
let score = 0;
let isGameStarted = false;

// Game start Button
const button = {
  x: canvas.width / 2 - 55,
  y: canvas.height / 2 - 100,
  width: 110,
  height: 40,
};

// Starfighter position
let starfighterx = canvas.width / 2 - 32;
let starfightery = canvas.height - 64;

let bulletList = [];

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = starfighterx + 20;
    this.y = starfightery;
    this.alive = true;
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 5;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 30
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
        break;
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 32);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 1; //  적군의 속도 조절

    if (this.y >= canvas.height - 32) {
      gameOver = true;
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "assets/background-image.png";

  starfighterImage = new Image();
  starfighterImage.src = "assets/x-wing-starfighter.png";

  bulletImage = new Image();
  bulletImage.src = "assets/bullet-24.png";

  enemyImage = new Image();
  enemyImage.src = "assets/alien-32.png";

  gameOverImage = new Image();
  gameOverImage.src = "assets/game-over.png";

  backgroundImage.onload = function () {
    drawStartScreen();
  };
}

let keysdown = {};

function setupKeyboardListener() {
  document.addEventListener("keydown", (event) => {
    keysdown[event.keyCode] = true;
  });
  document.addEventListener("keyup", (event) => {
    delete keysdown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet();
    }
  });
}

function createBullet() {
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const inerval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {

  // Starfighter movement speed
  if (39 in keysdown) {
    starfighterx += 1.5;
  }
  if (37 in keysdown) {
    starfighterx -= 1.5;
  }
  // Prevent starfighter from leaving canvas
  if (starfighterx <= 0) {
    starfighterx = 0;
  }
  if (starfighterx >= canvas.width - 48) {
    starfighterx = canvas.width - 48;
  }

  // Update bullets
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  // Update enemies
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

// Draw start screen
function drawStartScreen() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Pixel Invaders", canvas.width / 2, canvas.height / 2 - 170);

  
  ctx.fillStyle = "#d3d3d3";
  ctx.fillRect(button.x, button.y, button.width, button.height);
  
  ctx.fillStyle = "#000";
  ctx.font = "18px Arial";
  ctx.fillText("Start Game", canvas.width / 2, button.y + button.height / 2 + 6);
}

function render() {
  if (!isGameStarted) {
    drawStartScreen();
    return;
  }

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(starfighterImage, starfighterx, starfightery, 48, 48);
  ctx.fillText(`Score:${score}`, 50, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update(); // Update positions
    render(); // Draw everything
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 5, 100, 390, 280);
  }
}

// Handle start button click on canvas
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  if (
    !isGameStarted &&
    mouseX >= button.x &&
    mouseX <= button.x + button.width &&
    mouseY >= button.y &&
    mouseY <= button.y + button.height
  ) {
    isGameStarted = true;
    createEnemy();
    main();
  }
});

function init() {
  loadImage();
  setupKeyboardListener();
}

init();

// Starfighter movement
// 1. Moves left/right with arrow keys (keyCodes: 37, 38, 39, 40)
// 2. Right movement increases x, left movement decreases x
// 3. Uses delete to stop movement when key is released
// 4. Keeps starfighter inside canvas bounds
// 5. Re-render to reflect movement

// Bullet creation
// 1. Fires bullet when spacebar is pressed
// 2. Bullet moves up (y decreases); x is based on starfighter position at time of firing
// 3. Bullets are stored in an array
// 4. Each bullet keeps track of its own x and y
// 5. Render all bullets on screen

// Enemy creation
// 1. Enemies appear at random x positions
// 2. Enemies fall downward (y increases)
// 3. One enemy spawns every second
// 4. If enemy reaches bottom, it's game over
// 5. Bullet hitting enemy removes enemy and increases score by 1

// Enemy gets destroyed
// 1. Bullet hits enemy (bullet y <= enemy y)
// 2. Bullet x should be within enemy x range
// 3. On collision, remove both bullet and enemy, and add point
// Condition: bullet.y <= enemy.y && bullet.x >= enemy.x && bullet.x <= enemy.x + enemy width
