import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePasswordComponent } from './create-password.component';

const routes: Routes = [
  {
    path:'',
    component: CreatePasswordComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePasswordRoutingModule { }
