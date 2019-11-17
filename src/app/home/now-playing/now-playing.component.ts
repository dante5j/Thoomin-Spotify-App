import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Track } from 'src/app/models/track.model';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {
  nowPlaying: Track;
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getTrack().subscribe((track: Track) => {
      this.nowPlaying = track;
    });
  }
}
