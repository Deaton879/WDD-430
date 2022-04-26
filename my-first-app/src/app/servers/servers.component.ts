import { Component, OnInit } from '@angular/core';

@Component({
  // Make app-servers selector an HTML attribute
  // selector: '[app-servers]',

  // Make app-servers a CSS class
  // selector: '.app-servers',

  // Make app-servers an HTML element
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  serverCreationStatus = 'No server was created!';
  serverName = 'TestServer';
  serverCreated = false;
  servers = ['TestServer', 'TestServer 2'];

  constructor() { 
    setTimeout( () => {
      this.allowNewServer = true;
    } , 2000);
  }

  ngOnInit(): void {
  }

  onCreateServer() {
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = 'Server was created! Name is ' + this.serverName;
  }

  onUpdateServerName(event: any) {
    this.serverName = (<HTMLInputElement>event.target).value;
  }

  
}
