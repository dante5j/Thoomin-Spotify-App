import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';
  constructor(private http: HttpClient) {}

  getHelloWorld() {
    return this.http.get(`${this.url}/api/helloworld`);
  }

  getTrack() {
    return this.http.post(`${this.url}/api/spotify/track`, {
      trackId: '5nayhWICkQGMTkisxVMbRw'
    });
  }
}
