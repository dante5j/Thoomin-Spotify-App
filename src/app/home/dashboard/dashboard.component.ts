import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Track } from 'src/app/models/spotify.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  search = '';
  tracks: Track[];
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {}

  searchSpotify() {
    this.spotifyService.search(this.search).subscribe((result: any) => {
      this.tracks = result.tracks.items;
      console.log(this.tracks);
    });
  }
}
