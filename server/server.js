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
var playerOneScore = 0;
var playerTwoScore = 0;
var birthArray = [3];
var liveArray = [3, 4];
var speed = 100;
var gameType = 2;
var gameLength = 60000;
var lastTime;
var roundStarted = false;
var boardSize = 0;
var boardWidth = 40;
var boardHeight = 18;
var countdown = 0;

function clearBoards() {

	currentBoard = [];
	currentBoard2 = [];
	nextBoard = [];
	nextBoard2 = [];
	displayBoard = [];
	displayBoardgame2 = [];

	for (var height = 0; height < boardHeight; height++) {
		currentBoard.push([]);
		currentBoard2.push([]);
		nextBoard.push([]);
		nextBoard2.push([]);
		displayBoard.push([]);
		displayBoardgame2.push([]);
		for (var width = 0; width < boardWidth; width++) {
			currentBoard[height].push(0);
			currentBoard2[height].push(0);
			nextBoard[height].push(0);
			nextBoard2[height].push(0);
			displayBoard[height].push(0);
			displayBoardgame2[height].push(0);
		}
	}

}

clearBoards();

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

	socket.on('startstop', function(data) {
		if (players.player1 === socket) {
			running = !running;
		}
		if (players.player2 === socket) {
			running2 = !running2;
		}
		socket.emit('resetclicks', true);
	});

	socket.on('updateoptions', function(options) {

		if (options) {

			gameType = parseInt(options.gametype, 10);
			boardSize = parseInt(options.cellnum, 10);
			boardWidth = [40, 70, 100][parseInt(options.cellnum, 10)];
			boardHeight = [18, 27, 45][parseInt(options.cellnum, 10)];
			clearBoards();
			clearInterval(interval);
			speed = parseInt(options.speed, 10);
			interval = setInterval(function() {
				update();
			}, speed);
			gameLength = parseInt(options.length, 10);
			boardDetails = {
				currentBoard: displayBoard,
				boardSize: boardSize,
				boardWidth: boardWidth,
				boardHeight: boardHeight,
				gameType: gameType,
				gameLength: gameLength,
				speed: speed
			};

		} else {

			boardDetails = {
				currentBoard: displayBoard,
				boardSize: boardSize,
				boardWidth: boardWidth,
				boardHeight: boardHeight,
				gameType: gameType,
				gameLength: gameLength,
				speed: speed
			};

			io.emit('optionschange', boardDetails);

		}

		io.emit('optionschange', boardDetails);

	});

	socket.on('playerclick', function(posObj) {

		if (players.player1 === socket) {
			if (currentBoard[posObj.y][posObj.x] === 0) {
				currentBoard[posObj.y][posObj.x] = 1;
			} //else {
				//currentBoard[posObj.y][posObj.x] = 0;
			//}
		}

		if (players.player2 === socket) {
			if (currentBoard2[posObj.y][posObj.x] === 0) {
				currentBoard2[posObj.y][posObj.x] = 1;
			} // else {
				//currentBoard2[posObj.y][posObj.x] = 0;
			//}
		}

	});

	socket.on('begingame', function() {

		clearBoards();
		roundStarted = true;
		playerOneScore = 0;
		playerTwoScore = 0;
		running = false;
		running2 = false;
		timer = gameLength;
		countdown = 5000;
		io.emit('menuavailable', false);
		io.emit('resetclicks', true);
		io.emit('gameclock', timer / 1000);
		io.emit('winner', false);
		io.emit('currentboard', [displayBoard, running, running2, playerOneScore, playerTwoScore]);

	});

});

var interval = setInterval(function() {

	update();

}, speed);

function update() {

	roundCountdown();

	if (countdown) {
		return;
	}

	if (roundStarted) {

		if (!lastTime) {
			lastTime = gameLength / 1000;
		}

		timer -= speed;

		if (lastTime > Math.ceil(timer / 1000)) {
			lastTime = Math.ceil(timer / 1000);
			io.emit('gameclock', lastTime);
			if (lastTime === 0) {
				running = false;
				running2 = false;
				roundStarted = false;
				io.emit('menuavailable', true);
				io.emit('roundongoing', false);
				roundOutcome();
			}
		}

		if (!(running || running2)) {
			return;
		}

	} else {
		return;
	}

	var surroundingCellCount;

	generateNextBoard(running, currentBoard, nextBoard, 1);

	generateNextBoard(running2, currentBoard2, nextBoard2, 2);

	var y = 0;
	var x = 0;

	for (y = 0; y < boardHeight; y++) {
		for (x = 0; x < boardWidth; x++) {
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

	if (gameType === 2) {
		for (y = 0; y < boardHeight; y++) {
			for (x = 0; x < boardWidth; x++) {
				if ([1, 2, 3].indexOf(displayBoard[y][x]) !== -1) {
					displayBoardgame2[y][x] = displayBoard[y][x];
				} else if (displayBoardgame2[y][x] === 1) {
					displayBoardgame2[y][x] = 4;
				} else if (displayBoardgame2[y][x] === 2) {
					displayBoardgame2[y][x] = 5;
				}
			}
		}
	}

	score();

	if (gameType === 2) {
		io.emit('currentboard', [displayBoardgame2, running, running2, playerOneScore, playerTwoScore]);
	} else {
		io.emit('currentboard', [displayBoard, running, running2, playerOneScore, playerTwoScore]);
	}

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

function score() {

	var y = 0;
	var x = 0;

	if (gameType === 0) {
		for (y = 0; y < boardHeight; y++) {
			for (x = 0; x < boardWidth; x++) {
				if (displayBoard[y][x] === 1 && running) {
					playerOneScore++;
				} else if (displayBoard[y][x] === 2 && running2) {
					playerTwoScore++;
				} else if (displayBoard[y][x] === 3) {
					if (running) {
						playerOneScore++;
					}
					if (running2) {
						playerTwoScore++;
					}
				}
			}
		}
	} else if (gameType === 1) {
		for (y = 0; y < boardHeight; y++) {
			for (x = 0; x < boardWidth; x = x + boardWidth - 1) {
				if (displayBoard[y][x] === 1 && running && x !== 0) {
					playerOneScore++;
				} else if (displayBoard[y][x] === 2 && running2 && x === 0) {
					playerTwoScore++;
				} else if (displayBoard[y][x] === 3) {
					if (running && x !== 0) {
						playerOneScore++;
					}
					if (running2 && x === 0) {
						playerTwoScore++;
					}
				}
			}
		}
	} else if (gameType === 2) {
		playerOneScore = 0;
		playerTwoScore = 0;
		for (y = 0; y < boardHeight; y++) {
			for (x = 0; x < boardWidth; x++) {
				if (displayBoardgame2[y][x] === 1 || displayBoardgame2[y][x] === 4) {
					playerOneScore++;
				} else if (displayBoardgame2[y][x] === 2 || displayBoardgame2[y][x] === 5) {
					playerTwoScore++;
				} else if (displayBoardgame2[y][x] === 3) {
					playerOneScore++;
					playerTwoScore++;
				}
			}
		}
	}

}

function roundCountdown() {

	if (countdown) {
		if (countdown <= 1000) {
			io.emit('countdown', false);
			io.emit('roundongoing', true);
			countdown = 0;
			return;
		} else if (countdown <= 2000) {
			io.emit('countdown', 'GO!');
		} else if (countdown <= 3000) {
			io.emit('countdown', '1');
		} else if (countdown <= 4000) {
			io.emit('countdown', '2');
		} else if (countdown <= 5000) {
			io.emit('countdown', '3');
		}
		countdown -= speed;
	}

}

function roundOutcome() {
	if (playerOneScore > playerTwoScore) {
		io.emit('winner', 'PLAYER 1 WINS!');
		console.log('player 1 wins');
	} else if (playerOneScore < playerTwoScore) {
		io.emit('winner', 'PLAYER 2 WINS!');
		console.log('player 2 wins');
	} else {
		io.emit('winner', "IT'S A TIE!");
		console.log("it's a tie");
	}
}

server.listen(8000, function() {
	console.log('Listening on port 8000');
});