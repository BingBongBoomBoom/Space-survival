// =================================================================
// 1. SETUP - Pobieranie elementów DOM i inicjalizacja Canvas
// =================================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('gameOver');
const gameOverContainer = document.getElementById('gameOverContainer');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const skinPreviewCanvas = document.getElementById('skinPreviewCanvas');
const skinPreviewCtx = skinPreviewCanvas.getContext('2d');
const skinButtons = document.querySelectorAll('.skin-btn');
const toggleSkinsBtn = document.getElementById('toggleSkinsBtn');
const skinsMenu = document.getElementById('skinsMenu');

// =================================================================
// 2. GAME STATE & VARIABLES - Zmienne globalne i stan gry
// =================================================================
let gameRunning = true;
let score = 0;
let lives = 3;
let gameSpeed = 0.5;
let asteroidSpawnRate = 0.008;
let currentDifficulty = 'normal';
let currentSkin = localStorage.getItem('selectedSkin') || 'classic';

const skinDefinitions = {
    classic: {
        name: 'KLASYCZNA',
        bodyColor: '#00ff88',
        accentsColor: '#00ff44',
        flameColor1: '#ff6600',
        flameColor2: '#ffaa00',
        flameColor3: '#ffff00',
        windowColor: '#0088ff'
    },
    red: {
        name: 'DYNAMICZNA',
        bodyColor: '#ff4444',
        accentsColor: '#ff8888',
        flameColor1: '#ff0000',
        flameColor2: '#ff6600',
        flameColor3: '#ffaa00',
        windowColor: '#ff88ff'
    },
    blue: {
        name: 'CHŁODNA',
        bodyColor: '#4488ff',
        accentsColor: '#8888ff',
        flameColor1: '#00ddff',
        flameColor2: '#4488ff',
        flameColor3: '#88ccff',
        windowColor: '#00ffff'
    },
    gold: {
        name: 'ZŁOTA',
        bodyColor: '#ffdd00',
        accentsColor: '#ffff88',
        flameColor1: '#ffaa00',
        flameColor2: '#ffdd00',
        flameColor3: '#ffff88',
        windowColor: '#ffaa00'
    },
    neon: {
        name: 'NEON',
        bodyColor: '#ff00ff',
        accentsColor: '#ff88ff',
        flameColor1: '#00ff00',
        flameColor2: '#00ffaa',
        flameColor3: '#00ffff',
        windowColor: '#00ff00'
    }
};

const difficultySettings = {
    easy: {
        spawnRate: 0.006,
        speedMultiplier: 0.7,
        label: 'ŁATWY'
    },
    normal: {
        spawnRate: 0.008,
        speedMultiplier: 1.0,
        label: 'NORMALNY'
    },
    hard: {
        spawnRate: 0.015,
        speedMultiplier: 1.3,
        label: 'TRUDNY'
    }
};

const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 80,
    width: 40,
    height: 55,
    speed: 5
};

let asteroids = [];
let stars = [];

function initStars(count = 220) {
    stars = [];
    for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : 2);
        stars.push({
            x: Math.random() * (canvas.width + 200) - 100,
            y: Math.random() * (canvas.height + 200) - 100,
            size: 0.6 + Math.random() * (layer === 0 ? 1.2 : layer === 1 ? 1.8 : 3.2),
            layer: layer,
            phase: Math.random() * Math.PI * 2,
            twinkle: 0.5 + Math.random() * 1.6
        });
    }
}

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

// Event listenery dla przycisków poziomu trudności
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentDifficulty = button.getAttribute('data-difficulty');
        startGame();
    });
});

// Event listenery dla przycisków skinów
skinButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentSkin = button.getAttribute('data-skin');
        localStorage.setItem('selectedSkin', currentSkin);
        updateSkinPreview();
        // Zaznacz aktywny przycisk
        skinButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Event listener dla toggle przycisku
toggleSkinsBtn.addEventListener('click', () => {
    if (skinsMenu.style.display === 'none') {
        skinsMenu.style.display = 'block';
        toggleSkinsBtn.classList.add('active');
    } else {
        skinsMenu.style.display = 'none';
        toggleSkinsBtn.classList.remove('active');
    }
});

restartBtn.addEventListener('click', returnToMenu);

// =================================================================
// 4. DRAW FUNCTIONS - Funkcje odpowiedzialne za rysowanie na Canvas
// =================================================================

function drawFlames(x, y, skinColors, isLeft) {
    const currentTime = Date.now();
    const flameVariation = Math.sin(currentTime * 0.008) * 0.3 + 0.7;
    const flameLength = 25 + Math.sin(currentTime * 0.006) * 8;
    const flameWave = Math.sin(currentTime * 0.005 + (isLeft ? 0 : Math.PI)) * 4;
    
    // Warstwa 1 - Podstawa (czerwona)
    ctx.fillStyle = skinColors.flameColor1;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 6 + flameWave, y + flameLength * 0.5);
    ctx.lineTo(x - 4, y + flameLength);
    ctx.lineTo(x + 4, y + flameLength);
    ctx.lineTo(x + 6 - flameWave, y + flameLength * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Warstwa 2 - Środek (pomarańczowy)
    ctx.fillStyle = skinColors.flameColor2;
    ctx.globalAlpha = 0.7 * flameVariation;
    ctx.beginPath();
    ctx.moveTo(x - 2, y + flameLength * 0.3);
    ctx.lineTo(x - 4 + flameWave * 0.7, y + flameLength * 0.7);
    ctx.lineTo(x - 1, y + flameLength);
    ctx.lineTo(x + 1, y + flameLength);
    ctx.lineTo(x + 4 - flameWave * 0.7, y + flameLength * 0.7);
    ctx.lineTo(x + 2, y + flameLength * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Warstwa 3 - Kончик (żółty/biały)
    ctx.fillStyle = skinColors.flameColor3;
    ctx.globalAlpha = 0.5 * flameVariation;
    ctx.beginPath();
    ctx.moveTo(x - 1, y + flameLength * 0.5);
    ctx.lineTo(x - 2 + flameWave * 0.5, y + flameLength * 0.8);
    ctx.lineTo(x, y + flameLength);
    ctx.lineTo(x + 2 - flameWave * 0.5, y + flameLength * 0.8);
    ctx.lineTo(x + 1, y + flameLength * 0.5);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 1.0;
}

function drawPlayer() {
    const skin = skinDefinitions[currentSkin];
    
    // Główny korpus rakiety (średni rozmiar)
    ctx.fillStyle = skin.bodyColor;
    ctx.beginPath();
    ctx.moveTo(player.x + 20, player.y); // Szczyt
    ctx.lineTo(player.x + 12, player.y + 22);
    ctx.lineTo(player.x + 10, player.y + 42);
    ctx.lineTo(player.x + 30, player.y + 42);
    ctx.lineTo(player.x + 28, player.y + 22);
    ctx.closePath();
    ctx.fill();
    
    // Górna część z zaokrąglonym nosem
    ctx.fillStyle = skin.bodyColor;
    ctx.beginPath();
    ctx.arc(player.x + 20, player.y + 6, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Główne okno kokpitu
    ctx.fillStyle = skin.windowColor;
    ctx.fillRect(player.x + 16, player.y + 10, 8, 8);
    ctx.strokeStyle = skin.accentsColor;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(player.x + 16, player.y + 10, 8, 8);
    
    // Dodatkowe detale - paski aerodynamiczne
    ctx.strokeStyle = skin.accentsColor;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(player.x + 10, player.y + 18);
    ctx.lineTo(player.x + 7, player.y + 38);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(player.x + 30, player.y + 18);
    ctx.lineTo(player.x + 33, player.y + 38);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    
    // Silniki boczne (małe otwory)
    ctx.fillStyle = skin.accentsColor;
    ctx.fillRect(player.x + 6, player.y + 38, 3, 5);
    ctx.fillRect(player.x + 31, player.y + 38, 3, 5);
    
    // Dno rakiety (wylot silnika)
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(player.x + 10, player.y + 42);
    ctx.lineTo(player.x + 30, player.y + 42);
    ctx.lineTo(player.x + 28, player.y + 51);
    ctx.lineTo(player.x + 12, player.y + 51);
    ctx.closePath();
    ctx.fill();
    
    // Rysuj płomienie (dwa wyloty)
    drawFlames(player.x + 14, player.y + 51, skin, true);
    drawFlames(player.x + 26, player.y + 51, skin, false);
}

function drawAsteroid(asteroid) {
    ctx.save();
    // center + rotation
    const cx = asteroid.x + asteroid.size / 2;
    const cy = asteroid.y + asteroid.size / 2;
    ctx.translate(cx, cy);
    ctx.rotate(asteroid.rotation);

    // main shape
    ctx.beginPath();
    const pts = asteroid.vertices;
    ctx.moveTo(pts[0].x - asteroid.size / 2, pts[0].y - asteroid.size / 2);
    for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x - asteroid.size / 2, pts[i].y - asteroid.size / 2);
    }
    ctx.closePath();

    // shading gradient for a 3D look
    const grad = ctx.createRadialGradient(-asteroid.size * 0.15, -asteroid.size * 0.2, asteroid.size * 0.1, 0, 0, asteroid.size);
    grad.addColorStop(0, asteroid.colorLight);
    grad.addColorStop(0.6, asteroid.color);
    grad.addColorStop(1, asteroid.colorDark);
    ctx.fillStyle = grad;
    ctx.fill();

    // subtle edge stroke
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = Math.max(1, asteroid.size * 0.03);
    ctx.stroke();

    // craters
    for (let c of asteroid.craters) {
        ctx.save();
        ctx.translate(c.x - asteroid.size / 2, c.y - asteroid.size / 2);
        // shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(c.r * 0.9 + 1, c.r * 0.9 + 1, c.r, c.r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // crater
        const craterGrad = ctx.createRadialGradient(-c.r * 0.2, -c.r * 0.2, c.r * 0.2, 0, 0, c.r);
        craterGrad.addColorStop(0, 'rgba(120,120,120,0.9)');
        craterGrad.addColorStop(1, 'rgba(40,40,40,0.9)');
        ctx.fillStyle = craterGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, c.r, c.r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
}

function drawStars() {
    // layered starfield with parallax and twinkle
    const time = Date.now();
    for (let s of stars) {
        const parallax = 1 + s.layer * 0.3;
        const x = (s.x + (time * 0.02) * s.layer) % (canvas.width + 200) - 100;
        const y = (s.y + Math.sin((time * 0.001 + s.phase) * 2 * Math.PI) * s.twinkle) % (canvas.height + 200) - 100;

        const alpha = 0.6 + 0.4 * Math.sin(time * 0.005 + s.phase * 10);
        const r = s.size;

        // glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        g.addColorStop(0, `rgba(255,255,255,${0.6 * alpha})`);
        g.addColorStop(0.3, `rgba(255,255,240,${0.25 * alpha})`);
        g.addColorStop(1, 'rgba(255,255,240,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = `rgba(255,255,255,${0.9 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
}

// =================================================================
// 5. LOGIC & UPDATE FUNCTIONS - Funkcje aktualizujące stan gry
// =================================================================
function createAsteroid() {
    const size = 28 + Math.random() * 36; // larger variety
    // generate irregular polygon
    const vertexCount = 7 + Math.floor(Math.random() * 5);
    const vertices = [];
    for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * Math.PI * 2;
        const radius = size * (0.45 + Math.random() * 0.6);
        const vx = Math.cos(angle) * radius + size / 2;
        const vy = Math.sin(angle) * radius + size / 2;
        vertices.push({ x: vx, y: vy });
    }

    // crater list
    const craterCount = Math.floor(Math.random() * 3);
    const craters = [];
    for (let i = 0; i < craterCount; i++) {
        craters.push({
            x: Math.random() * size,
            y: Math.random() * size,
            r: 4 + Math.random() * (size * 0.12)
        });
    }

    const baseGray = 90 + Math.floor(Math.random() * 90);
    return {
        x: Math.random() * (canvas.width - size),
        y: -size - Math.random() * 80,
        size: size,
        speed: 0.6 + Math.random() * 1.8,
        rotation: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        vertices: vertices,
        craters: craters,
        color: `rgb(${baseGray}, ${baseGray}, ${baseGray - 10})`,
        colorLight: `rgb(${Math.min(255, baseGray + 30)}, ${Math.min(255, baseGray + 30)}, ${Math.min(255, baseGray + 20)})`,
        colorDark: `rgb(${Math.max(0, baseGray - 40)}, ${Math.max(0, baseGray - 40)}, ${Math.max(0, baseGray - 45)})`
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
    if (Math.random() < asteroidSpawnRate) { 
        asteroids.push(createAsteroid());
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].y += asteroids[i].speed + gameSpeed;
        // rotate asteroid for more realism
        if (typeof asteroids[i].rotation === 'number') {
            asteroids[i].rotation += asteroids[i].angularSpeed || 0;
        }

        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1);
            score += 10;
            
            // Zwiększaj prędkość dla trybu trudnego co 10 punktów
            if (currentDifficulty === 'hard' && score % 10 === 0) {
                gameSpeed += 0.05;
            }
        }
    }
}

function checkCollisions() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        if (player.x < asteroid.x + asteroid.size &&
            player.x + player.width > asteroid.x &&
            player.y < asteroid.y + asteroid.size &&
            player.y + player.height > asteroid.y) {
            // Usuń asteroidę po zderzeniu
            asteroids.splice(i, 1);
            loseLife();
            return;
        }
    }
}

function updateHUD() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

function updateSkinPreview() {
    const skin = skinDefinitions[currentSkin];
    const centerX = skinPreviewCanvas.width / 2;
    const centerY = skinPreviewCanvas.height / 2 - 20;
    
    skinPreviewCtx.clearRect(0, 0, skinPreviewCanvas.width, skinPreviewCanvas.height);
    
    // Główny korpus
    skinPreviewCtx.fillStyle = skin.bodyColor;
    skinPreviewCtx.beginPath();
    skinPreviewCtx.moveTo(centerX, centerY); 
    skinPreviewCtx.lineTo(centerX - 10, centerY + 25);
    skinPreviewCtx.lineTo(centerX - 12, centerY + 50);
    skinPreviewCtx.lineTo(centerX + 12, centerY + 50);
    skinPreviewCtx.lineTo(centerX + 10, centerY + 25);
    skinPreviewCtx.closePath();
    skinPreviewCtx.fill();
    
    // Nos rakiety
    skinPreviewCtx.fillStyle = skin.bodyColor;
    skinPreviewCtx.beginPath();
    skinPreviewCtx.arc(centerX, centerY - 8, 7, 0, Math.PI * 2);
    skinPreviewCtx.fill();
    
    // Okno kokpitu
    skinPreviewCtx.fillStyle = skin.windowColor;
    skinPreviewCtx.fillRect(centerX - 5, centerY + 5, 10, 10);
    skinPreviewCtx.strokeStyle = skin.accentsColor;
    skinPreviewCtx.lineWidth = 1.5;
    skinPreviewCtx.strokeRect(centerX - 5, centerY + 5, 10, 10);
    
    // Dno rakiety
    skinPreviewCtx.fillStyle = '#333333';
    skinPreviewCtx.beginPath();
    skinPreviewCtx.moveTo(centerX - 12, centerY + 50);
    skinPreviewCtx.lineTo(centerX + 12, centerY + 50);
    skinPreviewCtx.lineTo(centerX + 10, centerY + 60);
    skinPreviewCtx.lineTo(centerX - 10, centerY + 60);
    skinPreviewCtx.closePath();
    skinPreviewCtx.fill();
    
    // Animowane płomienie w podglądzie
    const flameOffset = Math.sin(Date.now() * 0.008) * 5 + 15;
    
    // Lewa strona płomienia
    skinPreviewCtx.fillStyle = skin.flameColor1;
    skinPreviewCtx.globalAlpha = 0.8;
    skinPreviewCtx.beginPath();
    skinPreviewCtx.moveTo(centerX - 6, centerY + 50);
    skinPreviewCtx.quadraticCurveTo(centerX - 15, centerY + 60, centerX - 10, centerY + 60 + flameOffset);
    skinPreviewCtx.quadraticCurveTo(centerX - 5, centerY + 60, centerX - 6, centerY + 50);
    skinPreviewCtx.fill();
    
    // Prawa strona płomienia
    skinPreviewCtx.beginPath();
    skinPreviewCtx.moveTo(centerX + 6, centerY + 50);
    skinPreviewCtx.quadraticCurveTo(centerX + 15, centerY + 60, centerX + 10, centerY + 60 + flameOffset);
    skinPreviewCtx.quadraticCurveTo(centerX + 5, centerY + 60, centerX + 6, centerY + 50);
    skinPreviewCtx.fill();
    
    // Górne warstwy płomienia
    skinPreviewCtx.fillStyle = skin.flameColor2;
    skinPreviewCtx.globalAlpha = 0.6;
    skinPreviewCtx.beginPath();
    skinPreviewCtx.moveTo(centerX - 4, centerY + 50);
    skinPreviewCtx.quadraticCurveTo(centerX - 10, centerY + 55, centerX - 6, centerY + 55 + flameOffset * 0.7);
    skinPreviewCtx.quadraticCurveTo(centerX - 2, centerY + 55, centerX - 4, centerY + 50);
    skinPreviewCtx.fill();
    
    skinPreviewCtx.beginPath();
    skinPreviewCtx.moveTo(centerX + 4, centerY + 50);
    skinPreviewCtx.quadraticCurveTo(centerX + 10, centerY + 55, centerX + 6, centerY + 55 + flameOffset * 0.7);
    skinPreviewCtx.quadraticCurveTo(centerX + 2, centerY + 55, centerX + 4, centerY + 50);
    skinPreviewCtx.fill();
    
    skinPreviewCtx.globalAlpha = 1.0;
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
    updateHUD();

    requestAnimationFrame(gameLoop);
}

function loseLife() {
    lives--;
    updateHUD();
    
    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    gameOverContainer.style.display = 'block';
    finalScoreElement.textContent = `WYNIK: ${score} | Poziom: ${difficultySettings[currentDifficulty].label}`;
}

function returnToMenu() {
    gameRunning = false;
    gameScreen.style.display = 'none';
    menuScreen.style.display = 'block';
    gameOverContainer.style.display = 'none';
}

function startGame() {
    resetGame();
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    gameOverContainer.style.display = 'none';
    gameRunning = true;
    
    // Aktualizuj wskaźnik poziomu trudności
    const difficultyIndicator = document.getElementById('difficultyIndicator');
    if (difficultyIndicator) {
        difficultyIndicator.textContent = difficultySettings[currentDifficulty].label;
    }
    
    updateHUD();
    gameLoop();
}

function resetGame() {
    score = 0;
    lives = 3;
    gameSpeed = 0.5;
    asteroids = [];
    player.x = canvas.width / 2 - 20;
    player.y = canvas.height - 80;
    asteroidSpawnRate = difficultySettings[currentDifficulty].spawnRate;
    updateHUD();
}

// =================================================================
// 7. INITIALIZATION - Uruchomienie gry
// =================================================================
function initGame() {
    // Menu jest domyślnie widoczne, gra czeka na wybór poziomu trudności
    gameScreen.style.display = 'none';
    menuScreen.style.display = 'block';
    skinsMenu.style.display = 'none';
    
    // Zaznacz aktywny skin
    skinButtons.forEach(btn => {
        if (btn.getAttribute('data-skin') === currentSkin) {
            btn.classList.add('active');
        }
    });
    
    // Rysuj podgląd skina
    updateSkinPreview();
    
    // Animuj podgląd skina
    setInterval(updateSkinPreview, 50);
    // Inicjalizuj gwiazdy tła
    initStars();
}

initGame();