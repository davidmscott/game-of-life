import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { SocketService } from './socket.service';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports:      [ BrowserModule, FormsModule ],
	declarations: [ AppComponent ],
	bootstrap:    [ AppComponent ],
	providers:    [ SocketService ]
})

export class AppModule {
	
}
