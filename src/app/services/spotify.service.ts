import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';

  constructor(private http: HttpClient) {}

  getTrack() {
    return this.http.post(`${this.url}/api/spotify/track`, {
      trackId: '5nayhWICkQGMTkisxVMbRw'
    });
  }

  playSong() {
    const accessToken = localStorage.getItem('accessToken');
    const device_id = localStorage.getItem('_spharmony_device_id');
    return this.http.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      { uris: ['spotify:track:1W24W6jQegnNh0x5DfBBPT'] },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  }

  getPlaylists(uid: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.get(
      `https://api.spotify.com/v1/users/${uid}/playlists`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  }

  getUser() {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.get(
      `https://api.spotify.com/v1/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  }
}
