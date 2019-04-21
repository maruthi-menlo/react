import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { LoginModule } from './login/login.module';
import { FooterModule } from './core/footer/footer.module';
import { SharedModule } from './shared/shared.module'
import { RegisterModule } from './register/register.module';
import { TokenInterceptor } from './auth/token.interceptor';
import { AddCustomerModule } from './add-customer/add-customer.module';
import { NavBarModule } from './nav-bar/nav-bar.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { PlayaAdminLandingModule } from './playa-admin-landing/playa-admin-landing.module';
import { CustomersDataComponent } from './customers-data/customers-data.component';
import { DeactivatePlayaAccountModalComponent } from './core/modals/deactivate-playa-account-modal/deactivate-playa-account-modal.component';
import { DeactivateEditUserComponent } from './core/modals/deactivate-edit-user/deactivate-edit-user.component';
import {ToastModule} from '../app/core/toaster/toaster.module';
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CustomersDataComponent,
    DeactivatePlayaAccountModalComponent,
    DeactivateEditUserComponent,
    // DashboardComponent
  ],
  entryComponents: [DeactivatePlayaAccountModalComponent,DeactivateEditUserComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    LoginModule,
    FooterModule,
    NavBarModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [ DeactivatePlayaAccountModalComponent ]
})
export class AppModule { }
