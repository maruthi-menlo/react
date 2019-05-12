import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsSelectModalComponent } from './tags-select-modal.component';

describe('TagsSelectModalComponent', () => {
  let component: TagsSelectModalComponent;
  let fixture: ComponentFixture<TagsSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
