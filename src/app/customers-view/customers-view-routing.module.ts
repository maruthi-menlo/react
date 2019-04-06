import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersViewComponent } from './customers-view.component'

const routes: Routes = [
  {
    path:'',
    component: CustomersViewComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersViewRoutingModule { }
