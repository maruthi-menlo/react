import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPlayaAdminComponent } from './edit-playa-admin.component';

const routes: Routes = [
  {
    path: '',
    component: EditPlayaAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPlayaAdminRoutingModule { }
