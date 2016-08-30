import { Component, OnInit, OnDestroy } from '@angular/core';
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
		canvas, menu, start-round, countdown, winner, timer, #menubutton {
			position: absolute;
		}
		start-round, countdown {
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		menu {
			top: 45%;
			left: 50%;
			transform: translate(-50%,0%);
			color: white;
		}
		winner {
			top: 25%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		timer {
			top: 100%;
			left: 50%;
			transform: translate(-50%,0%);
		}
		#menubutton {
			top: 100%;
			background-image: url("./images/menu-icon-grey.png");
			width: 5em;
			height: 5em;
			background-size: cover;
		}
	`],
	template: `
		<div>
			<board></board>
			<start-round
			></start-round>
			<menu
				*ngIf="showMenu"
			></menu>
			<countdown></countdown>
			<winner></winner>
			<timer></timer>
			<div
				id="menubutton"
				*ngIf="isPlayer1"
				(click)="click()"
			></div>
			<score></score>
		</div>
	`
})

export class AppComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	isPlayer1 = false;
	showMenu = false;
	showStart = true;
	connection;

	click() {
		if (this.showStart) {
			this.showMenu = true;
			this.showStart = false;
		} else {
			this.showMenu = false;
			this.showStart = true;
		}
	}

	ngOnInit() {

		this.connection = this.socketService.getInitialBoard().subscribe(function(data) {

			if (data[1] === 1) {
				this.isPlayer1 = true;
			}

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();

	}

}
