let canvas;
let ctx;

canvas = document.createElement("canvas")
// canvas에 2d라는 세계를 ctx에 넣어준다.
ctx    = canvas.getContext("2d")
// Size of the canvas
canvas.width  = 400;
canvas.height = 700;
// HTML body 태그에 canvas를 붙여준다
document.body.appendChild(canvas);

// Get all Images
let backgroundImage,starfighterImage,bulletImage,enemyImage,gameOverImage; 
function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "assets/background-image.gif"

    starfighterImage = new Image();
    starfighterImage.src = "assets/x-wing-starfighter.png"

    bulletImage = new Image();
    bulletImage.src = "assets/bullet-24.png"

    enemyImage = new Image();
    enemyImage.src = "assets/alien-32.png"

    gameOverImage = new Image();
    gameOverImage.src = "assets/game-over.png"
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
}