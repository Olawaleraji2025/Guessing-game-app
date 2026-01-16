// This will serve as the state of the game
let secretNumber = 0;
let lives = 5;
let score = 0;
let maxNumber = 50;
let guesses = [];
let gameActive = false;

// DOM elements
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const hintElement = document.getElementById('hint');
const livesElement = document.getElementById('lives');
const scoreElement = document.getElementById('score');
const guessHistory = document.getElementById('guess-history');
const mysteryCard = document.getElementById('mystery-card');
const mysteryText = document.getElementById('mystery-text');
const difficultySelect = document.getElementById('difficulty');
const gameOverModal = document.getElementById('game-over-modal');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');
const playAgainBtn = document.getElementById('play-again-btn');


// This is to start the game
function startGame() {
    // Set difficulty chosen by the user
    const difficulty = difficultySelect.value;
    switch(difficulty) {
        case 'easy':
            maxNumber = 50;
            lives = 5;
            break;
        case 'medium':
            maxNumber = 100;
            lives = 4;
            break;
        case 'hard':
            maxNumber = 200;
            lives = 3;
            break;
    }

    // Reset game state
    secretNumber = Math.floor(Math.random() * maxNumber) + 1; //This is the number to guess based on the level selected
    guesses = [];
    gameActive = true;

    // Update UI
    updateLives();
    scoreElement.textContent = score;
    guessHistory.innerHTML = '';
    hintElement.textContent = `Start guessing between 1 and ${maxNumber}`;
    mysteryText.textContent = 'Guess the number to reveal!';

    // console.log('Secret number:', secretNumber); // For debugging
}

// Update lives display
function updateLives() {
    livesElement.textContent = lives;
}

// Handle guess submission
function handleGuess() {
    if (!gameActive) return;

    const guess = parseInt(guessInput.value);
    
    // Validate input
    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
        hintElement.textContent = `Please enter a number between 1 and ${maxNumber}`;
        hintElement.classList.add('hint-error');
        setTimeout(() => hintElement.classList.remove('hint-error'), 1000);
        return;
    }

    // Check if already guessed
    if (guesses.includes(guess)) {
        hintElement.textContent = 'You already guessed that number!';
        // hintElement.classList.add('hint-error');
        // setTimeout(() => hintElement.classList.remove('hint-error'), 1000);
        return;
    }

    // Add to guesses
    guesses.push(guess);
    renderGuessHistory();

    // Check guess
    if (guess === secretNumber) {
        handleWin();
        return;
    }

    // Wrong guess
    lives--;
    updateLives();

    // Provide hint
    let hint = '';
    const difference = Math.abs(guess - secretNumber); //it will remove the negative value e.g -10 will become 10 
    
    if (guess < secretNumber) {
        hint = difference > (maxNumber * 0.3) ? 'Way too low!' : 'Too low!';
    } else {
        hint = difference > (maxNumber * 0.3) ? 'Way too high!' : 'Too high!';
    }

    hintElement.textContent = hint;
    hintElement.classList.add('hint-error');
    setTimeout(() => hintElement.classList.remove('hint-error'), 1000);

    // Check game over
    if (lives <= 0) {
        handleGameOver(false);
    }

    // Clear input
    guessInput.value = '';
}

// Handles if the user win
function handleWin() {
    // Calculate score
    const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2
    }[difficultySelect.value];
    
    score += Math.floor((lives * 10) * difficultyMultiplier);
    scoreElement.textContent = score;

    // Update UI
    gameActive = false;
    hintElement.textContent = 'Congratulations! You guessed it!';
    hintElement.classList.add('correct-guess');
    mysteryCard.innerHTML = `<span class="secret-number">${secretNumber}</span>`;
    mysteryCard.classList.add('mystery-card-win');
    mysteryText.textContent = 'You found the secret number!';
    
    // Save high score
    saveHighScore();
    
    // Show game over modal with win message
    setTimeout(() => {
        resultTitle.textContent = 'You Win!';
        resultMessage.innerHTML = `You guessed the number <span class="bold-text hint-success">${secretNumber}</span> with ${lives} ${lives === 1 ? 'life' : 'lives'} left!`;
        finalScoreElement.textContent = score;
        highScoreElement.textContent = getHighScore();
        gameOverModal.style.display = 'flex';
    }, 1500);
}

// Display guess history
function renderGuessHistory() {
    guessHistory.innerHTML = '';
    guesses.forEach(guess => {
        const guessElement = document.createElement('div');
        guessElement.className = `guess-item ${guess === secretNumber ? 'correct-guess' : 'wrong-guess'}`;
        guessElement.textContent = guess;
        guessHistory.appendChild(guessElement);
    });
}

// This function will get the users highest score using local storage
function getHighScore() {
    return localStorage.getItem('guessMasterHighScore') || 0;
}

// This function will save the users highest score using local storage
function saveHighScore() {
    const currentHighScore = parseInt(getHighScore());
    if (score > currentHighScore) {
        localStorage.setItem('guessMasterHighScore', score);
    }
}

// Handle game over
function handleGameOver(isWin) {
    gameActive = false;
    
    // Update UI
    mysteryCard.innerHTML = `<span class="secret-number">${secretNumber}</span>`;
    mysteryCard.classList.add('mystery-card-lose');
    mysteryText.textContent = 'Game Over!';
    
    // Save high score
    saveHighScore();
    
    // Show game over modal
    setTimeout(() => {
        resultTitle.textContent = 'Game Over';
        resultMessage.innerHTML = `The secret number was <span class="bold-text">${secretNumber}</span>.`;
        finalScoreElement.textContent = score;
        highScoreElement.textContent = getHighScore();
        gameOverModal.style.display = 'flex';
    }, 1000);
}

// This is for the play again function
playAgainBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    guessInput.value = '';
    mysteryCard.innerHTML = ` <div id="mystery-card">
                        <i class="fa-solid fa-question"></i>
                    </div>`;
    mysteryText.textContent = 'Guess the number to reveal!';
    hintElement.textContent = `Start guessing between 1 and ${maxNumber}`;
    hintElement.classList.remove('correct-guess');
    startGame();
});

// Event listeners for the guess button
guessBtn.addEventListener('click', handleGuess);

difficultySelect.addEventListener('change', startGame); //This will change the difficulty value from easy to hard

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGuess();
});

// This is to start the game
startGame();