import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { NowPlayingComponent } from './home/now-playing/now-playing.component';
import { PlaylistsComponent } from './home/playlists/playlists.component';
import { QueueComponent } from './home/queue/queue.component';
import { SettingsComponent } from './home/settings/settings.component';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'now-playing', component: NowPlayingComponent },
      { path: 'queue', component: QueueComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'playlist/:id', component: PlaylistsComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      relativeLinkResolution: 'corrected',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
