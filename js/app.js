//GAME VARIABLES
const colors = { green: 0, red: 1, blue: 2, yellow: 3 };
let gameSequence = [];
let userSequence = [];
let gamePlaying = false;
let userPlaying = false;
let gameOver = false;
let isMuted = false;
let currentHighestScore = 0;


//SOUND URLS AND AUDIO ELEMENTS
const soundUrls = [
  'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',  
  'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
  'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
  'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
];


const sounds = soundUrls.map(url => {
  const audio = new Audio(url);
  audio.load();
  return audio;
});


//DOM VARIABLES FOR PANELS
const greenPanel = document.getElementById('greenPanel');
const redPanel = document.getElementById('redPanel');
const bluePanel = document.getElementById('bluePanel');
const yellowPanel = document.getElementById('yellowPanel');


//DOM VARIABLE FOR BUTTONS
const soundButton = document.getElementById('soundButton');
const howtoplayButton = document.getElementById('howtoplayButton');
const replayButton = document.getElementById('replayButton');
const playButton = document.getElementById('playButton');
const instructionPopup = document.getElementById('instructionPopup');
const resetHighestScoreButton = document.getElementById('resetHighestScoreButton');
const quitButton = document.getElementById('quitButton');


//DOM VARIABLE FOR SCORE DISPLAYS
const score = document.getElementById('score');
const highestScore = document.getElementById('highestScore');
let previousHighestScore = parseInt(localStorage.getItem("highestScore"));
if (isNaN(previousHighestScore)) {
  previousHighestScore = 0;
};
let previousHighestScoreEl = document.getElementById("previousHighestScore");
previousHighestScoreEl.innerText = previousHighestScore.toString();


function startGame() {
  gameOver = false;
  gameSequence = [];
  userSequence = [];
  gamePlaying = true;
  userPlaying = false;
  currentScore = 0;
  currentHighestScore = parseInt(localStorage.getItem("highestScore")) || 0;
  score.innerText = `Score: 0`;
  highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
  startNextRound();
  playButton.innerText = "";
};


function startNextRound() {
  userSequence = [];
  const nextColor = Math.floor(Math.random() * 4);
  gameSequence.push(nextColor);
  playSequence();
};


function playSequence() {
  userPlaying = false;
  let i = 0;
  const intervalId = setInterval(() => {
    const color = gameSequence[i];
    highlightColor(color);
    if(!isMuted) {
      playSound(color);
    };
    i++;
    if(i === gameSequence.length) {
      clearInterval(intervalId);
      setTimeout(() => {
        userSequence = [];
        userPlaying = true;
      }, 0);
    };
  }, 750);
};


function highlightColor(color) {
  switch (color) {
    case colors.green:
      greenPanel.classList.add('active');
      setTimeout(() => {
        greenPanel.classList.remove('active');
      }, 500);
      break;
    case colors.red:
      redPanel.classList.add('active');
      setTimeout(() => {
        redPanel.classList.remove('active');
      }, 500);
      break;
      
    case colors.blue:
      bluePanel.classList.add('active');
      setTimeout(() => {
        bluePanel.classList.remove('active');
      }, 500);
      break;
    case colors.yellow:
      yellowPanel.classList.add('active');
      setTimeout(() => {
        yellowPanel.classList.remove('active');
      }, 500);
      break;
  };
};


function playSound(color) {
  sounds[color].play();
};


function checkSequence() {
  for (let i = 0; i < userSequence.length; i++) {
    if(userSequence[i] !== gameSequence[i]) {
      return false;
    };
  };
  return true;
};


function updateScore() {
  const currentScore = userSequence.length;
  if (currentScore > currentHighestScore) {
    currentHighestScore = currentScore; 
    localStorage.setItem("highestScore", currentHighestScore.toString());
  };
  score.innerText = `Score: ${currentScore}`;
  highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
};


function endGame() {
  if(gameOver) {
    return;
  };
  gamePlaying = false;
  userPlaying = false;
  gameOver = true;
  const gameOverMessage = document.getElementById('endGameMessage');
  gameOverMessage.innerText = "GAME OVER";
  const gameOverScreen = document.getElementById('gameOver');
  gameOverScreen.style.display = 'block';
  const replayButton = document.getElementById('replayButton');
  replayButton.addEventListener('click', handleReply);
  replayButton.addEventListener('click', () => {
    replayButton.removeEventListener('click', handleReply);
    score.innerText = 'Score: 0';
    handleReply();
  });
};


function handleReply() {
  startGame();
  const gameOverMessage = document.getElementById('endGameMessage');
  gameOverMessage.innerText = "";
  const gameOverScreen = document.getElementById('gameOver');
  gameOverScreen.style.display = 'none';
  const replayButton = document.getElementById('replayButton');
  replayButton.removeEventListener('click', handleReply);
};


function updateHighestScore(newScore) {
  if (newScore > currentHighestScore) {
    currentHighestScore = newScore;
    localStorage.setItem('highestScore', currentHighestScore.toString());
    highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
  };
};


function handlePanelClick(color) {
  if (userPlaying) {
    userSequence.push(color);
    if(!isMuted){
      playSound(color);
    }
    highlightColor(color);
    if(!checkSequence()) {
      endGame();
    } else if (userSequence.length === gameSequence.length) { 
      updateScore();
      userPlaying = false;
      setTimeout(startNextRound, 500);
    };
  };
};


function muteSound() {
  const sounds = document.querySelectorAll('audio');
  isMuted = !isMuted;
};


function openInstruction() {
  instructionPopup.style.display = 'block';
};


function closeInstruction() {
  instructionPopup.style.display = 'none';
};


function resetHighestScore() {
  localStorage.removeItem("highestScore");
  previousHighestScore = 0;
  previousHighestScoreEl.innerText = previousHighestScore.toString();
  highestScore.innerText = `Your Highest Score: ${previousHighestScore}`;
};


function quitGame() {
  gamePlaying = false;
  userPlaying = false;
  gameOver = false;
  const gameOverScreen = document.getElementById('gameOver');
  gameOverScreen.style.display = 'none';
  score.innerText = 'Score: 0';
  playButton.innerText = "Play";
};


//EVENT LISTENERS
howtoplayButton.addEventListener('click', openInstruction);
resetHighestScoreButton.addEventListener('click', resetHighestScore);
replayButton.addEventListener('click', startGame);
quitButton.addEventListener('click', quitGame);
playButton.addEventListener('click', startGame);

greenPanel.addEventListener('click', () => {
  if(userPlaying){
    handlePanelClick(colors.green);
  };
});

redPanel.addEventListener('click', () => {
  if(userPlaying){
    handlePanelClick(colors.red);
  };
});

bluePanel.addEventListener('click', () => {
  if(userPlaying){
    handlePanelClick(colors.blue);
  };
});

yellowPanel.addEventListener('click', () => {
  if(userPlaying){
    handlePanelClick(colors.yellow);
  };
});

soundButton.addEventListener('click', () => {
  muteSound();
  if (isMuted) {
    soundButton.textContent = "Sound Off";
  } else {
    soundButton.textContent = "Sound On";
  };
});



