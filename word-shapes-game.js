const WORD_LIST = [
    'apple', 'banana', 'cat', 'dog', 'elephant', 'frog', 'giraffe', 'house', 'igloo', 'jacket',
    'kite', 'lion', 'monkey', 'nest', 'orange', 'penguin', 'queen', 'rabbit', 'sun', 'tree'
];

let currentWord = '';
let score = 0;
let totalAttempts = 0;

const wordShapeContainer = document.getElementById('word-shape');
const wordInput = document.getElementById('word-input');
const speakWordButton = document.getElementById('speak-word');
const submitWordButton = document.getElementById('submit-word');
const newWordButton = document.getElementById('new-word');
const scoreValue = document.getElementById('score-value');
const totalAttemptsValue = document.getElementById('total-attempts');
const progressValue = document.getElementById('progress-value');
const progressFill = document.querySelector('.progress-fill');

const LETTER_SHAPE_MAP = {
    up: ['b', 'd', 'f', 'h', 'k', 'l', 't'],
    down: ['g', 'j', 'p', 'q', 'y'],
    dot: ['a', 'c', 'e', 'i', 'm', 'n', 'o', 'r', 's', 'u', 'v', 'w', 'x', 'z']
};

function getLetterShape(letter) {
    if (LETTER_SHAPE_MAP.up.includes(letter)) {
        return '⬆️';
    }
    if (LETTER_SHAPE_MAP.down.includes(letter)) {
        return '⬇️';
    }
    return '⬤';
}

function generateNewWord() {
    currentWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    return currentWord;
}

function createWordShape(word) {
    wordShapeContainer.innerHTML = '';
    word.split('').forEach(letter => {
        const shapeBlock = document.createElement('div');
        shapeBlock.className = 'shape-block';
        shapeBlock.innerHTML = getLetterShape(letter);
        wordShapeContainer.appendChild(shapeBlock);
    });
}

function speakWord(word) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Prevent overlapping sounds
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    }
}

function updateProgress() {
    const progressPercentage = Math.min(100, (score / Math.max(totalAttempts, 1)) * 100);
    progressFill.style.width = `${progressPercentage}%`;
    progressValue.textContent = Math.round(progressPercentage);
}

function initGame() {
    currentWord = generateNewWord();
    createWordShape(currentWord);
    wordInput.value = '';
    updateProgress();
}

submitWordButton.addEventListener('click', () => {
    const userInput = wordInput.value.trim().toLowerCase();
    totalAttempts++;
    if (userInput === currentWord.toLowerCase()) {
        score++;
        alert('Correct! Great job!');
    } else {
        alert(`Incorrect! The correct word was "${currentWord}".`);
    }
    scoreValue.textContent = score;
    totalAttemptsValue.textContent = totalAttempts;
    initGame();
});

newWordButton.addEventListener('click', initGame);
speakWordButton.addEventListener('click', () => speakWord(currentWord));

initGame();
