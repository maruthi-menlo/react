import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditPlayaAdminRoutingModule } from './edit-playa-admin-routing.module';
import { EditPlayaAdminComponent } from './edit-playa-admin.component'

@NgModule({
  declarations: [EditPlayaAdminComponent],
  imports: [
    CommonModule,
    EditPlayaAdminRoutingModule
  ],
  exports:[EditPlayaAdminComponent]
})
export class EditPlayaAdminModule { }
