import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'timer',
	styles: [``],
	template: `
		<div>Timer: {{timer}}</div>
	`
})

export class TimerComponent {

	constructor(private socketService: SocketService) {}

	connection;
	timer = '';

	ngOnInit() {

		this.connection = this.socketService.getTime().subscribe(function(data) {

			this.timer = data;

		}.bind(this));
	}

	ngOnDestroy() {

		this.connection.unsubscribe();
	}

}
