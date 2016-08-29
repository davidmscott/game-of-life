import { Component } from '@angular/core';
import { BoardComponent, ScoreComponent, TimerComponent, StartRoundComponent, MenuComponent, CountdownComponent, WinnerComponent} from './index';
import { SocketService } from './socket.service';
declare var io: any; // this allows global variable to exist inside this file

@Component({
	selector: 'my-app',
	directives: [BoardComponent, ScoreComponent, TimerComponent, StartRoundComponent, MenuComponent, CountdownComponent, WinnerComponent],
	styles: [`
		div {
			position: relative;
		}
		canvas, menu, start-round, countdown, winner {
			position: absolute;
		}
		menu, start-round, countdown {
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		menu {
			color: white;
		}
		winner {
			top: 25%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
	`],
	template: `
		<div>
			<board></board>
			<start-round></start-round>
			<menu
				*ngIf="showMenu"
			></menu>
			<countdown></countdown>
			<winner></winner>
		</div>
		<button (click)="userClick()">Pause</button>
		<button (click)="click()">Options</button>
		<timer></timer>
		<score></score>
	`
})

export class AppComponent {

		constructor(private socketService: SocketService) {}

		userClick() {

			this.socketService.startStop();

		}

		showMenu = false;
		showStart = true;

		click() {
			this.showMenu = !this.showMenu;
			if (this.showMenu) {
				this.showStart = false;
			} else {
				this.showStart = true;
			}
		}

}
