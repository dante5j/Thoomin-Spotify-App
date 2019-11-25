import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';
  // tslint:disable-next-line: max-line-length
  accessToken = 'BQD6U0vEO6-lVCJptPvPvZzJGWcmpQ4qZTttonyL6s1-EKoouYG0lmM0mhuVhAcrq7CaTknuesevQPANiiVram51-G5j7ljaR6ikjSe6_l4QpoF4uyjDHYP8587RRHLQL6SKJi3hnRk2vZkTHdEeesFFbiuyV38309O8jHwyVQ';
  constructor(private http: HttpClient) {}

  getTrack() {
    return this.http.post(`${this.url}/api/spotify/track`, {
      trackId: '5nayhWICkQGMTkisxVMbRw'
    });
  }

  playSong() {
    return this.http.put(
      'https://api.spotify.com/v1/me/player/play?device_id=251ba7a418d1159758a358b3ec73b5338b5c7f2b',
      { uris: ['spotify:track:1W24W6jQegnNh0x5DfBBPT'] },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    );
  }
}
