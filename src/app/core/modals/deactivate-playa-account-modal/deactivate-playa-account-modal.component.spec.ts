import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivatePlayaAccountModalComponent } from './deactivate-playa-account-modal.component';

describe('DeactivatePlayaAccountModalComponent', () => {
  let component: DeactivatePlayaAccountModalComponent;
  let fixture: ComponentFixture<DeactivatePlayaAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivatePlayaAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatePlayaAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
