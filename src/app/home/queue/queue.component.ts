import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  queue: any[];

  constructor(
    private spotifyService: SpotifyService,
  ) {}

  ngOnInit() {
    this.getQueue();
  }

  getQueue() {
    this.spotifyService.getQueue(localStorage.getItem('partyCode')).subscribe((queue: any) => {
      console.log('Queue', queue);
      this.queue = queue;
    });
  }
}
