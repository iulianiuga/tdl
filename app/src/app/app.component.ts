import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  message: string = '';
  messages: string[] = [];
  serverResponses: string[] = [];
  command: string = '';
  commandOutput: string = '';  // Initialize commandOutput

  @ViewChild('commandOutputDiv', { static: false }) commandOutputDiv!: ElementRef;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.onEvent('chat message').subscribe(msg => {
      if (msg) {
        this.messages.push(msg);
      }
    });

    this.socketService.onEvent('server response').subscribe(response => {
      if (response) {
        this.serverResponses.push(response);
      }
    });

    this.socketService.onEvent('command response').subscribe(response => {
      if (response) {
        this.commandOutput += response + '\n';  // Append response to commandOutput
        this.scrollToBottom();  // Scroll to bottom whenever new output is added
      }
    });
  }

  sendMessage() {
    if (this.message) {
      this.socketService.emit('chat message', this.message);
      this.message = '';
    }
  }

  runCommand() {
    if (this.command) {
      this.commandOutput = '';  // Clear previous command output
      this.socketService.runCommand(this.command);
      this.command = '';
    }
  }

  scrollToBottom(): void {
    try {
      if (this.commandOutputDiv) {
        this.commandOutputDiv.nativeElement.scrollTop = this.commandOutputDiv.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom', err);
    }
  }
}
