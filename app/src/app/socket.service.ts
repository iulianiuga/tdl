import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    const serverUrl = `${window.location.protocol}//${window.location.hostname}`;//:${window.location.port}`;
    console.log (serverUrl);
    //this.socket = io('http://192.168.100.103:3000');
    this.socket = io(serverUrl +':3000');
  }

  onEvent(event: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, data => observer.next(data));
    });
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  runCommand(cmd: string): void {
    this.emit('run command', cmd);
  }
}
