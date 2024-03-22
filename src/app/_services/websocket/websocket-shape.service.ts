// service to connect to a websocket server
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketShapeService {
  // public shapeSocket$!: WebSocketSubject<any>;
  // public count = 0;
  // constructor() {}

  // public connect(): Observable<any> {
  //   const url = "ws://localhost:8000/ws";
  //   this.shapeSocket$ = new WebSocketSubject(url);
  //   this.count++;
  //   return this.shapeSocket$;
  // }

  // public sendMessage(message: any): void {
  //   this.shapeSocket$.next(message);
  // }

  // public closeConnection(): void {
  //     this.shapeSocket$.unsubscribe();
  // }
}