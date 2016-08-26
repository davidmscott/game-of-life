import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'board',
	styles: [``],
	template: `
		<canvas
			(click)="onClick($event)"
			#canvas
		></canvas>
	`
	// 		<tr
	// 			*ngFor="let row of boardArray; let i = index;"
	// 			class="cell-row"
	// 			[row_id]="i"
	// 			[cellArray]="row"
	// 		></tr>
	// 
})

// tabindex="1"
export class BoardComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	@ViewChild('canvas') canvas: ElementRef;

	connection;
	boardArray = [];
	boardWidth;
	boardHeight;
	boardWidthpx;
	boardHeightpx;
	cellSize;
	player = 0;
	player1Color = '#06f';
	player2Color = '#ff0';
	playerBothColor = '#3c3';
	thisPlayerColor = '#06f';
	otherPlayerColor = '#ff0';
	blankColor = '#111';

	onKeyUp = function(evt) {

		if (evt.keyCode === 13) {
			this.socketService.startStop();
		}

	}.bind(this);

	ngOnInit() {

		document.addEventListener("keypress", this.onKeyUp);

		this.socketService.socket.on('initialboard', function (data) {

			this.boardArray = data[0].currentBoard;
			this.boardWidth = data[0].boardWidth;
			this.boardHeight = data[0].boardHeight;
			this.canvasDraw();
			this.drawAll(this.boardArray);
			this.setPlayer(data[1]);

		}.bind(this));

		this.connection = this.socketService.getCurrentBoard().subscribe(function(data) {

			this.boardArray = data;
			this.drawAll(this.boardArray);

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();

	}

	setPlayer(player) {

		this.player = player;

		if (this.player === 2) {
			this.thisPlayerColor = this.player2Color;
			this.otherPlayerColor = this.player1Color;
		}

	}

	drawAll(data) {

		let ctx = this.canvas.nativeElement.getContext("2d");
		ctx.fillStyle = this.blankColor;
		ctx.fillRect(0, 0, this.boardWidthpx, this.boardHeightpx);

		for (var y = 0; y < data.length; y++) {
			for (var x = 0; x < data[y].length; x++) {

				if (data[y][x] !== 0) {
					let radius = (this.boardWidthpx / this.boardWidth) / 2;
					let fillColor;
					let cell = {
						x: (x * this.cellSize),
						y: (y * this.cellSize)
					};
					ctx.beginPath();
					ctx.arc(cell.x + radius, cell.y + radius, (this.boardWidthpx / this.boardWidth) / 2, 0, Math.PI * 2);

					if (data[y][x] === 1) {
						fillColor = this.player1Color;
					} else if (data[y][x] === 2) {
						fillColor = this.player2Color;
					} else if (data[y][x] === 3) {
						fillColor = this.playerBothColor;
					}

					ctx.fillStyle = fillColor;
					ctx.fill();
				}
			}
		}
	}

	onClick(evt) {

		if (this.player === 0) {
			return;
		}

		let fillColor;
		let rect = this.canvas.nativeElement.getBoundingClientRect();
		let click = {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};

		let ctx = this.canvas.nativeElement.getContext("2d");
		let cell = {
			x: Math.floor(click.x / this.cellSize),
			y: Math.floor(click.y / this.cellSize)
		};

		if (this.player === 1) {
			if (this.boardArray[cell.y][cell.x] === 0) {
				fillColor = this.thisPlayerColor;
			} else if (this.boardArray[cell.y][cell.x] === 1) {
				fillColor = this.blankColor; // maybe the players can only create life?
			} else if (this.boardArray[cell.y][cell.x] === 2) {
				fillColor = this.playerBothColor;
			} else if (this.boardArray[cell.y][cell.x] === 3) {
				fillColor = this.otherPlayerColor;
			}
		} else if (this.player === 2) {
			if (this.boardArray[cell.y][cell.x] === 0) {
				fillColor = this.thisPlayerColor;
			} else if (this.boardArray[cell.y][cell.x] === 1) {
				fillColor = this.playerBothColor;
			} else if (this.boardArray[cell.y][cell.x] === 2) {
				fillColor = this.blankColor;
			} else if (this.boardArray[cell.y][cell.x] === 3) {
				fillColor = this.otherPlayerColor;
			}
		}

		let radius = (this.boardWidthpx / this.boardWidth) / 2;
		ctx.beginPath();
		ctx.arc((cell.x * this.cellSize) + radius, (cell.y * this.cellSize) + radius, (this.boardWidthpx / this.boardWidth) / 2, 0, Math.PI * 2);
		ctx.fillStyle = fillColor;
		ctx.fill();

		this.socketService.socket.emit('playerclick', {
			x: cell.x,
			y: cell.y
		});

	}

	// onKeyUp(evt) {

	// 	if (evt.keyCode === 32) {
	// 		console.log(evt);
	// 		evt.preventDefault();
	// 		evt.stopPropagation();
	// 		this.socketService.startStop();
	// 	}

	// }

	canvasDraw() {

		this.boardWidthpx = window.innerWidth;
		this.boardHeightpx = window.innerWidth * this.boardHeight / this.boardWidth;
		this.cellSize = this.boardWidthpx / this.boardWidth;
		console.log(this.boardWidthpx, this.boardWidth, this.boardHeightpx, this.cellSize);
		let ctx = this.canvas.nativeElement.getContext("2d");

		this.canvas.nativeElement.width = this.boardWidthpx;
		this.canvas.nativeElement.height = this.boardHeightpx;
		ctx.fillStyle = this.blankColor;
		ctx.fillRect(0, 0, this.boardWidthpx, this.boardHeightpx);

	}

}
