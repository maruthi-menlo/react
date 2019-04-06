import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AnonymousGuard } from 'src/app/shared/guards/anonymous.guard';

const routes: Routes = [
  {
    path: 'login',
    component:  LoginComponent,
    canActivate: [AnonymousGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
