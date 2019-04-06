import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'', redirectTo: '/login', pathMatch: 'full'},
  { path:'addcustomer', loadChildren: './add-customer/add-customer.module#AddCustomerModule'},
  // { path:'register', loadChildren: './register/register.module#RegisterModule'},
  // { path:'navbar', loadChildren: './nav-bar/nav-bar.module#NavBarModule'},
  // { path:'playalanding', loadChildren: './playa-admin-landing/playa-admin-landing.module#PlayaAdminLandingModule'},
  { path:'editplayaprofile', loadChildren: './edit-playa-admin/edit-playa-admin.module#EditPlayaAdminModule'},
  { path:'customersview', loadChildren: './customers-view/customers-view.module#CustomersViewModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }