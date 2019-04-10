import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDatepickerModule, NgbDatepickerConfig, NgbAlertModule, NgbDateParserFormatter, NgbDateAdapter, NgbTimepicker, NgbTimepickerModule, NgbPopoverModule, NgbTooltipModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from '../core/loader/loader.component';
import { CustomerService } from './services/customer.service';
import {GetJsonService} from './services/json.service';
import {PercentPipe} from './pipes/percent.pipe';

@NgModule({
  declarations: [LoaderComponent,PercentPipe],
  imports: [
    CommonModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbPopoverModule
  ],
  providers: [
    LoaderService,
    CustomerService,
    GetJsonService
  ],
  exports: [
    LoaderComponent,
    NgbPopoverModule]
})
export class SharedModule { }
