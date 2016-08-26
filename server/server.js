var currentBoard = [];
var currentBoard2 = [];
var nextBoard = [];
var nextBoard2 = [];
var displayBoard = [];
var running = false;
var running2 = false;
var players = {
	player1: false,
	player2: false
};
var birthArray = [3];
var liveArray = [3, 4];
var speed = 500;
var gameType = 0;
var gameLength = 60000;
var boardSize = 0;
var boardWidth = 80;
var boardHeight = 60;

// var util = require('util');

for (var height = 0; height < boardHeight; height++) {
	currentBoard.push([]);
	currentBoard2.push([]);
	nextBoard.push([]);
	nextBoard2.push([]);
	displayBoard.push([]);
	for (var width = 0; width < boardWidth; width++) {
		currentBoard[height].push(0);
		currentBoard2[height].push(0);
		nextBoard[height].push(0);
		nextBoard2[height].push(0);
		displayBoard[height].push(0);
	}
}

var boardDetails = {
	currentBoard: displayBoard,
	boardWidth: boardWidth,
	boardHeight: boardHeight,
	gameType: gameType
};

var express = require("express");

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// var PORT = process.env.port || 8000;

var bodyParser = require("body-parser");
var session = require('express-session');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
	secret: "Secret Key",
	resave: false,
	saveUninitialized: false
}));

//do this for every request
app.use(function(req, res, next) {
	console.log(req.url);
	next();
});

// if we want to respond to GET requests for "/"
// app.get("/", function(req, res) {
// 	res.sendFile(__dirname + "../index.html");
// });

// if we want to respond to POST requests for "/api"
// app.post("/api", function(req, res) {
// 	res.send("success");
// });

io.on('connection', function(socket) {

	var player;

	if (!players.player1) {
		player = 1;
		players.player1 = socket; // JSON.stringify(util.inspect(socket)) to see socket
		console.log('user connected as player 1');
	} else if (!players.player2) {
		player = 2;
		players.player2 = socket;
		console.log('user connected as player 2');
	} else {
		player = 0;
	console.log('user connected as observer');
	}

	socket.on('disconnect', function() {
	if (socket === players.player1) {
		players.player1 = false;
		player = 'player1';
	} else if (socket === players.player2) {
		players.player2 = false;
		player = 'player2';
	} else {
		player = 'observer';
	}
	console.log(player + ' disconnected');
	});

	socket.emit('initialboard', [boardDetails, player]);

	socket.on('startstop', function() {
		if (players.player1 === socket) {
			running = !running;
		}
		if (players.player2 === socket) {
			running2 = !running2;
		}
	});

	socket.on('playerclick', function(posObj) {

		if (players.player1 === socket) {
			if (currentBoard[posObj.y][posObj.x] === 0) {
				currentBoard[posObj.y][posObj.x] = 1;
			} else {
				currentBoard[posObj.y][posObj.x] = 0;
			}
		}

		if (players.player2 === socket) {
			if (currentBoard2[posObj.y][posObj.x] === 0) {
				currentBoard2[posObj.y][posObj.x] = 1;
			} else {
				currentBoard2[posObj.y][posObj.x] = 0;
			}
		}

	});

});

setInterval(function() {
	update();
}, speed);

function update() {

	if (!(running || running2)) {
		return;
	}

	var surroundingCellCount;

	generateNextBoard(running, currentBoard, nextBoard, 1);

	generateNextBoard(running2, currentBoard2, nextBoard2, 2);

	for (var y = 0; y < boardHeight; y++) {
		for (var x = 0; x < boardWidth; x++) {
			if (currentBoard[y][x] === 0 && currentBoard2[y][x] === 0) {
				displayBoard[y][x] = 0;
			} else if (currentBoard[y][x] === 1 && currentBoard2[y][x] === 0) {
				displayBoard[y][x] = 1;
			} else if (currentBoard[y][x] === 0 && currentBoard2[y][x] === 1) {
				displayBoard[y][x] = 2;
			} else {
				displayBoard[y][x] = 3;
			}
		}
	}

	io.emit('currentboard', displayBoard);

}

function generateNextBoard(isRunning, current, next, player) {

	if (isRunning) {
		for (var y = 0; y < current.length; y++) {
			for (var x = 0; x < current[y].length; x++) {
				surroundingCellCount = 0;
				for (var l = -1; l <= 1; l++) {
					for (var m = -1; m <= 1; m++) {
						if (current[y + l] && current[y + l][x + m] === 1) {
							surroundingCellCount++;
						}
					}
				}
				if (current[y][x] === 0 && birthArray.indexOf(surroundingCellCount) !== -1) {
					next[y][x] = 1;
				} else if (current[y][x] === 1 && liveArray.indexOf(surroundingCellCount) !== -1) {
					next[y][x] = 1;
				} else {
					next[y][x] = 0;
				}
			}
		}

		if (player === 1) {
			currentBoard = next;
		} else if (player ===2) {
			currentBoard2 = next;
		}

		current = next;
		next = [];

		for (var height = 0; height < boardHeight; height++) {
			next.push([]);
			for (var width = 0; width < boardWidth; width++) {
				next[height].push(0);
			}
		}

		if (player === 1) {
			nextBoard = next;
		} else if (player === 2) {
			nextBoard2 = next;
		}

	}

}

// if we want to serve static files out of ./public
// app.use(express.static("public"));

server.listen(8000, function() {
	console.log('Listening on port 8000');
});