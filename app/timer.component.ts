import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'timer',
	styles: [`
		.urgent {
			font-weight: bold;
			color: red;
		}
	`],
	template: `
		<div [class.urgent]="isUrgent">Timer: {{timer}}</div>
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
