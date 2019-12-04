import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Track } from 'src/app/models/spotify.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  queue: any[];

  constructor(private spotifyService: SpotifyService,
              private loginService: LoginService) {}

  ngOnInit() {
    if (this.loginService.partyCreated) {
      this.getQueue();
    }
  }

  getQueue() {
    this.queue = this.spotifyService.queue;
    this.spotifyService
      .getQueue(localStorage.getItem('partyCode'))
      .subscribe((queue: any) => {
        console.log('Queue', queue);
        this.queue = queue;
        this.spotifyService.setQueue(queue);
      });
  }

  removeSong(track: Track) {
    this.queue = this.queue.filter(t => t.id !== track.id);
    this.spotifyService
      .removeTrack(
        localStorage.getItem('partyCode'),
        localStorage.getItem('idToken'),
        track.id
      )
      .subscribe(res => {
        console.log('track removed', res);
      });
  }
}
