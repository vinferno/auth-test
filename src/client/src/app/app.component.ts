import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private http: HttpClient) {

  }


  login(){
    this.http.post('http://localhost:3501/login', {"username": "what is this"}, {withCredentials: true}).subscribe(data => console.log(data));
  }
  logout(){
    this.http.get('http://localhost:3501/logout', { withCredentials: true }).subscribe(data => console.log(data));
  }
  getUsers(){
    this.http.get('http://localhost:3501/users', { withCredentials: true }).subscribe(data => console.log(data));
  }
}
