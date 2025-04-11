// --- Spill Data ---
const phonemeData = [
    // Konsonanter
    { phoneme: '/p/', type: 'consonant', features: { place: 'bilabial', manner: 'plosiv', voicing: 'ustemt' } },
    { phoneme: '/b/', type: 'consonant', features: { place: 'bilabial', manner: 'plosiv', voicing: 'stemt' } },
    { phoneme: '/m/', type: 'consonant', features: { place: 'bilabial', manner: 'nasal', voicing: 'stemt' } },
    { phoneme: '/t/', type: 'consonant', features: { place: 'alveolar', manner: 'plosiv', voicing: 'ustemt' } },
    { phoneme: '/d/', type: 'consonant', features: { place: 'alveolar', manner: 'plosiv', voicing: 'stemt' } },
    { phoneme: '/n/', type: 'consonant', features: { place: 'alveolar', manner: 'nasal', voicing: 'stemt' } },
    { phoneme: '/k/', type: 'consonant', features: { place: 'velar', manner: 'plosiv', voicing: 'ustemt' } },
    { phoneme: '/g/', type: 'consonant', features: { place: 'velar', manner: 'plosiv', voicing: 'stemt' } },
    { phoneme: '/ŋ/', type: 'consonant', features: { place: 'velar', manner: 'nasal', voicing: 'stemt' } },
    { phoneme: '/f/', type: 'consonant', features: { place: 'labiodental', manner: 'frikativ', voicing: 'ustemt' } },
    { phoneme: '/v/', type: 'consonant', features: { place: 'labiodental', manner: 'frikativ', voicing: 'stemt' } },
    { phoneme: '/s/', type: 'consonant', features: { place: 'alveolar', manner: 'frikativ', voicing: 'ustemt' } },
    { phoneme: '/ʃ/', type: 'consonant', features: { place: 'postalveolar', manner: 'frikativ', voicing: 'ustemt' } }, // sj-lyd
    { phoneme: '/ç/', type: 'consonant', features: { place: 'palatal', manner: 'frikativ', voicing: 'ustemt' } },   // kj-lyd
    { phoneme: '/l/', type: 'consonant', features: { place: 'alveolar', manner: 'lateral', voicing: 'stemt' } },    // tynn l
    { phoneme: '/ɽ/', type: 'consonant', features: { place: 'postalveolar', manner: 'flapp', voicing: 'stemt' } }, // tjukk l - NB: Manner 'flapp' er ikke i select, forenkler til 'approksimant'?
    // La oss forenkle /ɽ/ (tjukk l) og /r/ (rulle-r/skarre-r) til approksimant eller en egen kategori for nå
    // { phoneme: '/r/', type: 'consonant', features: { place: 'alveolar', manner: 'trill', voicing: 'stemt' } }, // rulle-r
    // { phoneme: '/ʁ/', type: 'consonant', features: { place: 'uvular', manner: 'frikativ', voicing: 'stemt' } }, // skarre-r

    // Vokaler (basert på forenklet firkant slide 17)
    { phoneme: '/i/', type: 'vowel', features: { height: 'trong', backness: 'fremre', rounding: 'urunda' } }, // Forenkler til kort/lang
    { phoneme: '/y/', type: 'vowel', features: { height: 'trong', backness: 'fremre', rounding: 'runda' } },
    { phoneme: '/e/', type: 'vowel', features: { height: 'midtre', backness: 'fremre', rounding: 'urunda' } },
    { phoneme: '/ø/', type: 'vowel', features: { height: 'midtre', backness: 'fremre', rounding: 'runda' } },
    { phoneme: '/æ/', type: 'vowel', features: { height: 'open', backness: 'fremre', rounding: 'urunda' } }, // æ = open fremre urunda
    { phoneme: '/a/', type: 'vowel', features: { height: 'open', backness: 'sentral', rounding: 'urunda' } }, // a = open sentral urunda
    { phoneme: '/ʉ/', type: 'vowel', features: { height: 'trong', backness: 'sentral', rounding: 'runda' } }, // u (som i hus) - trong sentral runda
    { phoneme: '/u/', type: 'vowel', features: { height: 'trong', backness: 'bakre', rounding: 'runda' } },   // o (som i sol) - trong bakre runda
    { phoneme: '/o/', type: 'vowel', features: { height: 'midtre', backness: 'bakre', rounding: 'runda' } },   // å (som i båt) - midtre bakre runda
    //{ phoneme: '/ɔ/', type: 'vowel', features: { height: 'open', backness: 'bakre', rounding: 'runda' } },  // (sjeldnere, som i pott) - open bakre runda
];

// --- Element Referanser ---
const targetPhonemeSpan = document.getElementById('target-phoneme');
const instructionsP = document.getElementById('instructions');
const consonantFeaturesDiv = document.getElementById('consonant-features');
const vowelFeaturesDiv = document.getElementById('vowel-features');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const feedbackArea = document.getElementById('feedback-area');
const scoreDisplay = document.getElementById('score-display');

// Konsonant velgere
const placeSelect = document.getElementById('place-select');
const mannerSelect = document.getElementById('manner-select');
const voicingRadios = document.querySelectorAll('input[name="voicing"]'); // Får en NodeList

// Vokal velgere
const heightSelect = document.getElementById('height-select');
const backnessSelect = document.getElementById('backness-select');
const roundingRadios = document.querySelectorAll('input[name="rounding"]');

// --- Spill Variabler ---
let currentPhonemeIndex = 0;
let score = 0;
let questionsOrder = []; // Array med indekser
let currentPhonemeData = null;

// --- Hjelpefunksjon: Bland en array (Fisher-Yates shuffle) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Funksjon: Tilbakestill valg ---
function resetSelections() {
    // Konsonanter
    placeSelect.value = "";
    mannerSelect.value = "";
    voicingRadios.forEach(radio => radio.checked = false);
    // Vokaler
    heightSelect.value = "";
    backnessSelect.value = "";
    roundingRadios.forEach(radio => radio.checked = false);
}

// --- Funksjon: Last neste spørsmål ---
function loadQuestion() {
    if (currentPhonemeIndex >= questionsOrder.length) {
        displayEndGame();
        return;
    }

    const dataIndex = questionsOrder[currentPhonemeIndex];
    currentPhonemeData = phonemeData[dataIndex];

    targetPhonemeSpan.textContent = currentPhonemeData.phoneme;
    instructionsP.textContent = `Spørsmål ${currentPhonemeIndex + 1} av ${questionsOrder.length}. Velg egenskapene.`;

    resetSelections();
    feedbackArea.textContent = '';
    feedbackArea.className = ''; // Fjerner feedback-styling

    // Vis riktig sett med egenskaper
    if (currentPhonemeData.type === 'consonant') {
        consonantFeaturesDiv.style.display = 'block';
        vowelFeaturesDiv.style.display = 'none';
    } else { // Vokal
        consonantFeaturesDiv.style.display = 'none';
        vowelFeaturesDiv.style.display = 'block';
    }

    checkButton.disabled = false;
    nextButton.style.display = 'none'; // Skjul "neste" knappen
}

// --- Funksjon: Les brukerens valg ---
function getUserSelections() {
    const selections = {};
    if (currentPhonemeData.type === 'consonant') {
        selections.place = placeSelect.value;
        selections.manner = mannerSelect.value;
        const checkedVoicing = document.querySelector('input[name="voicing"]:checked');
        selections.voicing = checkedVoicing ? checkedVoicing.value : ""; // Hent verdi hvis en er valgt
    } else { // Vokal
        selections.height = heightSelect.value;
        selections.backness = backnessSelect.value;
        const checkedRounding = document.querySelector('input[name="rounding"]:checked');
        selections.rounding = checkedRounding ? checkedRounding.value : "";
    }
    return selections;
}

// --- Funksjon: Sjekk Svar ---
function checkAnswer() {
    checkButton.disabled = true; // Deaktiver sjekk-knappen
    const userSelections = getUserSelections();
    const correctFeatures = currentPhonemeData.features;
    let isCorrect = true;
    let feedbackHtml = "Dine valg: <br>";

    // Sammenlign hver egenskap
    for (const feature in correctFeatures) {
        feedbackHtml += `- ${feature}: ${userSelections[feature] || '<i>(ikke valgt)</i>'} `;
        if (userSelections[feature] !== correctFeatures[feature]) {
            isCorrect = false;
            feedbackHtml += ` <strong style="color: #a94442;">(Skal være: ${correctFeatures[feature]})</strong>`;
        } else {
             feedbackHtml += ` <span style="color: #3c763d;">(Riktig)</span>`;
        }
        feedbackHtml += "<br>";
    }

    // Vis feedback og oppdater poeng
    if (isCorrect) {
        feedbackArea.innerHTML = "✅ Helt riktig!<br>" + feedbackHtml;
        feedbackArea.className = 'correct-feedback';
        score++;
        scoreDisplay.textContent = score;
    } else {
        feedbackArea.innerHTML = "❌ Noe stemte ikke.<br>" + feedbackHtml;
        feedbackArea.className = 'incorrect-feedback';
    }

    nextButton.style.display = 'inline-block'; // Vis "neste"-knappen
}

// --- Funksjon: Gå til neste spørsmål ---
function nextQuestion() {
    currentPhonemeIndex++;
    loadQuestion();
}

// --- Funksjon: Vis slutten av spillet ---
function displayEndGame() {
    targetPhonemeSpan.textContent = '🏁';
    instructionsP.textContent = "Spillet er ferdig!";
    consonantFeaturesDiv.style.display = 'none';
    vowelFeaturesDiv.style.display = 'none';
    checkButton.style.display = 'none';
    nextButton.style.display = 'none';

    feedbackArea.textContent = `Du klarte ${score} av ${questionsOrder.length} fonemer!`;
    feedbackArea.className = ''; // Nøytral feedback-styling

    // Legg til en "Spill igjen"-knapp
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Spill Igjen?';
    restartButton.addEventListener('click', startGame);
    feedbackArea.appendChild(document.createElement('br')); // Linjeskift
    feedbackArea.appendChild(restartButton);
}


// --- Funksjon: Start Spillet ---
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    currentPhonemeIndex = 0;
    questionsOrder = shuffleArray([...Array(phonemeData.length).keys()]); // Array med 0, 1, 2... blandet

    // Sørg for at knapper er synlige/skjult riktig
    checkButton.style.display = 'inline-block';
    nextButton.style.display = 'none';

    loadQuestion();
}

// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);

// --- Start spillet når siden lastes ---
document.addEventListener('DOMContentLoaded', startGame);