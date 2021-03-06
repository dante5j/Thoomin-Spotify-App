import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Track } from 'src/app/models/spotify.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  tracks: Track[] = [];
  id: string;
  name: string;
  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.getPlaylist();
    });
  }

  getPlaylist() {
    this.spotifyService.getPlaylist(this.id).subscribe((res: any) => {
      this.name = res.name;
      this.tracks = [];
      res.tracks.items.forEach(item => {
        this.tracks.push(item.track);
      });
    });
  }

  addSong(track: Track) {
    this.spotifyService.addTrack(track.id, localStorage.getItem('partyCode')).subscribe((res) => {
      console.log('track added', res);
      // if (!this.spotifyService.firstSongAdded) {
      //   this.spotifyService.setFirstSongAdded(true);
      //   this.spotifyService.playPlaylist(localStorage.getItem('partyPlaylistId')).subscribe(playlist => {
      //     console.log('playing playlist', playlist);
      //   });
      // }
    });
  }
}
