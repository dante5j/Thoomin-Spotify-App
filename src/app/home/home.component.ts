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
      : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NDkxNzE1NCwiZXhwIjoxNTc0OTIwNzU0LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjoxMjIwNTAzNjI1In0.rrTJnU5MeJgbLg3VwHIFJz9PsXXO4X_xFT0DEA0N1VtN5Tz4WBOhdyve2AE3vFqH4S-QUrA_p7IeU5DFXXyfF7G47CaSPDs-c4F7ey2HwnKEDyX7nGtDKYOTJkj24pj_N1v5e1QwPtigjxENTApQlQtR2Y-j3kWXp8VCnuj2RAzdVkGT_5eSHbEY66Z-ZA5oIXxIz5n7MSGNortnUUWbj1wlTGpZXDtrW271pokDQNL5lqiwSCRxsZ7J6Rhlf6Ti112aA5BqtHxZ4WNw6brkzxIckIrWeUu6MDuKhI7Xmwc8COFrHCtgLVMlQVBUOIv90bN637rq85vrizBsEsACyw';
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
