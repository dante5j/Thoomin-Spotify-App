import * as firebase from 'firebase';

import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';

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
  enableCreateParty = false;
  partyCode: string;
  partyName = '';
  modalTitle = {
    logout: 'Log out'
  };

  constructor(
    private cookieService: CookieService,
    public loginService: LoginService,
    private spotifyService: SpotifyService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.loginService.partyCreated) {
      this.router.navigate(['home/dashboard']);
    }
    const thoominToken = this.cookieService.get('thoominToken');
    const customToken = thoominToken
      ? thoominToken
      : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NTQzMzUzMSwiZXhwIjoxNTc1NDM3MTMxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpjaGFybGllY2hhbXA2MTYifQ.gpiNovXrZlzLxuccq3sgi794RvIwY6ja1jis1K19zfQNG-pUgWBsis66dgiK7DC1Yqxqjw3ThTRwpdACKHTOXlVvM2_4n2FI-vvx_lh188OdhTu4ZjAgTqcGfQsqH-luQ_PNrMrl766gLWDozT8kwTZ0Y5-wDJAk7kA9-2q8n0l7hNbfMmVjUHzF1IXuYDjVMWhNQ4LmTfI1lDPOnkAUCDw9hynaR9R6IA6LLpY4Z4HKrpypqLEj4H7gHCQuDgWqFdmGpQQWpv9PYEu3b1N4lZEId1ExX_6X3Mcj7CBYdZKuIPelQCXwi8qiIzH54QVM2MI3oTH4gTpueHYUxjJu_g';
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
        localStorage.setItem('idToken', idToken);
        this.loginService.getAccessToken(idToken).subscribe((res: any) => {
          localStorage.setItem('accessToken', res.accessToken);
          if (!this.spotifyService.playerConnected) {
            timer(1000)
              .pipe(take(2))
              .subscribe(() => {
                this.spotifyService.connectPlayer();
              });
          }
          this.enableCreateParty = true;
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  createParty() {
    this.loginService.createParty(localStorage.getItem('idToken'), this.partyName).subscribe((party: any) => {
      console.log('party code', party);
      localStorage.setItem('partyCode', party.partyCode.partyCode);
      localStorage.setItem('partyPlaylistId', party.playlistId);
    });
    this.partyCode = localStorage.getItem('partyCode');
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  open(modal) {
    this.modalService.open(modal);
  }

  logout() {
    this.router.navigate(['']);
  }
}
