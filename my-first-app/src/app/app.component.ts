import { Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  username = '';
  showSecret = false;
  log: Date[] = [];

  onUpdateUsername(event: any) {
    this.username = (<HTMLInputElement>event.target).value;
  }

  onToggleDetails() {
    this.showSecret = !this.showSecret;
    this.log.push(new Date());
  }
}
