import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsRoutingModule } from './tags-routing.module';
import { FormsModule } from '@angular/forms';
import { TagsComponent } from './tags.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [TagsComponent],
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    FormsModule,
    TagsRoutingModule
  ],
  exports: [TagsComponent]
})
export class TagsModule { }
