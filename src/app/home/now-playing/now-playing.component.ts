import { Component, OnInit, NgZone } from '@angular/core';
import {
  PlaybackState,
  Track,
  SpotifyPlayer
} from 'src/app/models/spotify.model';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {
  state: PlaybackState;
  prevTracks: Track[];
  currTrack: Track;
  nextTracks: Track[];
  tracksLength: number;
  player: SpotifyPlayer;

  constructor(private zone: NgZone,
              private spotifyService: SpotifyService) {}

  ngOnInit() {
    if ((window as any).Spotify) {
      // tslint:disable-next-line: max-line-length
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
        this.state = state;
        this.setNowPlaying();
      });
      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        this.playSong();
      });
      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
      // Connect to the player!
      this.player.connect();
    }
  }

  playSong() {
    this.spotifyService.playSong().subscribe(() => {
      console.log('Now Playing');
    });
  }

  setNowPlaying() {
    this.zone.run(() => {
      this.prevTracks = this.state ? this.state.track_window.previous_tracks : [];
      this.currTrack = this.state ? this.state.track_window.current_track : {} as Track;
      this.nextTracks = this.state ? this.state.track_window.next_tracks : [];
    });
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
}
