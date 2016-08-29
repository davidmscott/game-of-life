import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'score',
	styles: [`
		.playerscore {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		.player1box {
			position: relative;
			width: 25%;
			float: left;
		}
		.player2box {
			position: relative;
			width: 25%;
			float: right;
		}
	`],
	template: `
		<div>
			<div class="player1box">
				<div class="playerscore">Player 1: {{playerOneScore}}</div>
			</div>
			<div class="player2box">
				<div class="playerscore">Player 2: {{playerTwoScore}}</div>
			</div>
		</div>
	`
})

export class ScoreComponent {

	constructor(private socketService: SocketService) {}

	connection;
	playerOneScore = 0;
	playerTwoScore = 0;

	ngOnInit() {

		this.connection = this.socketService.getCurrentBoard().subscribe(function(data) {
			this.playerOneScore = data[3];
			this.playerTwoScore = data[4];
		}.bind(this));
	}

	ngOnDestroy() {

		this.connection.unsubscribe();
	}

}
