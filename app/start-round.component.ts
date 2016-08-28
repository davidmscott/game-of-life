import { Component } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'start-round',
	styles: [`
		div {
			background-color: green;
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
		>
			Waiting for Player 1 to start round...
		</div>
	`
})

export class StartRoundComponent {

	constructor(private socketService: SocketService) {}

	connection;

	showStartButton = false;
	showWaitingMsg = false;

	player1 = true;

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

		this.socketService.socket.on('initialboard', function(data) {

			if (data[1] === 1) {
				this.player1 = true;
				this.showStartButton = true;
			} else {
				this.player1 = false;
				this.showWaitingMsg = true;
			}

		}.bind(this));

		this.socketService.socket.on('roundongoing', function(data) {

			if (data) {
				this.showStartButton = false;
				this.showWaitingMsg = false;
			}

		}.bind(this));
	}

	ngOnDestroy() {

		this.connection.unsubscribe();
	}


}
