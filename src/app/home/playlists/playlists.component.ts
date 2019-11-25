import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlistItems: any[];
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getUser().subscribe((user: any) => {
      console.log('user', user);
      this.spotifyService.getPlaylists(user.id).subscribe((playlists: any) => {
        console.log('playlists', playlists);
        this.playlistItems = playlists.items;
      });
    });
  }
}
