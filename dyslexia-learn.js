const WORD_LIST = [
    'apple', 'banana', 'cat', 'dog', 'elephant', 'frog', 'giraffe', 'house', 'igloo', 'jacket',
    'kite', 'lion', 'monkey', 'nest', 'orange', 'penguin', 'queen', 'rabbit', 'sun', 'tree'
];

let currentWord = '';
let score = 0;
let totalAttempts = 0;
let progress = 0;

const settings = {
    fontSize: 18,
    lineSpacing: 1.5,
    useOpenDyslexic: true,
    highContrast: false,
    speechRate: 0.7,
};

const practiceReading = document.getElementById('practice-reading');
const playWord = document.getElementById('play-word');
const newWordDyslexia = document.getElementById('new-word-dyslexia');
const wordBlocks = document.getElementById('word-blocks');
const sortedWord = document.getElementById('sorted-word');
const checkWord = document.getElementById('check-word');
const progressText = document.getElementById('progress-text');
const readAloud = document.getElementById('read-aloud');
const toggleSettings = document.getElementById('toggle-settings');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');

function generateNewWord() {
    currentWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    return currentWord;
}

function speakText(text, slowly = false) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Ensure no overlapping audio
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = slowly ? settings.speechRate : 1;
        speechSynthesis.speak(utterance);
    }
}

function updateProgress(value) {
    progress = Math.min(100, value);
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-value').textContent = progress;
}

function initDyslexiaLearn() {
    const word = generateNewWord();
    createWordBlocks(word);
    sortedWord.value = '';
}

function createWordBlocks(word) {
    wordBlocks.innerHTML = '';
    word.split('').sort(() => Math.random() - 0.5).forEach(letter => {
        const block = document.createElement('div');
        block.className = 'word-block';
        block.textContent = letter;
        block.draggable = true;
        block.addEventListener('dragstart', drag);
        wordBlocks.appendChild(block);
    });
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.textContent);
}

sortedWord.addEventListener('dragover', event => event.preventDefault());
sortedWord.addEventListener('drop', event => {
    event.preventDefault();
    const letter = event.dataTransfer.getData('text');
    sortedWord.value += letter;
});

checkWord.addEventListener('click', () => {
    totalAttempts++;
    if (sortedWord.value.toLowerCase() === currentWord.toLowerCase()) {
        score++;
        alert('Correct! Great job!');
        progressText.value += `${sortedWord.value} `;
        updateProgress((score / totalAttempts) * 100);
        initDyslexiaLearn();
    } else {
        alert('Not quite right. Try again!');
    }
});

practiceReading.addEventListener('click', () => speakText(progressText.value));
playWord.addEventListener('click', () => speakText(currentWord, true));
newWordDyslexia.addEventListener('click', initDyslexiaLearn);
readAloud.addEventListener('click', () => speakText(progressText.value));

toggleSettings.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Settings
document.getElementById('font-size').addEventListener('input', e => {
    settings.fontSize = e.target.value;
    applySettings();
});

document.getElementById('line-spacing').addEventListener('input', e => {
    settings.lineSpacing = e.target.value;
    applySettings();
});

document.getElementById('speech-rate').addEventListener('input', e => {
    settings.speechRate = e.target.value;
});

document.getElementById('use-dyslexic-font').addEventListener('change', e => {
    settings.useOpenDyslexic = e.target.checked;
    applySettings();
});

document.getElementById('high-contrast').addEventListener('change', e => {
    settings.highContrast = e.target.checked;
    applySettings();
});

function applySettings() {
    const elements = document.querySelectorAll('body, input, textarea, .word-block');
    elements.forEach(el => {
        el.style.fontSize = `${settings.fontSize}px`;
        el.style.lineHeight = settings.lineSpacing;
        el.style.fontFamily = settings.useOpenDyslexic ? 'OpenDyslexic, sans-serif' : 'Open Sans, sans-serif';
        if (settings.highContrast) {
            el.style.backgroundColor = 'black';
            el.style.color = 'yellow';
        } else {
            el.style.backgroundColor = '';
            el.style.color = '';
        }
    });
}

initDyslexiaLearn();
