import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  test: any;
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getHelloWorld().subscribe((t: any) => {
      this.test = t.message;
    });
  }
}
