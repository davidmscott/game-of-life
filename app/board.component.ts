import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'board',
	styles: [``],
	template: `
		<div>
		<canvas
			(click)="onClick($event)"
			#canvas
			(window:resize)="onResize()"
		></canvas>
		</div>
	`
})

export class BoardComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	@ViewChild('canvas') canvas: ElementRef;

	connection;
	optionsConnection;
	initialBoardConnection;
	resetClicksConnection;
	roundOngoingConnection;
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
	currentClicks = [];
	roundOngoing = false;

	ngOnInit() {

		this.resetClicksConnection = this.socketService.resetClicks().subscribe(function(data) {

			this.currentClicks = [];

		}.bind(this));

		this.initialBoardConnection = this.socketService.getInitialBoard().subscribe(function(data) {

			this.boardArray = data[0].currentBoard;
			this.boardWidth = data[0].boardWidth;
			this.boardHeight = data[0].boardHeight;
			this.canvasDraw();
			this.drawAll(this.boardArray);
			if (data[1]) {
				this.setPlayer(data[1]);
			}

		}.bind(this));

		this.roundOngoingConnection = this.socketService.roundOngoing().subscribe(function(data) {

			this.roundOngoing = data;

		}.bind(this));

		this.optionsConnection = this.socketService.optionsChange().subscribe(function(data) {

			this.boardArray = data.currentBoard;
			this.boardWidth = data.boardWidth;
			this.boardHeight = data.boardHeight;
			this.cellSize = this.boardWidthpx / this.boardWidth;

		}.bind(this));

		this.connection = this.socketService.getCurrentBoard().subscribe(function(data) {

			this.boardArray = data[0];
			this.drawAll(this.boardArray);

			if (this.player === 1 && data[1]) {
				this.currentClicks = [];
			}
			if (this.player === 2 && data[2]) {
				this.currentClicks = [];
			}

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();
		this.optionsConnection.unsubscribe();
		this.initialBoardConnection.unsubscribe();
		this.resetClicksConnection.unsubscribe();
		this.roundOngoingConnection.unsubscribe();

	}

	onResize() {

		this.canvasDraw();
		this.drawAll(this.boardArray);

	}

	setPlayer(player) {

		this.player = player;

		if (this.player === 2) {
			this.thisPlayerColor = this.player2Color;
			this.otherPlayerColor = this.player1Color;
		}

	}

	drawCell(cell, ctx, grad, rgba1, rgba2, rgba3, rgb, glow) {

		grad = ctx.createRadialGradient(this.cellSize / 2 + cell.x, this.cellSize / 2 + cell.y, 0, this.cellSize / 2 + cell.x, this.cellSize / 2 + cell.y, 141.42 / 200 * this.cellSize);
		grad.addColorStop(0, rgba1);
		grad.addColorStop(0.1, rgba2);
		grad.addColorStop(1, rgba3);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = grad;
		if (glow) {
			ctx.shadowBlur = this.cellSize * glow;
			ctx.shadowColor = rgb;
		} else {
			ctx.shadowBlur = 0;
			ctx.shadowColor = '';
		}
		ctx.fillRect(cell.x + this.cellSize * 0.05, cell.y + this.cellSize * 0.05, this.cellSize * 0.9, this.cellSize * 0.9);

	}

	drawAll(data) {

		let ctx = this.canvas.nativeElement.getContext("2d");
		let grad;
		ctx.fillStyle = this.blankColor;
		ctx.fillRect(0, 0, this.boardWidthpx, this.boardHeightpx);

		for (var y = 0; y < data.length; y++) {
			for (var x = 0; x < data[y].length; x++) {

				if (y === 0 && x === 0) {
				}

				if (data[y][x] !== 0) {
					let cell = {
						x: (x * this.cellSize),
						y: (y * this.cellSize)
					};

					if (data[y][x] === 1) {
						this.drawCell(cell, ctx, grad, 'rgba(153,218,255,1)', 'rgba(153,218,255,1)', 'rgba(0,128,128,1)', 'rgb(0, 128, 128)', 0.75);
					} else if (data[y][x] === 2) {
						this.drawCell(cell, ctx, grad, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,0,0,1)', 'rgb(255, 0, 0)', 0.75);
					} else if (data[y][x] === 3) {
						this.drawCell(cell, ctx, grad, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(128,0,128,1)', 'rgb(128, 0, 128)', 0.75);
					} else if (data[y][x] === 4) {
						this.drawCell(cell, ctx, grad, 'rgba(153,218,255,0.25)', 'rgba(153,218,255,0.25)', 'rgba(0,128,128,0.25)', 'rgb(0, 128, 128)', false/*0.25*/);
					} else if (data[y][x] === 5) {
						this.drawCell(cell, ctx, grad, 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.25)', 'rgba(255,0,0,0.25)', 'rgb(255, 0, 0)', false/*0.25*/);
					}

				}
			}
		}

	}

	onClick(evt) {

		if (!this.roundOngoing || this.player === 0) {
			return;
		}

		let fillColor;
		let rect = this.canvas.nativeElement.getBoundingClientRect();
		let click = {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};

		let ctx = this.canvas.nativeElement.getContext("2d");
		let grad;
		let cell = {
			x: Math.floor(click.x / this.cellSize),
			y: Math.floor(click.y / this.cellSize)
		};
		let cellpx = {
			x: cell.x * this.cellSize,
			y: cell.y * this.cellSize
		};

		if (this.currentClicks.indexOf(cell.x + ' ' + cell.y) === -1) {
			this.currentClicks.push(cell.x + ' ' + cell.y);
			if (this.player === 1) {
				if ([0, 4, 5].indexOf(this.boardArray[cell.y][cell.x]) !== -1) {
					this.drawCell(cellpx, ctx, grad, 'rgba(153,218,255,1)', 'rgba(153,218,255,1)', 'rgba(0,128,128,1)', 'rgb(0, 128, 128)', 0.75);
				} else if (this.boardArray[cell.y][cell.x] === 2) {
					this.drawCell(cellpx, ctx, grad, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(128,0,128,1)', 'rgb(128, 0, 128)', 0.75);
				} else if (this.boardArray[cell.y][cell.x] === 3) {
					this.drawCell(cellpx, ctx, grad, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,0,0,1)', 'rgb(255, 0, 0)', 0.75);
				}
			} else if (this.player === 2) {
				if ([0, 4, 5].indexOf(this.boardArray[cell.y][cell.x]) !== -1) {
					this.drawCell(cellpx, ctx, grad, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,0,0,1)', 'rgb(255, 0, 0)', 0.75);
				} else if (this.boardArray[cell.y][cell.x] === 1) {
					this.drawCell(cellpx, ctx, grad, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(128,0,128,1)', 'rgb(128, 0, 128)', 0.75);
				} else if (this.boardArray[cell.y][cell.x] === 3) {
					this.drawCell(cellpx, ctx, grad, 'rgba(153,218,255,1)', 'rgba(153,218,255,1)', 'rgba(0,128,128,1)', 'rgb(0, 128, 128)', 0.75);
				}
			}

			this.socketService.socket.emit('playerclick', {
				x: cell.x,
				y: cell.y
			});
		}
	}

	canvasDraw() {

		this.boardWidthpx = window.innerWidth;
		this.boardHeightpx = window.innerWidth * this.boardHeight / this.boardWidth;
		this.cellSize = this.boardWidthpx / this.boardWidth;
		let ctx = this.canvas.nativeElement.getContext("2d");

		this.canvas.nativeElement.width = this.boardWidthpx;
		this.canvas.nativeElement.height = this.boardHeightpx;
		ctx.fillStyle = this.blankColor;
		ctx.fillRect(0, 0, this.boardWidthpx, this.boardHeightpx);

	}

}
