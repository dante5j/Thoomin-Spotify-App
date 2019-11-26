import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlaybackState, SpotifyPlayer } from '../models/spotify.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  url = 'https://thoomin-spotify-app.firebaseapp.com';
  player: SpotifyPlayer;
  playbackState: PlaybackState;
  $playbackState: Subject<PlaybackState> = new Subject<PlaybackState>();
  playerConnected = false;
  constructor(private http: HttpClient) {}

  getTrack() {
    return this.http.post(`${this.url}/api/spotify/track`, {
      trackId: '5nayhWICkQGMTkisxVMbRw'
    });
  }

  connectPlayer() {
    if ((window as any).Spotify) {
      this.playerConnected = true;
      const token = localStorage.getItem('accessToken');
      this.player = new (window as any).Spotify.Player({
        name: 'THOOMIN',
        getOAuthToken: cb => {
          cb(token);
        }
      });
      // Error handling
      this.player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });
      this.player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });
      this.player.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      this.player.addListener('playback_error', ({ message }) => {
        console.error(message);
      });
      // Playback status updates
      this.player.addListener('player_state_changed', state => {
        console.log(state);
        this.playbackState = state;
        this.$playbackState.next(state);
      });
      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
      // Connect to the player!
      this.player.connect();
    }
  }

  playpause() {
    this.player.togglePlay().then(() => {
      console.log('Toggled playback!');
    });
  }

  prev() {
    this.player.previousTrack().then(() => {
      console.log('Set to previous track!');
    });
  }

  next() {
    this.player.nextTrack().then(() => {
      console.log('Skipped to next track!');
    });
  }

  seek(value: number) {
    this.player.seek(value).then(() => {
      console.log('Changed position!');
    });
  }

  playSong() {
    const accessToken = localStorage.getItem('accessToken');
    const deviceId = localStorage.getItem('_spharmony_device_id');
    return this.http.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
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
    return this.http.get(`https://api.spotify.com/v1/users/${uid}/playlists`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  getUser() {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.get(`https://api.spotify.com/v1/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
}
