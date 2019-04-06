import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule } from '../core/footer/footer.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
