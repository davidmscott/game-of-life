import { Component } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
	selector: 'menu',
	styles: [`
		div {
			opacity: 0.5;
		}
	`],
	template: `
		<div
		>
			Menu Display
		</div>
	`
})

export class MenuComponent {

}
