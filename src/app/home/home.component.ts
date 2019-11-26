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
      : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NDc1MzMzOCwiZXhwIjoxNTc0NzU2OTM4LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpjaGFybGllY2hhbXA2MTYifQ.Nvx9sQ-7swIdjG26dtnrWdbD3QiI5apIXLG55H68ClS9ue3P1MWgi6-nxoCbgbNIms6BduyfFmtO09F2y8NLHbV_dCFZcgfItAJSr9VVe-Aa3uanIEIpH_GLxt4Vy8_beXgH1pESqv753i0-Alv7CBTDVGCadnRZTp5yfLncVjf8XG8gneB2Xj9EUtTd03DP5NttTX3ay57_GhPEbL6mDn5eGd3fofro8Iid72LG9175Rgx_3Hq2UONGv7fgXYvy163nTR84p-gdyTwpkh-IivZ1EdXC2ZGAQSMJ03ubmnF3d1bAZx_BH44J9Lcjfp47SkR8w3eRZ5B5GerFWUviWQ';
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

  playSong() {
    this.spotifyService.playSong().subscribe(() => {
      console.log('Now Playing');
    });
  }
}
