let board;
let boardWidth;
let boardHeight;
let context;

//bird
let birdWidth;
let birdHeight;
let birdX;
let birdY;
let birdImg;
let bird = {};

//pipes
let pipeArray = [];
let pipeWidth;
let pipeHeight;
let pipeX;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX;
let velocityY = 0;
let gravity;

//game status
let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d");

    resizeCanvas();

    // Load images
    birdImg = new Image();
    birdImg.src = "images/flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("touchstart", moveBird); // Handle touch events
};

function resizeCanvas() {
    let aspectRatio = 360 / 640;

    if (window.innerWidth / window.innerHeight < aspectRatio) {
        boardWidth = window.innerWidth;
        boardHeight = window.innerWidth / aspectRatio;
    } else {
        boardHeight = window.innerHeight;
        boardWidth = window.innerHeight * aspectRatio;
    }

    board.width = boardWidth;
    board.height = boardHeight;

    birdWidth = boardWidth * 34 / 360;
    birdHeight = boardHeight * 24 / 640;
    birdX = boardWidth / 8;
    birdY = boardHeight / 2;

    bird = {
        x: birdX,
        y: birdY,
        width: birdWidth,
        height: birdHeight,
    };

    pipeWidth = boardWidth * 64 / 360;
    pipeHeight = boardHeight * 512 / 640;
    pipeX = boardWidth;

    velocityX = -boardWidth * 2 / 360;
    gravity = boardHeight * 0.4 / 640;
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.type === "keydown" && (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")) {
        velocityY = -boardHeight * 6 / 640;
    } else if (e.type === "touchstart") {
        velocityY = -boardHeight * 6 / 640;
    }

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
