import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditPlayaAdminRoutingModule } from './edit-playa-admin-routing.module';
import { EditPlayaAdminComponent } from './edit-playa-admin.component'

@NgModule({
  declarations: [EditPlayaAdminComponent],
  imports: [
    CommonModule,
    EditPlayaAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[EditPlayaAdminComponent]
})
export class EditPlayaAdminModule { }
