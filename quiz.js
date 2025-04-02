// Variables específicas del juego de quiz
let quizQuestions = [];
let currentQuizQuestion = 0;
let selectedQuizOption = null;
let quizCorrectAnswers = 0;

// Función para cargar el juego de quiz
function loadQuizGame(category) {
    currentQuizQuestion = 0;
    selectedQuizOption = null;
    quizCorrectAnswers = 0;
    
    // Estructura básica del quiz
    gameContent.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-options">
                <select id="questionCount">
                    <option value="5">5 preguntas</option>
                    <option value="10" selected>10 preguntas</option>
                    <option value="15">15 preguntas</option>
                    <option value="20">20 preguntas</option>
                </select>
                <select id="quizDirection">
                    <option value="both" selected>Ambas direcciones</option>
                    <option value="kor2spa">Coreano → Español</option>
                    <option value="spa2kor">Español → Coreano</option>
                </select>
                <button id="startQuiz">Iniciar Quiz</button>
            </div>
            <div id="quizContent" class="quiz-content">
                <p>Selecciona la cantidad de preguntas y dirección, luego presiona "Iniciar Quiz".</p>
            </div>
        </div>
    `;
    
    // Añadir estilos específicos para el quiz
    const style = document.createElement('style');
    style.textContent = `
        .quiz-container {
            padding: 20px;
        }
        
        .quiz-options {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .quiz-options select, .quiz-options button {
            padding: 8px 12px;
            border-radius: 4px;
        }
        
        .quiz-content {
            min-height: 300px;
        }
        
        .quiz-question {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f0f8ff;
            border-radius: 8px;
        }
        
        .quiz-pronunciation {
            font-size: 16px;
            color: #666;
            font-style: italic;
            margin-top: 5px;
        }
        
        .quiz-answers {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .quiz-answer {
            padding: 15px;
            background-color: white;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s ease;
        }
        
        .quiz-answer:hover {
            background-color: #f5f5f5;
            transform: translateY(-2px);
        }
        
        .quiz-answer.selected {
            border-color: var(--korean-blue);
            background-color: #e3f2fd;
        }
        
        .quiz-answer.correct {
            border-color: #4CAF50;
            background-color: #e8f5e9;
        }
        
        .quiz-answer.incorrect {
            border-color: var(--korean-red);
            background-color: #ffebee;
        }
        
        .quiz-progress {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            font-weight: bold;
        }
        
        .quiz-controls {
            text-align: center;
            margin-top: 15px;
        }
        
        .quiz-result {
            text-align: center;
            padding: 20px;
            background-color: #e8f5e9;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .quiz-score {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin: 10px 0;
        }
        
        .progress-bar {
            width: 100%;
            height: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--korean-blue);
            border-radius: 5px;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Añadir event listener para el botón de inicio del quiz
    document.getElementById('startQuiz').addEventListener('click', () => {
        const questionCount = parseInt(document.getElementById('questionCount').value);
        const quizDirection = document.getElementById('quizDirection').value;
        
        generateQuizQuestions(questionCount, category, quizDirection);
        startQuizGame();
    });
}

// Función para generar preguntas de quiz
function generateQuizQuestions(count, category, direction) {
    const allVocabulary = getVocabularyByCategory(category);
    const shuffled = [...allVocabulary].sort(() => 0.5 - Math.random());
    
    quizQuestions = [];
    
    // Crear preguntas basadas en el conteo solicitado
    const questionCount = Math.min(count, shuffled.length);
    
    for (let i = 0; i < questionCount; i++) {
        const correctAnswer = shuffled[i];
        
        // Obtener opciones incorrectas (evitar duplicados)
        const incorrectOptions = shuffled
            .filter(item => item.korean !== correctAnswer.korean)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        // Determinar dirección de la pregunta (coreano a español o español a coreano)
        const isKoreanToSpanish = direction === 'both' ? Math.random() < 0.5 : direction === 'kor2spa';
        
        const question = {
            id: i,
            questionType: isKoreanToSpanish ? 'korean' : 'spanish',
            question: isKoreanToSpanish ? correctAnswer.korean : correctAnswer.spanish,
            pronunciation: isKoreanToSpanish ? correctAnswer.pronunciation : null,
            correctAnswer: isKoreanToSpanish ? correctAnswer.spanish : correctAnswer.korean,
            correctIndex: null, // Se establecerá después de mezclar
            options: []
        };
        
        // Añadir la respuesta correcta y las incorrectas
        const options = [
            isKoreanToSpanish ? correctAnswer.spanish : correctAnswer.korean,
            ...incorrectOptions.map(option => isKoreanToSpanish ? option.spanish : option.korean)
        ];
        
        // Mezclar opciones y guardar el índice correcto
        const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
        question.options = shuffledOptions;
        question.correctIndex = shuffledOptions.indexOf(options[0]);
        
        quizQuestions.push(question);
    }
}

// Función para iniciar el juego de quiz
function startQuizGame() {
    renderQuizQuestion();
}

// Función para renderizar la pregunta actual
function renderQuizQuestion() {
    const quizContent = document.getElementById('quizContent');
    
    // Verificar si se han completado todas las preguntas
    if (currentQuizQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    
    // Construir HTML de la pregunta
    let questionHTML = `
        <div class="quiz-question">
            <div>${question.questionType === 'korean' ? '¿Qué significa en español?' : '¿Cómo se dice en coreano?'}</div>
            <div style="font-size: 32px; margin: 15px 0;">${question.question}</div>
    `;
    
    // Añadir pronunciación si es una palabra coreana
    if (question.pronunciation) {
        questionHTML += `<div class="quiz-pronunciation">(${question.pronunciation})</div>`;
    }
    
    questionHTML += `</div>`;
    
    // Añadir opciones de respuesta
    questionHTML += `<div class="quiz-answers">`;
    
    question.options.forEach((option, index) => {
        questionHTML += `
            <div class="quiz-answer" data-index="${index}">
                ${option}
            </div>
        `;
    });
    
    questionHTML += `</div>`;
    
    // Añadir barra de progreso
    const progress = ((currentQuizQuestion + 1) / quizQuestions.length) * 100;
    
    questionHTML += `
        <div class="quiz-progress">
            <div>Pregunta ${currentQuizQuestion + 1} de ${quizQuestions.length}</div>
            <div>Aciertos: ${quizCorrectAnswers}</div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="quiz-controls">
            <button id="checkAnswer" disabled>Comprobar</button>
        </div>
    `;
    
    quizContent.innerHTML = questionHTML;
    
    // Añadir event listeners a las opciones de respuesta
    document.querySelectorAll('.quiz-answer').forEach(option => {
        option.addEventListener('click', handleQuizOptionClick);
    });
    
    // Añadir event listener al botón de comprobar
    document.getElementById('checkAnswer').addEventListener('click', checkQuizAnswer);
}

// Función para manejar el clic en una opción del quiz
function handleQuizOptionClick(event) {
    // Desactivar selección si no está en juego
    if (!gameStarted) return;
    
    const option = event.currentTarget;
    const index = parseInt(option.dataset.index);
    
    // Deseleccionar la opción anterior si hay una
    if (selectedQuizOption !== null) {
        const prevSelected = document.querySelector(`.quiz-answer[data-index="${selectedQuizOption}"]`);
        if (prevSelected) prevSelected.classList.remove('selected');
    }
    
    // Seleccionar la nueva opción
    option.classList.add('selected');
    selectedQuizOption = index;
    
    // Habilitar botón de comprobar
    const checkButton = document.getElementById('checkAnswer');
    if (checkButton) checkButton.disabled = false;
}

// Función para comprobar la respuesta del quiz
function checkQuizAnswer() {
    if (selectedQuizOption === null) return;
    
    const question = quizQuestions[currentQuizQuestion];
    const isCorrect = selectedQuizOption === question.correctIndex;
    
    // Marcar todas las opciones según sean correctas o incorrectas
    document.querySelectorAll('.quiz-answer').forEach((option, index) => {
        if (index === question.correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedQuizOption && !isCorrect) {
            option.classList.add('incorrect');
        }
        
        // Deshabilitar todos los clics en las opciones
        option.style.pointerEvents = 'none';
    });
    
    // Actualizar puntuación
    if (isCorrect) {
        quizCorrectAnswers++;
        score += 5;
        scoreElement.textContent = score;
    }
    
    // Cambiar botón a "Siguiente"
    const checkButton = document.getElementById('checkAnswer');
    checkButton.textContent = 'Siguiente';
    checkButton.removeEventListener('click', checkQuizAnswer);
    checkButton.addEventListener('click', nextQuizQuestion);
}

// Función para avanzar a la siguiente pregunta
function nextQuizQuestion() {
    currentQuizQuestion++;
    selectedQuizOption = null;
    renderQuizQuestion();
}

// Función para mostrar los resultados finales del quiz
function showQuizResults() {
    const percentage = Math.round((quizCorrectAnswers / quizQuestions.length) * 100);
    const quizContent = document.getElementById('quizContent');
    
    // Añadir puntos de bonificación por completar el quiz
    const bonusPoints = quizCorrectAnswers * 2;
    score += bonusPoints;
    scoreElement.textContent = score;
    
    quizContent.innerHTML = `
        <div class="quiz-result">
            <h2>¡Quiz completado!</h2>
            <div class="quiz-score">${quizCorrectAnswers} de ${quizQuestions.length} correctas (${percentage}%)</div>
            <div>Has ganado ${bonusPoints} puntos adicionales de bonificación.</div>
            <div style="margin-top: 20px;">
                <button id="restartQuiz" class="start-btn">Reiniciar Quiz</button>
            </div>
        </div>
    `;
    
    // Si el porcentaje es muy alto, mostrar celebración
    if (percentage >= 80) {
        endGame();
    }
    
    // Añadir event listener para reiniciar
    document.getElementById('restartQuiz').addEventListener('click', () => {
        loadQuizGame(currentCategory);
    });
}