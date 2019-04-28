import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureSubscriptionsComponent } from './azure-subscriptions.component';

describe('AzureSubscriptionsComponent', () => {
  let component: AzureSubscriptionsComponent;
  let fixture: ComponentFixture<AzureSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AzureSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AzureSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
