import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AzureSubscriptionsComponent } from './azure-subscriptions.component';

const routes: Routes = [
  {
    path: '',
    component: AzureSubscriptionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AzureSubscriptionsRoutingModule { }
