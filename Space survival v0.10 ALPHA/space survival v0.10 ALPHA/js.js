// =================================================================
// 1. SETUP - Pobieranie elementów DOM i inicjalizacja Canvas
// =================================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

// =================================================================
// 2. GAME STATE & VARIABLES - Zmienne globalne i stan gry
// =================================================================
let gameRunning = true;
let score = 0;
let gameSpeed = 0.5;

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 60,
    width: 30,
    height: 40,
    speed: 5
};

let asteroids = [];

// ZASADA #1: Zastosowano 'Nazwy o Znaczeniu' - zmiana 'keys' na 'keyboardState'
const keyboardState = {};

// =================================================================
// 3. EVENT LISTENERS - Nasłuchiwanie na akcje użytkownika
// =================================================================
document.addEventListener('keydown', (e) => {
    keyboardState[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keyboardState[e.key] = false;
});

restartBtn.addEventListener('click', restartGame);

// =================================================================
// 4. DRAW FUNCTIONS - Funkcje odpowiedzialne za rysowanie na Canvas
// =================================================================
function drawPlayer() {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y);
    ctx.lineTo(player.x, player.y + 15);
    ctx.lineTo(player.x + player.width, player.y + 15);
    ctx.closePath();
    ctx.fill();

    if (Math.random() > 0.5) {
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(player.x + 8, player.y + player.height, 6, 8);
        ctx.fillRect(player.x + 16, player.y + player.height, 6, 8);
    }
}

function drawAsteroid(asteroid) {
    ctx.fillStyle = '#666';
    ctx.fillRect(asteroid.x, asteroid.y, asteroid.size, asteroid.size);

    ctx.fillStyle = '#888';
    for (let i = 0; i < 3; i++) {
        const px = asteroid.x + Math.random() * asteroid.size;
        const py = asteroid.y + Math.random() * asteroid.size;
        ctx.fillRect(px, py, 2, 2);
    }
}

function drawStars() {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 67 + Date.now() * 0.05) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
}

// =================================================================
// 5. LOGIC & UPDATE FUNCTIONS - Funkcje aktualizujące stan gry
// =================================================================
function createAsteroid() {
    return {
        x: Math.random() * (canvas.width - 30),
        y: -30,
        size: 20 + Math.random() * 15,
        speed: 0.5 + Math.random() * 1.5
    };
}

function updatePlayer() {
    if ((keyboardState['ArrowLeft'] || keyboardState['a'] || keyboardState['A']) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((keyboardState['ArrowRight'] || keyboardState['d'] || keyboardState['D']) && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function updateAsteroids() {
    if (Math.random() < 0.008) { 
        asteroids.push(createAsteroid());
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].y += asteroids[i].speed + gameSpeed;

        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1);
            score += 10; 
        }
    }
}

function checkCollisions() {
    for (let asteroid of asteroids) {
        if (player.x < asteroid.x + asteroid.size &&
            player.x + player.width > asteroid.x &&
            player.y < asteroid.y + asteroid.size &&
            player.y + player.height > asteroid.y) {
            gameOver();
            return;
        }
    }
}

// =================================================================
// 6. GAME CORE - Główna pętla i funkcje kontrolujące grę
// =================================================================
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    updatePlayer();
    updateAsteroids();
    checkCollisions();
    drawPlayer();
    for (let asteroid of asteroids) {
        drawAsteroid(asteroid);
    }
    scoreElement.textContent = `Wynik: ${score}`;

    if (score > 0 && score % 500 === 0) { 
        gameSpeed += 0.05; 
    }

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
    restartBtn.style.display = 'block';
}

function restartGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 0.5; 
    asteroids = [];
    player.x = canvas.width / 2 - 15;
    player.y = canvas.height - 60;
    gameOverElement.style.display = 'none';
    restartBtn.style.display = 'none';
    gameLoop();
}

// =================================================================
// 7. INITIALIZATION - Uruchomienie gry
// =================================================================
function initGame() {
    gameLoop();
}

initGame();