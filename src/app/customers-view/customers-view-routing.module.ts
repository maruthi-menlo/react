import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersViewComponent } from './customers-view.component'
import { 
  AuthGuardService as AuthGuard 
} from '../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path:'',
    component: CustomersViewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersViewRoutingModule { }
