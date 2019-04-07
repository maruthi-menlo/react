import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePasswordRoutingModule } from './create-password-routing.module';
import { CreatePasswordComponent } from './create-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreatePasswordComponent],
  imports: [
    CommonModule,
    CreatePasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreatePasswordModule { }
