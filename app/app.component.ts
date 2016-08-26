import { Component } from '@angular/core';
import { BoardComponent, ScoreComponent, MenuComponent, TimerComponent, StartRoundComponent } from './index';
import { SocketService } from './socket.service';
declare var io: any; // this allows global variable to exist inside this file

@Component({
	selector: 'my-app',
	directives: [BoardComponent],
	styles: [``],
	template: `
		<button (click)="userClick()"></button>
		<board></board>
		<score></score>
	`
})

export class AppComponent {

		constructor(private socketService: SocketService) {}

		userClick() {

			this.socketService.startStop();

		}

}
