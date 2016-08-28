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
			*ngIf="display"
			(click)="startRound()"
		>Start Round</div>
	`
})

export class StartRoundComponent {

	constructor(private socketService: SocketService) {}

	connection;

	display = true;

	startRound() {

		this.socketService.socket.emit('begingame', {});
		this.display = false;

	}


	ngOnInit() {

		this.connection = this.socketService.getTime().subscribe(function(data) {
			console.log(data);
			if (data === 0) {
				this.display = true;
			}
		}.bind(this));
	}

	ngOnDestroy() {

		this.connection.unsubscribe();
	}


}
