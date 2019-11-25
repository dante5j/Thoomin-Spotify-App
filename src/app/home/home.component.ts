import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';

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
  constructor(private cookieService: CookieService,
              private loginService: LoginService) {}

  ngOnInit() {
    const thoominToken = this.cookieService.get('thoominToken');
    const customToken = thoominToken ? thoominToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NDY3NTExOCwiZXhwIjoxNTc0Njc4NzE4LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpjaGFybGllY2hhbXA2MTYifQ.ZKqB2um9fecF6sSo9PGHE3fxXcb-kHOe4MRcLbrX2teUg3UJXbF6eLIisj-MToiir4Cd3axT38EiBe_OxK7oHEQY1BgQdiBpLL1FlW9tsQa51dmKDcNdlY_ad7R47CDDD1ncdWbBB8lMsRNIs5bUzxUur36fsMQpn53loussLoOphQ4HIKnPJBbUzLatlXObBP8z9RPn2y3hHXoykh2GI0nOaSmzFOvJvI-GZIgo57SUG6IT6AEC23fuze6gpxOkvRxc9fOsS45bkCBYiefKa27jJnUVM6mcEAiFQFT4g5oM2yHgHv8Z8sKmxbfHRowUJ0TKcGuDqxxlDrbuYDHtHg';
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
        console.log('id token', idToken);
      })
      .catch(error => {
        console.error(error);
      });
  }
}
