import { Component } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'menu',
	styles: [``],
	template: `
		<div
			(click)="optionsButton()"
		>
			Options
		</div>
		<div
			*ngIf="showMenu"
		>
			Menu Display
		</div>
	`
})

export class MenuComponent {

	showMenu = false;

	optionsButton() {

		this.showMenu = !this.showMenu;

	}

}
