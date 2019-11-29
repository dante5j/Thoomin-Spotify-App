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
  isSidenavOpen = true;
  user: any;
  constructor(
    private cookieService: CookieService,
    private loginService: LoginService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    const thoominToken = this.cookieService.get('thoominToken');
    const customToken = thoominToken
      ? thoominToken
      : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NTAwNDM2NCwiZXhwIjoxNTc1MDA3OTY0LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpjaGFybGllY2hhbXA2MTYifQ.RcmMyVfuRtPH3JtENAESeF9bxrxhiKmcSuGjtu0RcuTtg2IdeDrG41Yx5uopBzraqKVxT1tQijIZTB98LsoaJ2qi9LeNH_AM5xMOQy5LUiGLiCYcdnnoyZ5ZfVZhqlXb-fXNPpjKrPnfW1NK5xubQZfj616aRXhM6TZb809yY5Xec8BtQ1O2lHisL69Z_Q2VR67_mpXKP6UeQ-d7ezQQJ3asO4aV05qEoVOWhS8rUXCRTh8BLWJh5RV8EGRegylpHbKjptMprF-1CHQN5wfcOnkQwu9-0AEummDd-fBauoMg2e73aso0BI9JdCTUHI_E5dvSB4QTgAmP-1_faCuQrQ';
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
    this.spotifyService.$user.subscribe((user) => {
      this.user = user;
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

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
