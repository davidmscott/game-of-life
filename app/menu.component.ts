import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'menu',
	styles: [`
		{
			background-color: #222;
		}
		table {
			border: 2px solid #eee;
			border-collapse: collapse;
			background-color: #222;
		}
		td {
			opacity: 0.8;
			font-size: 1.875vw;
			text-shadow: 0 0 .025vw;
			padding: 2vw;
			vertical-align: middle;
			background-color: #222;
		}
		caption {
			font-size: 3.75vw;
			text-shadow: 0 0 .0625vw;
			align: center;
			color: #eee;
			background-color: #222;
			padding: 1vw;
			border: 2px solid #eee;
			border-bottom: none;
		}
		select {
			float: right;
			width: 13.125vw;
		}
		select:focus {
			outline: none;
		}
		label {
			color: #eee;
		}
		div {
			width: 15vw;
		}
	`],
	template: `
	<table>
		<caption>Game Settings</caption>
		<tr>
			<td>
				<div>
					<label for="gametype">Game Type:</label>
				</div>
			</td>
			<td>
				<select
					name="gametype"
					[(ngModel)]="options.gametype"
					(ngModelChange)="onChange($event)"
				>
						<option value="0">Standard</option>
						<option value="1">Side Attack</option>
						<option value="2">Territory</option>
				</select>
			</td>
			<td>
				<div>
					<label for="cellnum">Number of Cells:</label>
				</div>
			</td>
			<td>
				<select
					name="cellnum"
					[(ngModel)]="options.cellnum"
					(ngModelChange)="onChange($event)"
				>
						<option value="0">Small</option>
						<option value="1">Medium</option>
						<option value="2">Large</option>
				</select>
			</td>
		</tr>
		<tr>
			<td>
				<label for="speed">Speed:</label>
			</td>
			<td>
				<select
					name="speed"
					[(ngModel)]="options.speed"
					(ngModelChange)="onChange($event)"
				>
						<option value="1000">Very Slow</option>
						<option value="500">Slow</option>
						<option value="100">Medium</option>
						<option value="60">Fast</option>
						<option value="20">Very Fast</option>
				</select>
			</td>
			<td>
				<label for="length">Round Length:</label>
			</td>
			<td>
				<select
					name="length"
					[(ngModel)]="options.length"
					(ngModelChange)="onChange($event)"
				>
						<option value="30000">30 Seconds</option>
						<option value="45000">45 Seconds</option>
						<option value="60000">1 Minute</option>
						<option value="120000">2 Minutes</option>
						<option value="180000">3 Mintues</option>
				</select>
			</td>
		</tr>
	</table>
	`
})

export class MenuComponent implements OnInit, OnDestroy {

	constructor(private socketService: SocketService) {}

	options = {
		gametype: 2,
		cellnum: 0,
		speed: 100,
		length: 60000
	};

	connection;

	ngOnInit() {

		this.connection = this.socketService.optionsChange().subscribe(function(data) {

			this.options.gametype = data.gameType;
			this.options.cellnum = data.boardSize;
			this.options.speed = data.speed;
			this.options.length = data.gameLength;

		}.bind(this));

		this.socketService.socket.emit('updateoptions', false); // not sure why this is here

	}

	ngOnDestroy() {

		this.connection.unsubscribe();

	}

	onChange(evt) {

		this.socketService.updateOptions(this.options);

	}

}
