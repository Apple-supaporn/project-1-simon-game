let previousHighestScore = parseInt(localStorage.getItem("highestScore"));
    if (isNaN(previousHighestScore)){
    previousHighestScore = 0;
    }
let previousHighestScoreEl = document.getElementById("previousHighestScore");
    previousHighestScoreEl.innerText = previousHighestScore.toString();


//create an object colors and add value for their corresponding
const colors = { green: 0, red: 1, blue: 2, yellow: 3 };
let gameSequence = [];    //store the sequence by game
let userSequence = [];    //store the user's sequence input
let gamePlaying = false;  //flag if the game is playing
let userPlaying = false;  //flag if user is playing
let gameOver = false;

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

//DOM VARIABLE FOR SCORE DISPLAYS
const score = document.getElementById('score');
const highestScore = document.getElementById('highestScore');



//function to start the game
function startGame() {    //reset the game from begining
    gameOver = false;     //set before star
    gameSequence = [];
    userSequence = [];
    gamePlaying = true;
    userPlaying = false;
    currentScore = 0;
    currentHighestScore = parseInt(localStorage.getItem("highestScore")) || 0;
    score.innerText = `Score: 0`;
    highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
    console.log('Game satrted')
    startNextRound();
};



//function to start next round
function startNextRound() {                             //when startNextRound is called
    userSequence = [];                                  //first reset the userSequence array
    const nextColor = Math.floor(Math.random() * 4);    //generate the next color for the gameSequence by using Math.random()
    gameSequence.push(nextColor);                       //push it into gameSequence array, then call playSequence
    console.log('Next color: ', nextColor)
    playSequence();
};



//function to play the generate sequence
function playSequence() {
    userPlaying = false                                 //stop user input while the sequence is playing
    let i = 0;                                          //set a variable i to keep track of index in the gameSequence
    const intervalId = setInterval(() => {
        const color = gameSequence[i];
        highlightColor(color);                          //highlight the current color in the sequence
        playSound(color);   
        console.log('Playing color:', color)            //play the sound
        i++;                                            //move to the next color in the sequence
    
        if(i === gameSequence.length){                  //if all colors have been played, then user turn.
        clearInterval(intervalId);
            setTimeout(() => {                          //clear user sequence after show all of the sequence
            userSequence = [];
            userPlaying = true;
            console.log('Game sequence', gameSequence)
            }, 0);                                      //set timeout to 0 so the array is cleared immediately after the sequence finishes playing. 
        };
    }, 750);
};



//function to highlight colors
function highlightColor(color) {                       //use switch statement 
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


function playSound(color) {
  sounds[color].play();
};


function checkSequence() {
  for (let i = 0; i < userSequence.length; i++) {
      if(userSequence[i] !== gameSequence[i]) {
      return false;                                     //return false immediately when userSequence doesn't match with gameSequence. 
      }
  }
  return true;
}


function updateScore() {
  const currentScore = userSequence.length;
  if (currentScore > currentHighestScore) {
      currentHighestScore = currentScore; 
      localStorage.setItem("highestScore", currentHighestScore.toString());
      console.log('Current score', currentScore)
  }
  score.innerText = `Score: ${currentScore}`;
  highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
};



function endGame() {
  if(gameOver){
      return;
  }
  gamePlaying = false;
  userPlaying = false;
  gameOver = true;

  const gameOverMessage = document.getElementById('endGameMessage');
  gameOverMessage.innerText = "GAME OVER";

  const gameOverScreen = document.getElementById('gameOver');
  gameOverScreen.style.display = 'block';

  const replayButton = document.getElementById('replayButton');
  replayButton.addEventListener('click', handleReply);

  score.innerText = `Score: 0`;
};



function handleReply() {
  startGame();
  const gameOverScreen = document.getElementById('gameOver');
  gameOverScreen.style.display = 'none';
  const replayButton = document.getElementById('replayButton');
  replayButton.removeEventListener('click', handleReply);
}



function updateHighestScore(newScore){
  if (newScore > currentHighestScore) {
      currentHighestScore = newScore;
      localStorage.setItem('highestScore', currentHighestScore.toString()); //to store a value in the browser's local storage  and .toString is to convert the value to a string
      highestScore.innerText = `Your Highest Score: ${currentHighestScore}`;
      console.log('highest score', highestScore)
  }
}



function handlePanelClick(color) {
    if (userPlaying) { //since userplaying is already being check, the gameplaying check is unnecessery. 
        userSequence.push(color);
        playSound(color);
        highlightColor(color);
            if(!checkSequence()) {                                         //check if user's sequence is incorrect
            endGame();                                                     //endGame if the user's sequence doesn't match
            } else if (userSequence.length === gameSequence.length) { 
                updateScore();                                             // if matched, update score, reset the user to false, and start next round
                userPlaying = false;
                console.log('User playing', userPlaying)
                setTimeout(startNextRound, 500);
              };
    };
};



function muteSound() {

};



function instruction() {

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