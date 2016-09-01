import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'start-round',
	styles: [`
		div {
			background-color: lightblue;
			color: #222;
			font-size: 3.75vw;
			font-weight: bold;
			padding: 0.75vw 1.125vw;
			border-radius: 1.5vw;
			box-shadow: 0 0 1.875vw .9375vw lightblue;
		}
		.waiting {
			width: 65vw;
			font-weight: normal;
			text-align: center;
		}
	`],
	template: `
		<div
			*ngIf="showStartButton"
			(click)="startRound($event)"
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

	startRound(evt) {

		this.socketService.socket.emit('begingame', {player: this.player1});

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
