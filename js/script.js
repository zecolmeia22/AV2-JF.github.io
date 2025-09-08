const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('startButton');
const musicaFundo = new Audio('som/musica-fundo.mp3');
const somMorte = new Audio('som/som-morte.mp3');
const gameOverImage = new Image();
const runFrames = [];
const jumpFrames = [];
const deadFrames = [];
const frameCount = 6;
const jumpFrameCount = 8;
const deadFrameCount = 8;

let currentImage; 

let dino = {
    x: 50,
    y: 219,
    width: 80,
    height: 80,
    isJumping: false,
    jumpVelocity: 0,
    gravity: 0.7,       
    jumpFrame: 0,
    jumpFrameSpeed: 8,  
    jumpFrameCounter: 0,
    isDead: false,
    deadFrame: 0,
    deadFrameSpeed: 15, 
    deadFrameCounter: 0
};

let cuboDeGelo = {
    x: canvas.width,
    y: 245,
    width: 50,
    height: 50,
    speed: 3,
    image: new Image(),
    draw: function() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
};

let imagesLoaded = 0;
let totalImages = 0;
let currentFrame = 0;
let frameCounter = 0;
let gameOver = false;

musicaFundo.loop = true;

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    init();
    musicaFundo.play(); 
});

function loadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.onload = checkAllImagesLoaded;
        img.onerror = () => console.error(`Erro ao carregar a imagem: ${img.src}`);
        img.src = `img/Run/RUN${i}.png`;
        runFrames.push(img);
    }

    for (let i = 1; i <= jumpFrameCount; i++) {
        const img = new Image();
        img.onload = checkAllImagesLoaded;
        img.onerror = () => console.error(`Erro ao carregar a imagem: ${img.src}`);
        img.src = `img/Jump/JUMP${i}.png`;
        jumpFrames.push(img);
    }

    for (let i = 1; i <= deadFrameCount; i++) {
        const img = new Image();
        img.onload = checkAllImagesLoaded;
        img.onerror = () => console.error(`Erro ao carregar a imagem: ${img.src}`);
        img.src = `img/Dead/DEAD${i}.png`;
        deadFrames.push(img);
    }

    cuboDeGelo.image.onload = checkAllImagesLoaded;
    cuboDeGelo.image.src = `img/Objeto/cubo-de-gelo.png`;

    gameOverImage.onload = checkAllImagesLoaded;
    gameOverImage.src = 'img/game-over.png';

    totalImages = frameCount + jumpFrameCount + deadFrameCount + 2;
}

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        console.log("Imagens carregadas! Pronto para iniciar.");
    }
}

function init() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !dino.isJumping && !gameOver) {
            dino.isJumping = true;
            dino.jumpVelocity = -15; 
            dino.jumpFrame = 0;
            dino.jumpFrameCounter = 0;
        }
        if (e.code === 'KeyR' && gameOver) {
            location.reload(); 
        }
    });
    loop();
}

function checkCollision() {
    if (gameOver) return;

    let dinoRect = { x: dino.x, y: dino.y, width: dino.width, height: dino.height };
    let cuboRect = { x: cuboDeGelo.x, y: cuboDeGelo.y, width: cuboDeGelo.width, height: cuboDeGelo.height };

    if (dinoRect.x < cuboRect.x + cuboRect.width - 30 &&
        dinoRect.x + dinoRect.width > cuboRect.x + 30 &&
        dinoRect.y < cuboRect.y + cuboRect.height &&
        dinoRect.y + dinoRect.height > cuboRect.y) {
        
        gameOver = true;
        dino.isDead = true;
        musicaFundo.pause();
        somMorte.currentTime = 0;
        somMorte.play();
    }
}

function loop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (dino.deadFrame < deadFrameCount - 1) {
            dino.deadFrameCounter++;
            if (dino.deadFrameCounter % dino.deadFrameSpeed === 0) {
                dino.deadFrame++;
            }
            ctx.drawImage(deadFrames[dino.deadFrame], dino.x, dino.y, dino.width, dino.height);
            requestAnimationFrame(loop);
        } else {
            ctx.drawImage(deadFrames[deadFrameCount - 1], dino.x, dino.y, dino.width, dino.height);
            document.getElementById('game-over-screen').style.display = 'flex';
        }
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    cuboDeGelo.x -= cuboDeGelo.speed;
    if (cuboDeGelo.x + cuboDeGelo.width < 0) {
        cuboDeGelo.x = canvas.width;
    }
    cuboDeGelo.draw();
    
    if (dino.isJumping) {
        dino.y += dino.jumpVelocity;
        dino.jumpVelocity += dino.gravity;
        if (dino.y >= 219) {
            dino.y = 219;
            dino.isJumping = false;
            dino.jumpVelocity = 0;
        }
        dino.jumpFrameCounter++;
        if (dino.jumpFrameCounter % dino.jumpFrameSpeed === 0 && dino.jumpFrame < jumpFrameCount - 1) {
            dino.jumpFrame++;
        }
    } else {
        frameCounter++;
        if (frameCounter % 7 === 0) { 
            currentFrame = (currentFrame + 1) % frameCount;
        }
    }
    
    if (dino.isJumping) {
        currentImage = jumpFrames[dino.jumpFrame];
    } else {
        currentImage = runFrames[currentFrame];
    }
    if (currentImage) {
        ctx.drawImage(currentImage, dino.x, dino.y, dino.width, dino.height);
    }
    
    checkCollision();
    requestAnimationFrame(loop);
}

window.onload = loadImages;