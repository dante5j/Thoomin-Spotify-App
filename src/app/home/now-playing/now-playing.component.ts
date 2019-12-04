import { Component, NgZone, OnInit } from '@angular/core';
import {
  PlaybackState,
  SpotifyPlayer,
  Track
} from 'src/app/models/spotify.model';

import { HomeComponent } from '../home.component';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {
  playbackState: PlaybackState;
  prevTracks: Track[];
  currTrack: Track;
  nextTracks: Track[];
  tracksLength: number;
  player: SpotifyPlayer;
  partyCode: string;

  constructor(private zone: NgZone, private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.playbackState = this.spotifyService.playbackState;
    this.setNowPlaying();
    this.spotifyService.$playbackState.subscribe((state: PlaybackState) => {
      this.playbackState = state;
      this.setNowPlaying();
    });
    this.partyCode = localStorage.getItem('partyCode');
  }

  setNowPlaying() {
    this.zone.run(() => {
      if (this.playbackState) {
        this.prevTracks = this.playbackState.track_window.previous_tracks;
        this.currTrack = this.playbackState.track_window.current_track;
        this.nextTracks = this.playbackState.track_window.next_tracks;
      }
    });
  }

  playpause() {
    this.spotifyService.playpause();
  }

  prev() {
    this.spotifyService.prev();
  }

  next() {
    this.spotifyService.next();
  }

  seek(value: number) {
    this.spotifyService.seek(value);
  }
}
