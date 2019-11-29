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
      : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NTAwODg1NCwiZXhwIjoxNTc1MDEyNDU0LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpjaGFybGllY2hhbXA2MTYifQ.lcizPh_K7QgC6WbLq_KDRYdtbifzLgSrIpVtzFZanHNBbfT-UDmKrWNVDISjapC2XdXqW7IX1FhGGre0H8hM-8z1iT30GTse9dHFPWru6Uicw224K7lJlzu9d2r9wNUg80lPMsb7EColD-HWaX2Ji-5jfAIwCcJVxlR0GZvfyxIbdYRRXp42lvbUFSz03lqkpxKBpmMcW2fnHCf_IYTc0vgnHoTCqsTbeOqeNXHVlkB3T-NbiL4aBUgk2-WMogK7Ay2QNzBasnhVPnDnzmCXcsxec2Aq9grv9os3Nr-y4wuJ-QnVYyTFfKZCcMjkc1KcA85nxZ4lrWOTL2f5gViy8Q';
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
    this.spotifyService.$user.subscribe(user => {
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
          if (!this.spotifyService.playerConnected) {
            timer(1000)
              .pipe(take(2))
              .subscribe(() => {
                this.spotifyService.connectPlayer();
              });
          }
          this.loginService.createParty(idToken, 'test').subscribe((party: any) => {
            console.log('party code', party);
            localStorage.setItem('partyCode', party.partyCode);
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
