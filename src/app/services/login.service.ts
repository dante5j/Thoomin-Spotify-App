import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';
  constructor(private http: HttpClient) {}

  login() {
    return this.http.get(`${this.url}/api/user/login`);
  }

  getAccessToken(idToken: string) {
    return this.http.post(`${this.url}/api/user/accessToken`, {
      idToken
    });
  }
}
