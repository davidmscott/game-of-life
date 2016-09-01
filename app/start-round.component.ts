import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'start-round',
	styles: [`
		div {
			background-color: lightblue;
			color: #222;
			font-size: 3em;
			font-weight: bold;
			padding: 0.2em 0.3em;
			border-radius: 0.4em;
			box-shadow: 0 0 .4em .2em lightblue;
		}
		.waiting {
			width: 16em;
			font-weight: normal;
		}
	`],
	template: `
		<div
			*ngIf="showStartButton"
			(click)="startRound()"
		>
			Start Round
		</div>
		<div
			*ngIf="showWaitingMsg"
			class="waiting"
		>
			Waiting for Player 1 to start round...
		</div>
	`
})

export class StartRoundComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	connection;
	initialBoardConnection;
	countdownConnection;

	showStartButton = false;
	showWaitingMsg = false;
	player1 = false;

	startRound() {

		this.socketService.socket.emit('begingame', {});

	}


	ngOnInit() {

		this.connection = this.socketService.getTime().subscribe(function(data) {

			if (data === 0 && this.player1) {
				this.showStartButton = true;
			} else if (data === 0 && !this.player1) {
				this.showWaitingMsg = true;
			}

		}.bind(this));

		this.initialBoardConnection = this.socketService.getInitialBoard().subscribe(function(data) {

			if (data[1] === 1) {
				this.player1 = true;
				this.showStartButton = true;
			} else {
				this.player1 = false;
				this.showWaitingMsg = true;
			}

		}.bind(this));

		this.countdownConnection = this.socketService.runCountdown().subscribe(function(data) {

			if (data) {
				this.showStartButton = false;
				this.showWaitingMsg = false;
			}

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();
		this.initialBoardConnection.unsubscribe();
		this.countdownConnection.unsubscribe();

	}


}
