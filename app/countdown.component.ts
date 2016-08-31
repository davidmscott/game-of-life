import { Component } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'countdown',
	styles: [`
		div {
			color: #eee;
			font-size: 7em;
			font-weight: bold;
			text-shadow: 0 0 2em lightblue;
		}
	`],
	template: `
		<div
			*ngIf="showCountdown"
		>{{countdown}}
		</div>
	`
})

export class CountdownComponent {

	constructor(private socketService: SocketService) {}

	connection;

	showCountdown = false;
	countdown = '';

	ngOnInit() {

		this.connection = this.socketService.runCountdown().subscribe(function(data) {

			if (data) {
				this.showCountdown = true;
				this.countdown = data;
			} else {
				this.countdown = '';
				this.showCountdown = false;
			}

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();
	}


}
