// Setting the canvas
let canvas;
let ctx;

canvas = document.createElement("canvas");
// canvas에 2d라는 세계를 ctx에 넣어준다.
ctx = canvas.getContext("2d");
// Size of the canvas
canvas.width = 400;
canvas.height = 700;
// HTML body 태그에 canvas를 붙여준다
document.body.appendChild(canvas);

// Get all Images
let backgroundImage, starfighterImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // 게임의 상태 값
let score = 0;

// location of starfighter
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
  this.checkHit = function() {
    for( let i = 0; i < enemyList.length; i++ ) {
        if( 
            this.y <= enemyList[i].y && 
            this.x >= enemyList[i].x && 
            this.x <= enemyList[i].x + 30 
        ) {
            score++;
            this.alive = false;
            enemyList.splice( i, 1 );
        }
    }
  }
};

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

    if ( this.y >= canvas.height - 32 ) {
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
  // 우주선의 속도
  if (39 in keysdown) {
    starfighterx += 1.5;
  }
  if (37 in keysdown) {
    starfighterx -= 1.5;
  }
  // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌 캔버스 안에서만 머물게 하는 방법
  if (starfighterx <= 0) {
    starfighterx = 0;
  }
  if (starfighterx >= canvas.width - 64) {
    starfighterx = canvas.width - 64;
  }

  //총알의 y좌표를 업데이트하는 함수 호출 (총알이 발사되는 함수)
  for (let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive) {
        bulletList[i].update();
        bulletList[i].checkHit();
    }
  }

  // 적군을 업데이트 하는 함수 호출 떨어지게 하는
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(starfighterImage, starfighterx, starfightery, 48, 48);
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if( bulletList[i].alive ) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
    if (!gameOver) {
        update(); // 좌표값을 업데이트
        render(); // 그려준다
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameOverImage, 5, 100, 390, 280);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 우주선의 움직임
//1. 우주선의 좌우로 움직여야 한다. 각 방향키는 고유의 값이 있다. 37, 38, 39, 40
//2. 우주선이 오른쪽으로 가면 x좌표의 값이 증가한다. 왼쪽으로 감ㄴ x 좌표의 값이 감소한다.
//3. 키를 누르면 움직임이 가져가고, 누르지 않는 순간의 멈춤을 위해서 delete 코드를 넣어준다.
//4. 우주선이 캔버스 좌표 밖으로 나가지 않게 하기 위해서 좌표를 넣어준다.
//5. 다시 render 해준다.

// 총알 만들기
//1. 스페이스바를 누르면 총알이 발사 된다
//2. 총알이 발사 = 총알의 값이 Y값 -으로 움직인다. 총알의 x값은, 스페이스를 누른 순간의 우주선의 x좌표가 된다
//3. 발사된 총알들은 총알의 배열에 저장을 한다.
//4. 모든 총알들은 x,y의 좌표값이 존대해야 한다.
//5. 총알의 배열을 가지고 render 해준다

// 적군 만들기
//1. 적군은 위치가 랜덤하다
//2. 적군은 밑으로 내려오는 형태, y좌표가 증가한다
//3. 1초마다 하나의 적군이 출현
//4. 적군이 우주선이 바닥에 닿으면 게임오버
//5. 총알이 적군을 맞추면 우주선이 사라지고 점수를 1포인트 얻는다.

// 적군이 죽는다
//1. 총알이 적군에게 닿는다. (총알의 y값이 감소한다 적군의 y값보다)
//2. 총알이 닿는 면적은 적군의 x값을 기준으로 만들어야 한다
//3. 총알이 적군에 닿으면 총알과 적군이 사라지고 포인트를 얻는다.
// 총알.y <= 적군.y and
// 총알.x >= 적군.y and 총알.x <= 적군.x + 적군의 크기

