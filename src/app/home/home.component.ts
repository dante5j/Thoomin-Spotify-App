import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';
import { SpotifyService } from '../services/spotify.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  firebaseConfig = {
    apiKey: 'AIzaSyAGeKbRZW_WHgDrbIYclh-sVaCEn9RPQTc',
    databaseURL: 'https://thoomin-spotify-app.firebaseio.com'
  };
  thoominToken: string;
  constructor(
    private cookieService: CookieService,
    private loginService: LoginService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    const thoominToken = this.cookieService.get('thoominToken');
    const customToken = thoominToken
      ? thoominToken
      : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NDk3NjI1MywiZXhwIjoxNTc0OTc5ODUzLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpjaGFybGllY2hhbXA2MTYifQ.rl--VIf0HCRN5vgR4uPzuXTX1zRxGYvwVjozgJqJ0pzurZCdyN84wmBpL9gEf3utReoV5Dam5S35sxJZMgf6akCFnwJL3FQr4AE12d9l0DGkVwfwBVuqchpL0xoC2A27xMIyW8sDgWWSjqQTZ6V9NlslN8TPUD0caiHxyfVtJHcQ9CF3cGhf81ZextPcKFO2FInn4wlu8JdMD8WbTekULUqRBRnql3zZeg91v6D9dGwa45nlLu88vsrL9lC25tMSBePdyJNytnQ1VdG6vBL0JUSHAXdsxWdnRQMJrnmYE4FmvkfFJlqB9vXtYPzUb6LWSZzwkRgub1MSJGBge42AlQ';
    this.thoominToken = this.cookieService.get('thoominToken');
    firebase.initializeApp(this.firebaseConfig);
    firebase
      .auth()
      .signInWithCustomToken(customToken)
      .then(res => {
        console.log('Login successful', res);
        this.getAccessToken();
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  getAccessToken() {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        this.loginService.getAccessToken(idToken).subscribe((res: any) => {
          localStorage.setItem('accessToken', res.accessToken);
        });
        if (!this.spotifyService.playerConnected) {
          timer(1000)
            .pipe(take(2))
            .subscribe(() => {
              this.spotifyService.connectPlayer();
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
