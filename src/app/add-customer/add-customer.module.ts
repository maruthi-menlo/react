import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCustomerRoutingModule } from './add-customer-routing.module';
import { AddCustomerComponent } from './add-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddCustomerComponent],
  imports: [
    CommonModule,
    AddCustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddCustomerComponent]
})
export class AddCustomerModule { }
