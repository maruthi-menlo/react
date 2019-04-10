import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateEditUserComponent } from './deactivate-edit-user.component';

describe('DeactivateEditUserComponent', () => {
  let component: DeactivateEditUserComponent;
  let fixture: ComponentFixture<DeactivateEditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateEditUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
