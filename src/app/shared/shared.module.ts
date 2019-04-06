import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule, NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from '../core/loader/loader.component';
import { CustomerService } from './services/customer.service'


@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule
  ],
  providers: [
    LoaderService,
    CustomerService
  ],
  exports: [LoaderComponent]
})
export class SharedModule { }
