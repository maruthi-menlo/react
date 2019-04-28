import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'', redirectTo: '/login', pathMatch: 'full'},
  { path:'addcustomer', loadChildren: './add-customer/add-customer.module#AddCustomerModule'},
  { path:'addcsp', loadChildren: './add-customer/add-customer.module#AddCustomerModule'},
  { path:'editcustomer/:type', loadChildren: './add-customer/add-customer.module#AddCustomerModule'},
  // { path:'register', loadChildren: './register/register.module#RegisterModule'},
  // { path:'navbar', loadChildren: './nav-bar/nav-bar.module#NavBarModule'},
  // { path:'playalanding', loadChildren: './playa-admin-landing/playa-admin-landing.module#PlayaAdminLandingModule'},
  { path:'editplayaprofile', loadChildren: './edit-playa-admin/edit-playa-admin.module#EditPlayaAdminModule'},
  { path:'customersview', loadChildren: './customers-view/customers-view.module#CustomersViewModule'},
  { path:'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
  { path:'forgotpassword', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'},
  { path:'azuresubscriptions', loadChildren: './azure-subscriptions/azure-subscriptions.module#AzureSubscriptionsModule'},
  { path: 'updatepassword/:id', loadChildren: './create-password/create-password.module#CreatePasswordModule'},
  { path: 'resetpassword/:id', loadChildren: './create-password/create-password.module#CreatePasswordModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
