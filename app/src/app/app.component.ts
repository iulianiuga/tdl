// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { SocketService } from './socket.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   // title = 'app2';
//   // cmdtext = 'dir';
//   // respmsg: any[] = [];

//   // constructor(private http: HttpClient) { }

//   // onSend() {
//   //   console.log("send", this.cmdtext);
//   //   this.http.post<any>(`/api/cmd`, { cmd: this.cmdtext }).subscribe(res => {
//   //     console.log('server res', res);
//   //     if(res.success) {
//   //       this.respmsg = res.messages;
//   //     }
//   //   })
//   // }


//   message: string | undefined;
//   messages: string[] = [];

//   constructor(private socketService: SocketService) { }

//   ngOnInit() {
//     this.socketService.onEvent('chat message').subscribe(msg => {
//       if (msg) {
//         this.messages.push(msg);
//       }
//     });
//   }

//   sendMessage() {
//     if (this.message) {
//       this.socketService.emit('chat message', this.message);
//       this.message = '';
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  message: string | undefined;
  messages: string[] = [];
  serverResponses: string[] = [];
  command: string | undefined;
  commandResponses: string[] = [];

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
        this.commandResponses.push(response);
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
      this.socketService.runCommand(this.command);
      this.command = '';
    }
  }
}
