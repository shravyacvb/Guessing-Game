const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;
const {v4: uuidv4} = require('uuid');

app.use(express.static('./public'));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

const {game, newGame, takeTurn} = require('./game');

const sessions = {};
const gameMappings = {};

//Gets the page
app.get('/', (req, res) => {
    const sid = req.cookies.sid;
   
    if (sid && sessions[sid]) {
        const username = sessions[sid].username;
        const gameState = gameMappings[username].game;
        res.send(game.gamePage(username, gameState));
        return;
    }

    const errorMessage = 'Please login to play the game';
    res.send(game.loginPage(errorMessage));
});

//Performs login action
app.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const regexCheck = new RegExp('^[A-Za-z0-9]*$');
    console.log('username-->', username);
    if (username === 'dog' || !username || !regexCheck.test(username)) {
        const errorMessage = 'Invalid username';
        res.status(401);
        res.send(game.loginPage(errorMessage));
        return;
    }

    const sid = uuidv4();
    sessions[sid] = { username:username };

    if (gameMappings[username] === null || gameMappings[username] === undefined) {
        gameMappings[username]  = { game:newGame() };
    }

    res.cookie("sid", sid);
    res.redirect('/');
});

//Performs guess action
app.post('/guess', (req, res) => {
    const sid = req.cookies.sid;

    if (!sid || !sessions[sid]) {
        res.redirect('/');
        return;
    }

    const username = sessions[sid].username;
    const game = gameMappings[username].game;
    const guess = req.body.guess;
	takeTurn(game, guess);
    res.redirect('/');
});

//Performs new game action
app.post('/new-game', (req, res) => {
    const sid = req.cookies.sid;
    
    if (!sid || !sessions[sid]) {
        res.redirect('/');
        return;
    }

    const username = sessions[sid].username;
    gameMappings[username].game = newGame();
    res.redirect('/');
});

//Performs logout action
app.post('/logout', (req, res) => {
    const sid = req.cookies.sid;

    if (sid && sessions[sid]) {
        delete sessions[sid];
        res.clearCookie('sid', sid);
    }

    res.redirect('/'); 
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));