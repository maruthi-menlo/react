import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlayaAdminLandingComponent } from './playa-admin-landing.component';

const routes: Routes = [
    {
      path: '',
      component: PlayaAdminLandingComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayaAdminLandingRoutingModule { }

