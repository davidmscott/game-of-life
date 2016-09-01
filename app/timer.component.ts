import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'timer',
	styles: [`
		div {
			font-size: 6.25vw;
			margin: 1vw;
			color: #eee;
			text-shadow: 0 0 .375vw;
		}
		.urgent {
			font-weight: bold;
			color: #FF0000;
			font-size: 7.5vw;
		}
	`],
	template: `
		<div [class.urgent]="isUrgent">{{timer}}</div>
	`
})

export class TimerComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	connection;
	timer = '';
	isUrgent = false;

	ngOnInit() {

		this.connection = this.socketService.getTime().subscribe(function(data) {

			this.timer = data;
			if (this.timer <= 10) {
				this.isUrgent = true;
			} else {
				this.isUrgent = false;
			}

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();

	}

}
