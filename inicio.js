// Variables globales compartidas
let currentCategory = "TODAS";
let currentMode = "matching";
let score = 0;
let startTime;
let timerInterval;
let gameStarted = false;

// Elementos DOM
const categorySelector = document.getElementById('categorySelector');
const gameContent = document.getElementById('gameContent');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const modeButtons = document.querySelectorAll('.mode-btn');

// Inicializar el juego
function initGame() {
    loadCategories();
    resetGame();
    addEventListeners();
}

// Cargar categorías
function loadCategories() {
    // Añadir opción "TODAS"
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.textContent = 'TODAS';
    allBtn.dataset.category = 'TODAS';
    categorySelector.appendChild(allBtn);

    // Añadir categorías desde los datos
    for (const category in vocabularyData) {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.dataset.category = category;
        categorySelector.appendChild(btn);
    }
}

// Añadir event listeners
function addEventListeners() {
    // Event listener para botones de categoría
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            resetGame();
        });
    });

    // Event listener para botones de modo
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
            resetGame();
        });
    });

    // Event listener para botón de inicio
    startBtn.addEventListener('click', startGame);

    // Event listener para botón de reinicio
    resetBtn.addEventListener('click', resetGame);
}

// Función para resetear el juego
function resetGame() {
    gameStarted = false;
    startBtn.textContent = "Empezar";
    score = 0;
    scoreElement.textContent = score;
    clearInterval(timerInterval);
    timeElement.textContent = "00:00";
    gameContent.innerHTML = "<p style='text-align: center; padding: 20px;'>Selecciona una categoría y un modo de juego, luego presiona 'Empezar'</p>";
}

// Función para iniciar el juego
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startBtn.textContent = "Pausa";
        score = 0;
        scoreElement.textContent = score;

        // Iniciar temporizador
        startTime = new Date();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);

        // Cargar el juego según el modo seleccionado
        loadGameByMode();
    } else {
        // Pausar el juego
        gameStarted = false;
        startBtn.textContent = "Continuar";
        clearInterval(timerInterval);
    }
}

// Función para actualizar el temporizador
function updateTimer() {
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timeElement.textContent = `${minutes}:${seconds}`;
}

// Función para cargar el juego según el modo seleccionado
function loadGameByMode() {
    switch (currentMode) {
        case "matching":
            loadMatchingGame(currentCategory);
            break;
        case "flashcards":
            loadFlashcardGame(currentCategory);
            break;
        case "quiz":
            loadQuizGame(currentCategory);
            break;
    }
}

// Función para finalizar el juego (común para todos los modos)
function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    startBtn.textContent = "Empezar";
    
    const endTime = new Date();
    const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
    const timeBonus = Math.max(0, 100 - elapsedSeconds);
    
    score += timeBonus;
    scoreElement.textContent = score;
    
    gameContent.innerHTML += `
        <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px;">
            <h2>¡Felicidades!</h2>
            <p>Has completado el juego con ${score} puntos.</p>
            <p>Tiempo total: ${timeElement.textContent}</p>
            <p>Bonus por tiempo: +${timeBonus}</p>
        </div>
    `;

    // Efecto de celebración
    createConfetti();
}

// Función para crear efecto de confeti
function createConfetti() {
    const confettiCount = 100;
    const colors = ['#0047A0', '#C91F37', '#FFD700', '#4CAF50', '#9C27B0'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        document.body.appendChild(confetti);
        
        // Eliminar después de la animación
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Iniciar el juego cuando se carga la página
window.addEventListener('DOMContentLoaded', initGame);