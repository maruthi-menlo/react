import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CustomersViewRoutingModule } from './customers-view-routing.module';
import { CustomersViewComponent } from './customers-view.component';

@NgModule({
  declarations: [CustomersViewComponent],
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    CustomersViewRoutingModule
  ],
  exports: [CustomersViewComponent]
})
export class CustomersViewModule { }
