import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
declare var io: any;

@Injectable()
export class SocketService {

	private url = window.location.hostname + ':8000';

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

	getInitialBoard() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('initialboard', function(data) {
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

	runCountdown() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('countdown', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	menuOffAtCountdown() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('menuavailable', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	winnerIs() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('winner', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	optionsChange() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('optionschange', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	roundOngoing() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('roundongoing', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}

	resetClicks() {

		let socket = this.socket;
		let observable = new Observable(function(observer) {
			socket.on('resetclicks', function(data) {
				observer.next(data);
			});
		});

		return observable;

	}


	updateOptions(options) {

		this.socket.emit('updateoptions', options);

	}

	startStop() {

		this.socket.emit('startstop', true);

	}

}
