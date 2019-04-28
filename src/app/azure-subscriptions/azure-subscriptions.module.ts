import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AzureSubscriptionsComponent } from './azure-subscriptions.component';
import { AzureSubscriptionsRoutingModule } from './azure-subscriptions-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AzureSubscriptionsComponent],
  imports: [
    CommonModule,
    AzureSubscriptionsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AzureSubscriptionsModule { }
