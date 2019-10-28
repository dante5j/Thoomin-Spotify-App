import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent }
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
