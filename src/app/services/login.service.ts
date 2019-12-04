import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';
  partyCreated = false;
  constructor(private http: HttpClient) {}

  login() {
    return this.http.get(`${this.url}/api/user/login`);
  }

  getAccessToken(idToken: string) {
    return this.http.post(`${this.url}/api/user/accessToken`, {
      idToken
    });
  }

  createParty(idToken: string, partyName: string) {
    this.partyCreated = true;
    return this.http.post(`${this.url}/api/user/party/create`, {
      idToken,
      partyName
    });
  }
}
