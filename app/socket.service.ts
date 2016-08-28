import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
declare var io: any;

@Injectable()
export class SocketService {

	private url = 'http://localhost:8000';

	socket;

	constructor() {

		this.socket = io(this.url);

	}

	getCurrentBoard() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('currentboard', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	getTime() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('gameclock', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	startStop() {

		this.socket.emit('startstop', {});

	}

}
