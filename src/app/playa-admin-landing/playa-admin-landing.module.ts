import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayaAdminLandingRoutingModule } from './playa-admin-landing-routing.module';
import { PlayaAdminLandingComponent } from './playa-admin-landing.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { AddCustomerModule } from '../add-customer/add-customer.module';
import { EditPlayaAdminModule } from '../edit-playa-admin/edit-playa-admin.module';
import { CustomersViewModule } from '../customers-view/customers-view.module';

@NgModule({
  declarations: [PlayaAdminLandingComponent],
  imports: [
    CommonModule,
    PlayaAdminLandingRoutingModule,
    AddCustomerModule,
    EditPlayaAdminModule,
    CustomersViewModule
  ]
})
export class PlayaAdminLandingModule { }
