import { Component } from '@angular/core';
import { BoardComponent, ScoreComponent, MenuComponent, TimerComponent, StartRoundComponent } from './index';
import { SocketService } from './socket.service';
declare var io: any; // this allows global variable to exist inside this file

@Component({
	selector: 'my-app',
	directives: [BoardComponent, ScoreComponent, TimerComponent, StartRoundComponent, MenuComponent],
	styles: [``],
	template: `
		<board></board>
		<button (click)="userClick()"></button>
		<timer></timer>
		<start-round></start-round>
		<score></score>
		<menu></menu>
	`
})

export class AppComponent {

		constructor(private socketService: SocketService) {}

		userClick() {

			this.socketService.startStop();

		}

}
