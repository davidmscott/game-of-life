import { Component } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'menu',
	styles: [`
		table {
			background-color: #111;
			border: 2px solid #eee;
			border-collapse: collapse;
		}
		td {
			opacity: 0.8;
			font-size: 1.5em;
			padding: 1em;
			vertical-align: middle;
		}
		caption {
			font-size: 3em;
			align: center;
			color: #eee;
			background-color: #111;
			padding: 0.25em 0;
			border: 2px solid #eee;
			border-bottom: none;
		}
		select {
			float: right;
			width: 7em;
		}
		select:focus {
			outline: none;
		}
		label {
			color: #eee;
		}
		div {
			width: 8em;
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
						<option value="0" selected>Standard</option>
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
						<option value="1" selected>Medium</option>
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
						<option value="100" selected>Medium</option>
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
						<option value="60000" selected>1 Minute</option>
						<option value="120000">2 Minutes</option>
						<option value="180000">3 Mintues</option>
				</select>
			</td>
		</tr>
	</table>
	`
})

export class MenuComponent {

	constructor(private socketService: SocketService) {}

	options = {
		gametype: 0,
		cellnum: 1,
		speed: 100,
		length: 60000
	};

	onChange(evt) {

		this.socketService.updateOptions(this.options);

	}

}
