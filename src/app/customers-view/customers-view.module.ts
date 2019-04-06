import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersViewRoutingModule } from './customers-view-routing.module';
import { CustomersViewComponent } from './customers-view.component';

@NgModule({
  declarations: [CustomersViewComponent],
  imports: [
    CommonModule,
    CustomersViewRoutingModule
  ],
  exports: [CustomersViewComponent]
})
export class CustomersViewModule { }
