import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app2';
  cmdtext = 'dir';
  respmsg: any[] = [];

  constructor(private http: HttpClient) { }

  onSend() {
    console.log("send", this.cmdtext);
    this.http.post<any>(`/api/cmd`, { cmd: this.cmdtext }).subscribe(res => {
      console.log('server res', res);
      if(res.success) {
        this.respmsg = res.messages;
      }
    })
  }
}

