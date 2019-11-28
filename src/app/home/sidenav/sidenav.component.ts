import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  menuItems = [
    {
      name: 'Dashboard',
      route: 'dashboard'
    },
    {
      name: 'Now Playing',
      route: 'now-playing'
    },
    {
      name: 'Queue',
      route: 'queue'
    },
    {
      name: 'Settings',
      route: 'settings'
    }
  ];
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
