// import { Component, ViewChild, ElementRef, Input } from '@angular/core';
// import { SocketService } from './socket.service';
// // declare var io: any;

// @Component({
// 	selector: '.cell',
// 	styles: [`
// 		div {
// 			background-color: blue;
// 		}
// 		.alive {
// 			background-color: yellow;
// 		}
// 		.dead {
// 			background-color: black;
// 		}
// 	`],
// 	template: `
// 		<div #cell
// 			(click)="playerClick(); changeAlive()"
// 			[ngClass]="setClass()"
// 			[attr.id]="cell_id + '_' + row_id"
// 		></div>
// 	`
// })

// export class CellComponent {

// 	@Input() row_id: number;
// 	@Input() cell_id: number;
// 	@Input() cellValue: number;

// 	@ViewChild('cell') cell: ElementRef;

// 	live = false;

// 	setClass() {
// 		let classes = {
// 			alive: this.live,
// 			dead: !this.live
// 		};
// 		return classes;
// 	}

// 	changeAlive() {
// 		this.live = !this.live;
// 	}

// 	playerClick() {
// 		console.log('playerClick');
// 		this.socketService.socket.emit('playerX click', {
// 			x: this.cell_id,
// 			y: this.row_id
// 		});
// 	}

// 	connection;

// 	constructor(private socketService: SocketService) {}

// 	ngAfterViewInit() {
// 		this.setDivHeight();
// 	}

// 	setDivHeight() {
// 		console.log(this.cell.nativeElement.style.width);
// 		this.cell.nativeElement.style.height = this.cell.nativeElement.offsetWidth;
// 	}

// }
