// Game Variables
let theme = '';
let difficulty = '';
let score = 0;
let mistakes = 0;
let correctAnswersStreak = 0;
let currentDifficultyLevel = 0; // 0: Easy, 1: Medium, 2: Hard, 3: Impossible
const difficulties = ['Easy', 'Medium', 'Hard', 'Impossible'];
let correctOption = '';
let explanation = '';

// Screen Elements
const themeScreen = document.getElementById('theme-screen');
const difficultyScreen = document.getElementById('difficulty-screen');
const quizScreen = document.getElementById('quiz-screen');
const feedbackScreen = document.getElementById('feedback-screen');
const gameoverScreen = document.getElementById('gameover-screen');

// Initialize game
function initGame() {
    showScreen('theme-screen');
}

// Show specific screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Theme Screen Elements
const themeInput = document.getElementById('theme-input');
const themeSubmit = document.getElementById('theme-submit');
const themeError = document.getElementById('theme-error');

// Difficulty Screen Elements
const difficultyButtons = document.querySelectorAll('.difficulty-button');

// Quiz Screen Elements
const questionText = document.getElementById('question-text');
const optionButtons = document.querySelectorAll('.option-button');
const scoreDisplay = document.getElementById('score-display');
const mistakesDisplay = document.getElementById('mistakes-display');

// Feedback Screen Elements
const feedbackMessage = document.getElementById('feedback-message');
const correctAnswerDisplay = document.getElementById('correct-answer');
const explanationDisplay = document.getElementById('explanation');
const nextQuestionButton = document.getElementById('next-question');

// Game Over Screen Elements
const finalScoreDisplay = document.getElementById('final-score');
const restartGameButton = document.getElementById('restart-game');

// Event Listeners
themeSubmit.addEventListener('click', handleThemeSubmit);
difficultyButtons.forEach(button => {
    button.addEventListener('click', handleDifficultySelection);
});
optionButtons.forEach(button => {
    button.addEventListener('click', handleOptionSelection);
});
nextQuestionButton.addEventListener('click', () => {
    showScreen('quiz-screen');
    generateQuestion();
});
restartGameButton.addEventListener('click', resetGame);

// Functions

function handleThemeSubmit() {
    themeError.textContent = '';
    theme = themeInput.value.trim();

    if (theme.length === 0) {
        themeError.textContent = 'Please enter a theme.';
        return;
    }

    if (theme.length > 30) {
        themeError.textContent = 'Theme must be 30 characters or less.';
        return;
    }

    // Call API to validate theme
    validateThemeWithGPT(theme).then(isValid => {
        if (isValid) {
            // Proceed to difficulty selection
            showScreen('difficulty-screen');
        } else {
            themeError.textContent = 'Invalid theme. Please enter a suitable theme.';
        }
    }).catch(error => {
        themeError.textContent = 'Error validating theme. Please try again.';
        console.error(error);
    });
}

function handleDifficultySelection(event) {
    difficulty = event.target.getAttribute('data-difficulty');
    currentDifficultyLevel = difficulties.indexOf(difficulty);

    // Proceed to quiz
    showScreen('quiz-screen');
    generateQuestion();
}

function handleOptionSelection(event) {
    const selectedOption = event.target.getAttribute('data-option');
    checkAnswer(selectedOption);
}

function generateQuestion() {
    updateGameState();
    // Clear previous options
    optionButtons.forEach(button => {
        button.textContent = '';
        button.classList.remove('correct', 'wrong');
        button.disabled = true;
    });
    questionText.textContent = 'Loading question...';

    // Use apiHandler.js to generate question
    generateQuestionWithGPT(theme, difficulties[currentDifficultyLevel]).then(questionData => {
        questionText.textContent = questionData.question;
        correctOption = questionData.correctOption;
        explanation = questionData.explanation;

        optionButtons.forEach(button => {
            const option = button.getAttribute('data-option');
            button.textContent = questionData.options[option];
            button.disabled = false;
        });
    }).catch(error => {
        questionText.textContent = 'Error generating question. Please try again.';
        console.error(error);
    });
}

function checkAnswer(selectedOption) {
    if (selectedOption === correctOption) {
        // Correct answer
        score++;
        correctAnswersStreak++;
        feedbackMessage.textContent = 'Correct!';
        feedbackMessage.className = 'correct';

        // Add animation class
        document.querySelector(`[data-option="${selectedOption}"]`).classList.add('correct');

        adjustDifficulty();
    } else {
        // Incorrect answer
        mistakes++;
        correctAnswersStreak = 0;
        feedbackMessage.textContent = 'Incorrect!';
        feedbackMessage.className = 'wrong';

        // Add animation class
        document.querySelector(`[data-option="${selectedOption}"]`).classList.add('wrong');
    }

    // Show feedback
    correctAnswerDisplay.textContent = `The correct answer was: Option ${correctOption}`;
    explanationDisplay.textContent = `Explanation: ${explanation}`;

    showScreen('feedback-screen');

    // Check for game over
    if (mistakes >= 3) {
        endGame();
    }
}

function adjustDifficulty() {
    if (correctAnswersStreak > 0 && correctAnswersStreak % 5 === 0) {
        if (currentDifficultyLevel < difficulties.length - 1) {
            currentDifficultyLevel++;
        }
    }
}

function updateGameState() {
    scoreDisplay.textContent = `Score: ${score}`;
    mistakesDisplay.textContent = `Mistakes: ${mistakes}`;
}

function endGame() {
    finalScoreDisplay.textContent = `Your final score is: ${score}`;
    showScreen('gameover-screen');
}

function resetGame() {
    // Reset variables
    theme = '';
    difficulty = '';
    score = 0;
    mistakes = 0;
    correctAnswersStreak = 0;
    currentDifficultyLevel = 0;
    correctOption = '';
    explanation = '';

    // Reset screens
    themeInput.value = '';
    themeError.textContent = '';

    showScreen('theme-screen');
}

// Start the game
initGame();
