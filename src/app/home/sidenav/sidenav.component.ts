import { Component, OnInit } from '@angular/core';

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
      name: 'Your Playlists',
      route: 'playlists'
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

  constructor() {}

  ngOnInit() {}
}
