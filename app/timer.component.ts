import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'timer',
	styles: [`
		div {
			font-size: 5em;
			margin: 0.1em;
			color: #eee;
		}
		.urgent {
			font-weight: bold;
			color: #6E0300;
			font-size: 6em;
		}
	`],
	template: `
		<div [class.urgent]="isUrgent">{{timer}}</div>
	`
})

export class TimerComponent {

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
