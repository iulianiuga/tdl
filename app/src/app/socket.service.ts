import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket: Socket;

  constructor() {
    // Configure the socket with reconnection options
    const serverUrl = `${window.location.protocol}//${window.location.hostname}`;//:${window.location.port}`;
    this.socket = io(serverUrl + ':3000', {
      reconnection: true,
      reconnectionAttempts: Infinity, // Infinite attempts to reconnect
      reconnectionDelay: 1000, // Start with 1 second delay between attempts
      reconnectionDelayMax: 5000, // Maximum delay of 5 seconds between attempts
      randomizationFactor: 0.5 // Randomization factor for delay
    });

    // Listen for connection and reconnection events
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Reconnection failed');
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });
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
