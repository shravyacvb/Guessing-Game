'use strict';
const words = require ('./words');
const compare = require ('./compare');

/***********************************************************
Used to handle the content to display on the page
************************************************************/

const game = {
    gamePage: function (username, gameState){
        let pastAttempts = gameState.wordsGuessed.reverse();
        return `
        <!doctype html>
        <html>
            <head>
                <title>Guess It!</title>
                <link rel="stylesheet" href="./styles.css"/>
            </head>
            <body class=${gameState.won === true ? "celebration" : ""}>
                <div class="home-page">
                    <form class="logout" action='/logout' method="POST">
                        <p class="username">Hi ${username}!</p>
                        <button type="submit" name="logout">Logout</button>
                    </form>
                    <h1>Let's Play - Guess It!</h1>

                    <h2 class=${gameState.won === true ? "" : "hidden"}>Congratulations, YOU WON!!!</h1>

                    <form action='/new-game' method="POST">
                        <p>Do you wish to start a new game?</p>
                        <button type="submit">New Game</button>
                    </form>
                    <div class=${gameState.won === true ? "hidden" : ""}>
                        <div class="words" id="words" data-all-words=${words} data-remaining-words=${gameState.toBePicked}>
                            <p>Please pick a word from below to make a guess:</p>` +
                            Object.values(gameState.toBePicked).map( word => `
                                    <span class="word">${word}</span>
                            `).join(',') +
                        `</div>
                        <form id="guess-form" action='/guess' method="POST">
                            <p>Enter your word for the guess</p>
                            <span>Guess: <input id="guess-word" type="text" name="guess" /></span>
                            <button id="guess-btn" type="submit">Submit</button>
                        </form>
                        <p id="error" class="error"></p>
                    </div>
                    <div class=${gameState.turns > 0 ? "" : "hidden"}>
                        <h3>Previously Guessed Words</h3>
                        <p>Number of guesses made: ${gameState.turns}</p>
                        <div class="row table-header" id="heading">
                            <div class="col">Guessed Words</div>
                            <div class="col">Matched Letters</div>
                        </div>` +
                        Object.values(pastAttempts).map( word => `
                                <div class="row" id="heading">
                                    <div class="col">${word.guess}</div>
                                    <div class="col">${word.matchCount}</div>
                                </div>
                        `).join('') +
                    `</div>
                </div>
                <script src="./gameCheck.js"></script>
            </body>
        </html>
        `;
    },

    loginPage: function (errorMessage) {
        let showError = errorMessage ? "" : "hidden";
        return `
            <!doctype html>
            <html>
                <head>
                    <title>Guess It!</title>
                    <link rel="stylesheet" href="./styles.css"/>
                </head>
                <body>
                    <div class="login-page">
                        <h1>Let's Play - Guess It!</h1>
                        <h2>Login</h2>
                        <p class="error ${showError}">${errorMessage}</p>
                        <form action='/login' method="POST">
                            Username: <input id="username" type="text" name="username" />
                            <button id="login" type="submit">Login</button>
                        </form>
                    </div>
                    <script src="./gameCheck.js"></script>
                </body>
            </html>
        `;
    }
};

//Starts a new game
function newGame() {
    return {
       wordsGuessed: [],
       recentGuess: null,
       won: false,
       word: pickWord(words),
       toBePicked:[...words],
       turns: 0
    };
}
   
//Guess - Finds the word in the list and updates previously guessed words. Also, returns if the user won
function takeTurn(game, guess) {
    if(!guess || game.won) {
        return;
    }
   
    guess = guess.toLowerCase();
    let searchIndex = game.toBePicked.indexOf(guess);
    if (searchIndex < 0) {
        return;
    }
    
    game.toBePicked.splice(searchIndex, 1); 
    const matchCount = compare(game.word, guess);
    game.wordsGuessed.push({guess:guess, matchCount: matchCount});
    game.recentGuess = guess;
    game.turns++;

    if(matchCount === game.word.length && game.word.length === guess.length && exactMatch(game.word, guess)) {
        game.won = true;
        return;
    }
}
 
//Compares if the guessed word is same as the secret word
function exactMatch(word, guess) {
    return word.toUpperCase() === guess.toUpperCase(); 
}

//Used to pick a random secret word from the word list
function pickWord(wordList) {
    const secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    console.log('Secret word ---> ', secretWord);
    return secretWord;
}

module.exports = {game,newGame,takeTurn};

