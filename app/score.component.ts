import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'score',
	styles: [`
		* {
			color: #eee;
		}
		.player1, .player2 {
			text-align: center;
			position: absolute;
			width: 30%;
			margin: 1vw 0 0 0;
			font-size: 2.5vw;
			text-shadow: 0 0 0.125vw;
		}
		.player1 {
			left: 10%;
		}
		.player2 {
			left: 60%;
		}
		.score {
			font-size: 7vw;
			text-shadow: 0 0 0.375vw;
		}
	`],
	template: `
		<div class="scorebox">
			<div class="player1">PLAYER 1 SCORE
				<div class="score">{{playerOneScore}}</div>
			</div>
			<div class="player2">PLAYER 2 SCORE
				<div class="score">{{playerTwoScore}}</div>
			</div>
		</div>
	`
})

export class ScoreComponent implements OnInit, OnDestroy {

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
