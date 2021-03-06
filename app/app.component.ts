import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardComponent, ScoreComponent, TimerComponent, StartRoundComponent, MenuComponent, CountdownComponent, WinnerComponent} from './index';
import { SocketService } from './socket.service';
declare var io: any; // this allows global variable to exist inside this file

@Component({
	selector: 'my-app',
	directives: [BoardComponent, ScoreComponent, TimerComponent, StartRoundComponent, MenuComponent, CountdownComponent, WinnerComponent],
	styles: [`
		#container {
			position: relative;
		}
		canvas, menu, start-round, countdown, winner, timer, #menubutton, #play, #pause, #onScreenPause {
			position: absolute;
		}
		start-round, countdown, #onScreenPause {
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		menu {
			top: 40%;
			left: 50%;
			transform: translate(-50%,0%);
			color: white;
		}
		winner {
			top: 20%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		timer {
			top: 100%;
			left: 50%;
			transform: translate(-50%,0%);
		}
		#onScreenPause {
			pointer-events: none;
			opacity: 0.2;
			width: 30%;
			height: 70%;
			background-size: cover;
			background-image: url("./images/pause-button.png");
		}
		#menubutton {
			top: 100%;
			width: 6.25vw;
			height: 6.25vw;
			background-size: cover;
			background-image: url("./images/menu-icon-grey.png");
		}
		#play, #pause {
			top: 100%;
			right: 0%;
			transform: translate(0%,0%);
			width: 4.6875vw;
			height: 4.6875vw;
			background-size: cover;
			margin-top: .625vw;
			margin-right: .625vw;
		}
		#play {
			background-image: url("./images/play-button.png");
		}
		#pause {
			background-image: url("./images/pause-button.png");
		}
	`],
	template: `
		<div id="container">
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
				id="onScreenPause"
				*ngIf="this.duringRound && !this.play"
			></div>
			<div
				id="menubutton"
				*ngIf="isPlayer1"
				(click)="menuButtonClick()"
			></div>
			<div
				id="pause"
				*ngIf="play"
				(click)="pushPlay()"
			></div>
			<div
				id="play"
				*ngIf="!play"
				(click)="pushPlay()"
			></div>
			<score></score>
		</div>
	`
})

export class AppComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	isPlayer1 = false;
	isObserver = true;
	showMenu = false;
	showStart = true;
	menuAvailable = true;
	play = false;
	duringRound = false;
	connection;
	roundConnection;
	menuOffConnection;

	onKeyUp = function(evt) {

		if (evt.keyCode === 13) {
			this.pushPlay();
		}

	}.bind(this);

	menuButtonClick() {

		if (!this.duringRound && this.menuAvailable) {
			if (this.showStart) {
				this.showMenu = true;
				this.showStart = false;
			} else {
				this.showMenu = false;
				this.showStart = true;
			}
		}

	}

	pushPlay() {

		if (this.duringRound && !this.isObserver) {
			this.play = !this.play;
			this.socketService.startStop();
		}

	}

	ngOnInit() {

		document.addEventListener("keypress", this.onKeyUp);

		this.connection = this.socketService.getInitialBoard().subscribe(function(data) {

			if (data[1] === 1) {
				this.isPlayer1 = true;
				this.isObserver = false;
			} else if (data[1] === 0) {
				this.isObserver = true;
			} else {
				this.isObserver = false;
			}

		}.bind(this));

		this.roundConnection = this.socketService.roundOngoing().subscribe(function(data) {

			this.duringRound = data;
			if (!data) {
				this.play = false;
			}

		}.bind(this));

		this.menuOffConnection = this.socketService.menuOffAtCountdown().subscribe(function(data) {

			this.menuAvailable = data;

		}.bind(this));

	}

	ngOnDestroy() {

		this.connection.unsubscribe();
		this.roundConnection.unsubscribe();
		this.menuOffConnection.unsubscribe();

	}

}
