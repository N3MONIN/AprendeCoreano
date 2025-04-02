// Variables específicas del juego de emparejamiento
let matchingVocabulary = [];
let selectedCards = [];
let correctPairs = 0;
let errorCount = 0;

// Función para cargar el juego de emparejamiento
function loadMatchingGame(category) {
    gameContent.innerHTML = `
        <div class="matching-options" style="margin-bottom: 15px; text-align: center;">
            <label for="showPronunciation" style="margin-right: 10px; display: inline-block; cursor: pointer;">
                <input type="checkbox" id="showPronunciation" checked> 
                Mostrar pronunciación
            </label>
            <select id="pairCount" style="margin-left: 15px;">
                <option value="5">5 parejas</option>
                <option value="8" selected>8 parejas</option>
                <option value="12">12 parejas</option>
                <option value="15">15 parejas</option>
            </select>
        </div>
        <div class="matching-stats" style="text-align: center; margin-bottom: 10px;">
            <span id="errorCounter" style="color: var(--korean-red);">Errores: 0</span>
        </div>
        <div id="gameBoard" class="matching-board"></div>
    `;
    
    const gameBoard = document.getElementById('gameBoard');
    const showPronunciationCheckbox = document.getElementById('showPronunciation');
    const pairCountSelect = document.getElementById('pairCount');
    
    selectedCards = [];
    correctPairs = 0;
    errorCount = 0;
    
    // Obtener vocabulario aleatorio
    const pairCount = parseInt(pairCountSelect.value);
    loadMatchingPairs(pairCount, category);
    
    // Función para renderizar las tarjetas
    function renderCards() {
        gameBoard.innerHTML = '';
        const showPronunciation = showPronunciationCheckbox.checked;
        
        // Crear el contenedor con estilos CSS
        gameBoard.style.display = 'flex';
        gameBoard.style.flexDirection = 'column';
        gameBoard.style.gap = '10px';
        
        // Para cada ítem de vocabulario, crear una fila con dos columnas
        matchingVocabulary.forEach((item, index) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.width = '100%';
            row.style.gap = '10px';
            
            // Columna para la palabra coreana
            const koreanCard = document.createElement('div');
            koreanCard.className = 'card matching-card';
            koreanCard.dataset.id = item.korean;
            koreanCard.dataset.type = 'korean';
            koreanCard.dataset.index = `korean-${index}`;
            koreanCard.style.width = '50%';
            
            if (showPronunciation) {
                koreanCard.innerHTML = `
                    <div><strong>${item.korean}</strong></div>
                    <div><small>(${item.pronunciation})</small></div>
                `;
            } else {
                koreanCard.innerHTML = `<div><strong>${item.korean}</strong></div>`;
            }
            
            // Columna para la traducción en español
            const spanishCard = document.createElement('div');
            spanishCard.className = 'card matching-card';
            spanishCard.dataset.id = item.korean;
            spanishCard.dataset.type = 'spanish';
            spanishCard.dataset.index = `spanish-${index}`;
            spanishCard.style.width = '50%';
            spanishCard.innerHTML = `<div>${item.spanish}</div>`;
            
            // Añadir event listeners
            koreanCard.addEventListener('click', handleCardClick);
            spanishCard.addEventListener('click', handleCardClick);
            
            // Añadir a la fila
            row.appendChild(koreanCard);
            row.appendChild(spanishCard);
            
            // Añadir fila al tablero
            gameBoard.appendChild(row);
        });
        
        // Mezclar las tarjetas en español (segunda columna)
        const spanishCards = Array.from(gameBoard.querySelectorAll('.card[data-type="spanish"]'));
        const spanishContainers = spanishCards.map(card => card.parentNode);
        
        // Desvincular las tarjetas españolas de sus padres
        spanishCards.forEach(card => card.parentNode.removeChild(card));
        
        // Mezclar el array de tarjetas españolas
        spanishCards.sort(() => 0.5 - Math.random());
        
        // Volver a añadir las tarjetas mezcladas
        spanishCards.forEach((card, index) => {
            spanishContainers[index].appendChild(card);
        });
        
        // Mantener el estado actual del juego después de renderizar
        updateGameState();
    }
    
    // Función para mantener el estado del juego después de renderizar
    function updateGameState() {
        // Restaurar las tarjetas correctas
        matchingVocabulary.forEach((item, index) => {
            if (index < correctPairs) {
                const koreanCard = document.querySelector(`.card[data-index="korean-${index}"]`);
                const spanishCards = Array.from(document.querySelectorAll(`.card[data-type="spanish"]`));
                const matchingSpanishCard = spanishCards.find(card => card.dataset.id === item.korean);
                
                if (koreanCard && matchingSpanishCard) {
                    koreanCard.classList.add('correct');
                    matchingSpanishCard.classList.add('correct');
                }
            }
        });
    }
    
    // Cargar las parejas iniciales
    function loadMatchingPairs(count, category) {
        matchingVocabulary = getRandomVocabulary(count, category);
        errorCount = 0;
        document.getElementById('errorCounter').textContent = `Errores: ${errorCount}`;
        renderCards();
    }
    
    // Añadir listener para el checkbox de pronunciación
    showPronunciationCheckbox.addEventListener('change', renderCards);
    
    // Añadir listener para el selector de cantidad de parejas
    pairCountSelect.addEventListener('change', function() {
        const newPairCount = parseInt(this.value);
        loadMatchingPairs(newPairCount, category);
        resetMatchingGame();
    });
    
    // Añadir estilos específicos para el modo emparejar
    const style = document.createElement('style');
    style.textContent = `
        .matching-board {
            min-height: 300px;
        }
        
        .matching-card {
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 60px;
            user-select: none;
            position: relative;
            border: 2px solid transparent;
            background-color: #f8f8f8;
            border-radius: 5px;
            cursor: pointer;
            padding: 10px;
        }
        
        .matching-card.selected {
            transform: scale(1.05);
            border-color: var(--korean-blue);
            box-shadow: 0 0 8px rgba(0, 71, 160, 0.5);
            background-color: #e3f2fd;
        }
        
        .matching-card.correct {
            animation: pulse 1s;
            border-color: #4CAF50;
            background-color: #e8f5e9;
        }
        
        .matching-card.incorrect {
            animation: shake 0.5s;
            border-color: var(--korean-red);
            background-color: #ffebee;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        .matching-options {
            background-color: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        
        #pairCount {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }

        /* Añadir estilo al contador de errores */
        .matching-stats {
            background-color: #fff9c4;
            padding: 8px;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
        }
        
        /* Mejorar el estilo del checkbox */
        #showPronunciation {
            cursor: pointer;
            margin-right: 5px;
        }
        
        /* Añadir tooltip explicativo */
        .tooltip {
            position: relative;
            display: inline-block;
        }
        
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -100px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Función para manejar el clic en una tarjeta
function handleCardClick(event) {
    // Protección contra clics si el juego no está iniciado
    if (!gameStarted) {
        console.log("El juego no está iniciado");
        return;
    }
    
    // Proteger contra más de 2 selecciones
    if (selectedCards.length >= 2) {
        console.log("Ya hay 2 tarjetas seleccionadas");
        return;
    }
    
    const card = event.currentTarget;
    const index = card.dataset.index;
    const type = card.dataset.type;
    
    // No permitir seleccionar tarjetas ya emparejadas
    if (card.classList.contains('correct')) {
        console.log("Tarjeta ya correcta");
        return;
    }
    
    // Si la tarjeta ya está seleccionada, deseleccionarla
    if (selectedCards.includes(index)) {
        card.classList.remove('selected');
        selectedCards = selectedCards.filter(item => item !== index);
        console.log("Tarjeta deseleccionada:", index);
        return;
    }
    
    // Comprobar si ya hay una tarjeta seleccionada del mismo tipo
    const sameTypeSelected = selectedCards.find(cardIndex => {
        const selectedCard = document.querySelector(`.card[data-index="${cardIndex}"]`);
        return selectedCard && selectedCard.dataset.type === type;
    });
    
    // Si ya hay una tarjeta del mismo tipo seleccionada, deseleccionarla
    if (sameTypeSelected) {
        const previousCard = document.querySelector(`.card[data-index="${sameTypeSelected}"]`);
        if (previousCard) {
            previousCard.classList.remove('selected');
            selectedCards = selectedCards.filter(item => item !== sameTypeSelected);
            console.log("Deseleccionada tarjeta anterior del mismo tipo:", sameTypeSelected);
        }
    }
    
    // Seleccionar la nueva tarjeta
    card.classList.add('selected');
    selectedCards.push(index);
    
    console.log("Tarjeta seleccionada:", index, "Total seleccionadas:", selectedCards.length);
    
    // Si se han seleccionado dos tarjetas, verificar si coinciden
    if (selectedCards.length === 2) {
        const card1 = document.querySelector(`.card[data-index="${selectedCards[0]}"]`);
        const card2 = document.querySelector(`.card[data-index="${selectedCards[1]}"]`);
        
        // Verificar que son de tipos diferentes (coreano y español)
        const isTypeDifferent = card1.dataset.type !== card2.dataset.type;
        // Verificar que tienen el mismo ID (misma palabra)
        const isSameId = card1.dataset.id === card2.dataset.id;
        
        console.log("Verificando coincidencia:", 
                    "Tipos diferentes:", isTypeDifferent, 
                    "Mismo ID:", isSameId);
        
        if (isTypeDifferent && isSameId) {
            // Coincidencia correcta
            let timeoutId = setTimeout(() => {
                card1.classList.remove('selected');
                card2.classList.remove('selected');
                card1.classList.add('correct');
                card2.classList.add('correct');
                
                // Sonido de acierto
                playSound('correct');
                
                score += 10;
                scoreElement.textContent = score;
                correctPairs++;
                
                // Liberar el array de tarjetas seleccionadas para permitir nuevas selecciones
                selectedCards = [];
                console.log("Coincidencia correcta. Parejas encontradas:", correctPairs);
                
                // Verificar si se han encontrado todas las parejas
                if (correctPairs === matchingVocabulary.length) {
                    endMatchingGame();
                    clearTimeout(timeoutId);
                }
            }, 500);
        } else {
            // Coincidencia incorrecta
            let errorTimeoutId = setTimeout(() => {
                card1.classList.add('incorrect');
                card2.classList.add('incorrect');
                
                // Incrementar contador de errores y actualizarlo en la UI
                errorCount++;
                document.getElementById('errorCounter').textContent = `Errores: ${errorCount}`;
                console.log("Error de coincidencia. Total errores:", errorCount);
                
                // Sonido de error
                playSound('error');
                
                // Penalizar en la puntuación
                score = Math.max(0, score - 2);
                scoreElement.textContent = score;
                
                setTimeout(() => {
                    card1.classList.remove('selected');
                    card2.classList.remove('selected');
                    card1.classList.remove('incorrect');
                    card2.classList.remove('incorrect');
                    
                    // Liberar el array de tarjetas seleccionadas para permitir nuevas selecciones
                    selectedCards = [];
                }, 800);
                
                clearTimeout(errorTimeoutId);
            }, 500);
        }
    }
}

// Función para reiniciar el juego de emparejamiento
function resetMatchingGame() {
    selectedCards = [];
    correctPairs = 0;
    errorCount = 0;
    
    // Actualizar contador de errores
    const errorCounter = document.getElementById('errorCounter');
    if (errorCounter) {
        errorCounter.textContent = `Errores: ${errorCount}`;
    }
    
    // Reiniciar las tarjetas
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected', 'correct', 'incorrect');
    });
}

// Función específica para finalizar el juego de emparejamiento
function endMatchingGame() {
    // Obtener el tiempo transcurrido
    const endTime = new Date();
    const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
    const timeBonus = Math.max(0, 100 - elapsedSeconds);
    
    // Añadir bonus por tiempo
    score += timeBonus;
    scoreElement.textContent = score;
    
    // Calcular puntuación final considerando errores
    const finalScore = score - (errorCount * 5); // Penalización por errores
    
    // Añadir resumen al contenido del juego
    gameContent.innerHTML += `
        <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px;">
            <h2>¡Felicidades!</h2>
            <p>Has completado el juego con ${score} puntos.</p>
            <p>Tiempo total: ${timeElement.textContent}</p>
            <p>Bonus por tiempo: +${timeBonus}</p>
            <p>Total de errores: <span style="color: var(--korean-red);">${errorCount}</span></p>
            <p>Puntuación final: <strong>${finalScore}</strong></p>
        </div>
    `;
    
    // Detener el temporizador y actualizar estado del juego
    clearInterval(timerInterval);
    gameStarted = false;
    startBtn.textContent = "Empezar";
    
    // Efecto de celebración
    createConfetti();
}

// Función para reproducir sonidos
function playSound(type) {
    // Implementación básica de sonidos (se podría ampliar)
    const audio = new Audio();
    
    switch(type) {
        case 'click':
            // audio.src = 'sounds/click.mp3';
            break;
        case 'correct':
            // audio.src = 'sounds/correct.mp3';
            break;
        case 'error':
            // audio.src = 'sounds/error.mp3';
            break;
    }
    
    // audio.play().catch(e => console.log('Error reproduciendo audio:', e));
}