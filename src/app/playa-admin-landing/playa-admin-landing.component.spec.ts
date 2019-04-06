import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayaAdminLandingComponent } from './playa-admin-landing.component';

describe('PlayaAdminLandingComponent', () => {
  let component: PlayaAdminLandingComponent;
  let fixture: ComponentFixture<PlayaAdminLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayaAdminLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayaAdminLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
