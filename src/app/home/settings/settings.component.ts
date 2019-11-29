import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    // this.playSong();
  }

  playSong() {
    this.spotifyService.playSong().subscribe(() => {
      console.log('Now Playing');
    });
  }
}
