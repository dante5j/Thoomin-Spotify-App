import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';
  constructor(private http: HttpClient) {}

  getHelloWorld() {
    return this.http.get(`${this.url}/api/helloworld`);
  }
}
