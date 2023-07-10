//console.log("Sanity Check");

//Create functions
//function startGame() : to start the game
//function startNextRound() : to play next sequence after correct input
//function playSequence() : to play the generated sequence of color by highlight the color, play sound and move to next color
//function highlightColor() : to highlight color each panel
//function handlePanelClick() : to triggered when a color button is clicked 
//function checkSequence() : to compare between user input and game input (sequence)
//function playSound() : to play sound once click each panel
//function updateScore() : to track user's correct input
//function updateHighestScore() : to see the highest score so user can track the progress and beat it
//function muteSound() : so user can play in a quiet environment
//function instruction() : to tell player how to play the game

let previousHighestScore = parseInt(localStorage.getItem("highestScore"));
if (isNaN(previousHighestScore)){
  previousHighestScore = 0;
}
let previousHighestScoreEl = document.getElementById("previousHighestScore");
previousHighestScoreEl.innerText = previousHighestScore.toString();


const colors = { green: 0, red: 1, blue: 2, yellow: 3 };  //create an object colors and add value for their corresponding
let gameSequence = [];    //store the sequence by game
let userSequence = [];    //store the user's sequence input
let gamePlaying = false;  //flag if the game is playing
let userPlaying = false;  //flag if user is playing
const soundUrls = [       //sound URLs
  'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',  
  'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
  'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
  'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
];
const sounds = soundUrls.map(url => new Audio(url));      //create an array sounds by mapping each urls in soundUrls to an Audio object. 

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

//DOM VARIABLE FOR SCORE DISPLAYS
const score = document.getElementById('score');
const highestScore = document.getElementById('highestScore');

// let currentScore = 0;
// let currentHighestScore = 0;

//function to start the game
function startGame() {    //reset the game from begining
  //displayHighestScore()
  gameSequence = [];
  userSequence = [];
  gamePlaying = true;
  userPlaying = false;
  currentScore = 0;
  currentHighestScore = parseInt(localStorage.getItem("highestScore")) || 0;
  score.innerText = `Score: 0`;
  highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
  startNextRound();   //start first round
};


//function to start next round
function startNextRound() {   //when startNextRound is called
  userSequence = [];          //first reset the userSequence array
  const nextColor = Math.floor(Math.random() * 4);    //generate the next color for the gameSequence by using Math.random()
  gameSequence.push(nextColor);   //push it into gameSequence array, then call playSequence
  playSequence();
};


//function to play the generate sequence
function playSequence() {
  userPlaying = false                   //stop user input while the sequence is playing
  let i = 0;                            //set a variable i to keep track of index in the gameSequence
  const intervalId = setInterval(() => {
    const color = gameSequence[i];
    highlightColor(color);              //highlight the current color in the sequence
    playSound(color);                   //play the sound
    i++;                                //move to the next color in the sequence
    
    if(i === gameSequence.length){      //if all colors have been played, then user turn.
      clearInterval(intervalId);
      userPlaying = true;
      setTimeout(() => {  //clear user sequence after show all off then sequence
      userSequence = [];
      }, 1000);
    };
  }, 1000); 
};




//function to highlight colors
function highlightColor(color) {  //use switch statement 
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
  }
}


function handlePanelClick(color) {
  if (gamePlaying && userPlaying) {
    userSequence.push(color);
    playSound(color);
    highlightColor(color);

    if(!checkSequence()) {    //check if user's sequence is incorrect
      endGame();
    } else if (userSequence.length === gameSequence.length) { //check if the user's sequence match with the game
      updateScore();  // if matched, update score, reset the user, and start next round
      userPlaying = false;
      setTimeout(startNextRound, 500);
    };
  };
};


function checkSequence() {
  for (let i = 0; i < userSequence.length; i++) {
    if(userSequence[i] !== gameSequence[i]) {
      endGame();
      return false;
    }
  }
  return true;
}


let gameOver = false
function endGame() {
  if(gameOver){
    return;
  }
  gamePlaying = false;
  userPlaying = false;
  gameOver = true;

  let currentScore = userSequence.length;
  let previousHighestScore = parseInt(localStorage.getItem("highestScore")) || 0;

  if(currentScore > previousHighestScore) {
    previousHighestScore = currentScore;
    localStorage.setItem("highestScore", previousHighestScore.toString());
  } else {
    currentScore = previousHighestScore; //keep the current score equal to the highest score
  }
  alert('Game Over!');
  score.innerText = `Score: 0`;
  highestScore.innerText = `Your Highest Score: ${previousHighestScore}`;
  //console.log(highestScore)
  //updateHighestScore(previousHighestScore);
  refreshThepage(); //refresh the page once end game or game over
};

function updateScore() {
  const currentScore = userSequence.length;
  if (currentScore > currentHighestScore) {
    currentHighestScore = currentScore; 
    localStorage.setItem("highestScore", currentHighestScore.toString());
  }
  score.innerText = `Score: ${currentScore}`;
  highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
  //console.log(currentScore);
};

// function updateHighestScore() {
//   return parseInt(localStorage.getItem("highestScore")) || 0;
// };

function updateHighestScore(newScore){
  // const oldHighscore = parseInt(localStorage.getItem('highestScore')) || 0;
  if (newScore > currentHighestScore) {
    currentHighestScore = newScore;
    localStorage.setItem('highestScore', currentHighestScore.toString()); //to store a value in the browser's local storage  and .toString is to convert the value to a string
    highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
  }
}

// function displayHighestScore() {
//   let previousHighestScore = parseInt(localStorage.getItem("highestScore"));
//   if (isNaN(previousHighestScore)){
//     previousHighestScore = 0;
//   }
//   let previousHighestScoreEl = document.getElementById("previousHighestScore");
//   previousHighestScoreEl.innerText = previousHighestScore.toString();
// }


function playSound(color) {
  sounds[color].play();
};



function muteSound() {

};



function instruction() {

};


function refreshThepage() {    //refresh the page 
  location.reload();
};



//ADD EVENT LISTENER
soundButton.addEventListener('click', muteSound);
howtoplayButton.addEventListener('click', instruction);
replayButton.addEventListener('click', startGame);
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