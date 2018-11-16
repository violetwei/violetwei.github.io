window.addEventListener('load', init);

// Globals

// Available Levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 2
};

// To change level
//const currentLevel = levels.easy;

//default mode is easy
let currentLevel = levels[localStorage.getItem('defaultLevel')] || levels.easy;
let time;
let score = 0;
let isPlaying;

let stopped;
let cd;
let gamesCounter = 0;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');

const startGameBtn = document.querySelector("#startGameBtn");
const stopGameBtn = document.querySelector("#stopGameBtn");
const chooseLevel = document.querySelector("#chooseLevel");
const bestScoreModal = document.querySelector("#bestScoreModal");
const bestscore = document.querySelector("#bestScore");
const bestscoreEm = document.querySelector("#bestscoreEm");
const bestScoreModalBody = document.querySelector("#bestScoreModalBody");
const yourScoresModal = document.querySelector("#yourScoresModal");
const yourScoresTbody = document.querySelector("#yourScoresTbody");

const words = [
  'start',
  'river',
  'lucky',
  'statue',
  'generate',
  'stubborn',
  'cocktail',
  'runaway',
  'joke',
  'developer',
  'establishment',
  'hero',
  'javascript',
  'nutrition',
  'revolver',
  'echo',
  'siblings',
  'investigate',
  'horrendous',
  'symptom',
  'laughter',
  'magic',
  'master',
  'space',
  'definition',
  'french',
  'society'
];

//settig bestScore
bestscore.innerHTML = localStorage.getItem("bestScore") || 0;
//listener for change level
chooseLevel.addEventListener("change", changeLevel);
//when pressed game start
startGameBtn.addEventListener("click", init);
//when press game stop
stopGameBtn.addEventListener("click", stopGame);
//when input starts
wordInput.addEventListener('input', clearMessage);
//initialize seconds
seconds.innerHTML = currentLevel;
//initialize level
chooseLevel.value = localStorage.getItem('defaultLevel') || 'easy';

function changeLevel() {
  //update values
  currentLevel = levels[chooseLevel.value];
  seconds.innerHTML = currentLevel;
  time = currentLevel;
  //set in local storage
  localStorage.setItem('defaultLevel', chooseLevel.value);
}

// Initialize Game
function init() {
  message.innerHTML = "";
  //assign time
  time = currentLevel;
  //game is started
  stopped = false;
  //hide start Btn
  startGameBtn.classList.add("d-none");
  //show stop btn
  stopGameBtn.classList.remove("d-none");
  //disable choose level
  chooseLevel.disabled = true;

  // Show number of seconds in UI
  //seconds.innerHTML = currentLevel;

  // Load word from array, show a random selected word
  showWord(words);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  setInterval(checkStatus, 50);
}

// Start match
function startMatch() {
  if(!stopped){
 
    if (matchWords()) {
      isPlaying = true;
      time = currentLevel + 1;
      showWord(words);
      wordInput.value = '';
      score++;
    }

    // Case when score is -1, display 0
    if (score === -1) {
      scoreDisplay.innerHTML = 0;
    } else {
      scoreDisplay.innerHTML = score;
    }
  }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Congrats! You are Correct !';
    message.style.color = "green";
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown() {
 if(!stopped){  

   // Make sure time is not run out
   if (time > 0) {
     // Decrement
     time--;
   } 
   else if (time === 0) {
     //increment game Counter
     gamesCounter++;
     //Store the score in the table
     addNewScore(score);
     //Register score in local storage if it's the best one
     if( score > localStorage.getItem("bestScore") ){
        newBestScore();
     }
     $(stopGameBtn).trigger("click");
     message.innerHTML = "";

     // Game is over
     isPlaying = false;
   }
   // Show time
   timeDisplay.innerHTML = time;
  }
}

// Check the game status
function checkStatus() {
  if(!stopped){
    if (!isPlaying && time === 0) {
      message.innerHTML = 'GAME OVER !';
      message.style.color = "red";
      score = -1;
    }
  }
}

function stopGame() {
  //hide stop btn
  stopGameBtn.classList.add("d-none");
  //show start btn
  startGameBtn.classList.remove("d-none");
  //clear message
  clearMessage();
  //enable choose level
  chooseLevel.disabled = false;
  //stopping all
  stopped = true;
  //increment game Counter
  gamesCounter++;
  //Register score in table
  addNewScore(score);
  //Register score in local storage if is the best
  if (score > localStorage.getItem("bestScore")) {
    newBestScore();
  }
  //reset score
  score = 0;
  scoreDisplay.innerHTML = 0;
  //reset time
  clearInterval(cd);
}

function newBestScore() {
  //set new best score
  localStorage.setItem("bestScore", score);
  //show message
  $(bestScoreModal).modal("toggle");
  bestscoreEm.innerHTML = score;
  bestscore.innerHTML = score;
}

function addNewScore(score) {
  //first col
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let content = document.createTextNode(gamesCounter);
  td.appendChild(content);
  tr.appendChild(td);
  //second col
  td = document.createElement("td");
  content = document.createTextNode(score);
  td.appendChild(content);
  tr.appendChild(td);
  yourScoresTbody.prepend(tr);
}

function clearMessage() {
  message.innerHTML = '';
}