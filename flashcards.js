// Variables específicas del juego de flashcards
let flashcardVocabulary = [];
let flashcardIndex = 0;
let isFlipped = false;

// Función para cargar el juego de flashcards
function loadFlashcardGame(category) {
    flashcardIndex = 0;
    isFlipped = false;
    
    // Obtener vocabulario aleatorio
    flashcardVocabulary = getRandomVocabulary(20, category);
    
    // Crear estructura básica de flashcards
    gameContent.innerHTML = `
        <div class="flashcard-container">
            <div id="flashcard" class="flashcard">
                <div class="flashcard-front">
                    <div class="flashcard-word"></div>
                    <div class="flashcard-pronunciation"></div>
                </div>
                <div class="flashcard-back">
                    <div class="flashcard-translation"></div>
                </div>
            </div>
            <div class="flashcard-progress">
                <span id="currentCard">1</span> / <span id="totalCards">${flashcardVocabulary.length}</span>
            </div>
            <div class="flashcard-controls">
                <button id="prevBtn" disabled>Anterior</button>
                <button id="flipBtn">Voltear</button>
                <button id="nextBtn">Siguiente</button>
            </div>
            <div class="flashcard-options">
                <label>
                    <input type="checkbox" id="autoFlip"> Auto-voltear después de 3 segundos
                </label>
                <label>
                    <select id="cardDirection">
                        <option value="kor2spa">Coreano → Español</option>
                        <option value="spa2kor">Español → Coreano</option>
                        <option value="random">Aleatorio</option>
                    </select>
                </label>
            </div>
        </div>
    `;
    
    // Añadir estilos específicos para las flashcards
    const style = document.createElement('style');
    style.textContent = `
        .flashcard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .flashcard {
            width: 100%;
            max-width: 400px;
            height: 250px;
            perspective: 1000px;
            margin-bottom: 20px;
            cursor: pointer;
            position: relative;
        }
        
        .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            transition: transform 0.6s;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            padding: 20px;
            box-sizing: border-box;
        }
        
        .flashcard-front {
            background-color: var(--korean-blue);
            color: white;
        }
        
        .flashcard-back {
            background-color: var(--korean-white);
            color: var(--korean-black);
            transform: rotateY(180deg);
            border: 2px solid var(--korean-blue);
        }
        
        .flashcard.flipped .flashcard-front {
            transform: rotateY(180deg);
        }
        
        .flashcard.flipped .flashcard-back {
            transform: rotateY(0deg);
        }
        
        .flashcard-word {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .flashcard-pronunciation {
            font-size: 18px;
            font-style: italic;
        }
        
        .flashcard-translation {
            font-size: 24px;
            font-weight: bold;
        }
        
        .flashcard-controls {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .flashcard-progress {
            margin: 10px 0;
            font-size: 16px;
            font-weight: bold;
        }
        
        .flashcard-options {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        
        #cardDirection {
            padding: 5px;
            border-radius: 4px;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
    
    // Renderizar la primera flashcard
    renderFlashcard();
    
    // Añadir event listeners
    document.getElementById('flashcard').addEventListener('click', flipFlashcard);
    document.getElementById('flipBtn').addEventListener('click', flipFlashcard);
    document.getElementById('prevBtn').addEventListener('click', prevFlashcard);
    document.getElementById('nextBtn').addEventListener('click', nextFlashcard);
    document.getElementById('cardDirection').addEventListener('change', renderFlashcard);
    
    // Configurar autoflip
    const autoFlipCheckbox = document.getElementById('autoFlip');
    let autoFlipTimer;
    
    autoFlipCheckbox.addEventListener('change', function() {
        if (this.checked) {
            startAutoFlip();
        } else {
            clearTimeout(autoFlipTimer);
        }
    });
    
    function startAutoFlip() {
        if (autoFlipCheckbox.checked && !isFlipped) {
            clearTimeout(autoFlipTimer);
            autoFlipTimer = setTimeout(flipFlashcard, 3000);
        }
    }
}

// Función para renderizar una flashcard
function renderFlashcard() {
    if (flashcardIndex >= flashcardVocabulary.length) {
        // Se han completado todas las flashcards
        gameContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>¡Has completado todas las flashcards!</h2>
                <p>Has visto ${flashcardVocabulary.length} palabras.</p>
                <button id="restartFlashcards" class="start-btn">Reiniciar Flashcards</button>
            </div>
        `;
        document.getElementById('restartFlashcards').addEventListener('click', () => loadFlashcardGame(currentCategory));
        return;
    }
    
    const word = flashcardVocabulary[flashcardIndex];
    const cardDirection = document.getElementById('cardDirection').value;
    
    const flashcard = document.getElementById('flashcard');
    const wordElement = document.querySelector('.flashcard-word');
    const pronunciationElement = document.querySelector('.flashcard-pronunciation');
    const translationElement = document.querySelector('.flashcard-translation');
    
    // Resetear el estado de la tarjeta
    flashcard.classList.remove('flipped');
    isFlipped = false;
    
    // Determinar qué mostrar en el frente según la dirección
    let showKoreanFirst = true;
    if (cardDirection === 'spa2kor') {
        showKoreanFirst = false;
    } else if (cardDirection === 'random') {
        showKoreanFirst = Math.random() > 0.5;
    }
    
    if (showKoreanFirst) {
        // Coreano en el frente, español en el reverso
        wordElement.textContent = word.korean;
        pronunciationElement.textContent = `(${word.pronunciation})`;
        translationElement.textContent = word.spanish;
    } else {
        // Español en el frente, coreano en el reverso
        wordElement.textContent = word.spanish;
        pronunciationElement.textContent = '';
        translationElement.innerHTML = `${word.korean}<br><small>(${word.pronunciation})</small>`;
    }
    
    // Actualizar contador de progreso
    document.getElementById('currentCard').textContent = flashcardIndex + 1;
    document.getElementById('totalCards').textContent = flashcardVocabulary.length;
    
    // Habilitar/deshabilitar botones según la posición
    document.getElementById('prevBtn').disabled = flashcardIndex === 0;
    
    // Iniciar autoflip si está activado
    if (document.getElementById('autoFlip') && document.getElementById('autoFlip').checked) {
        setTimeout(flipFlashcard, 3000);
    }
}

// Función para voltear la flashcard
function flipFlashcard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
    
    // Dar puntos por ver ambos lados
    if (isFlipped) {
        score += 1;
        scoreElement.textContent = score;
    }
}

// Función para ir a la flashcard anterior
function prevFlashcard() {
    if (flashcardIndex > 0) {
        flashcardIndex--;
        renderFlashcard();
    }
}

// Función para ir a la flashcard siguiente
function nextFlashcard() {
    flashcardIndex++;
    score += 2; // Dar puntos por avanzar
    scoreElement.textContent = score;
    renderFlashcard();
    
    // Si se han visto todas las flashcards, mostrar mensaje de felicitación
    if (flashcardIndex >= flashcardVocabulary.length) {
        endGame();
    }
}