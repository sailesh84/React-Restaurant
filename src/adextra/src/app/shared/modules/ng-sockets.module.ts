import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '@env/environment';

/**
 * This variable represents the necessary parameters for open a connection with the WebSocket server.
 */
const config: SocketIoConfig = { url: environment.socket_server, options: {} };

/**
 * Module used for configure the use of WebSockets with Angular.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config),
  ],
  exports: [
    SocketIoModule,
  ]
})
export class NgSocketsModule { }
