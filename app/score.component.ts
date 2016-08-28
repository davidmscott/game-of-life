import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'score',
	styles: [``],
	template: `
		<div>
			<div>Player 1: {{playerOneScore}}</div>
			<div>Player 2: {{playerTwoScore}}</div>
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
