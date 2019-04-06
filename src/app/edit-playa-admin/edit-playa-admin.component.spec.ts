import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlayaAdminComponent } from './edit-playa-admin.component';

describe('EditPlayaAdminComponent', () => {
  let component: EditPlayaAdminComponent;
  let fixture: ComponentFixture<EditPlayaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlayaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlayaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
