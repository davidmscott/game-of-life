import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'winner',
	styles: [`
		div {
			color: #eee;
			font-weight: bold;
			font-size: 10vw;
			text-align: center;
			width: 90vw;
			text-shadow: 0 0 1vw;
		}
	`],
	template: `
		<div
			*ngIf="showWinner"
		>{{winner}}
		</div>
	`
})

export class WinnerComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	connection;

	showWinner = false;
	winner = '';

	ngOnInit() {

		this.connection = this.socketService.winnerIs().subscribe(function(data) {

			if (data) {
				this.winner = data;
				this.showWinner = true;
			} else {
				this.winner = '';
				this.showWinner = false;
			}

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();
	}


}
