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


  modalTitle = {
    logout: 'Log out'
  };

  constructor(
    private cookieService: CookieService,
    private loginService: LoginService,
    private spotifyService: SpotifyService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    const thoominToken = this.cookieService.get('thoominToken');
    const customToken = thoominToken
      ? thoominToken
      : 'yourthoomintoken';
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
    this.loginService.createParty(localStorage.getItem('idToken'), 'test').subscribe((party: any) => {
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
  }
}
