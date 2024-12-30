import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelFeatureComponent } from './admin-panel-feature.component';

describe('AdminPanelFeatureComponent', () => {
  let component: AdminPanelFeatureComponent;
  let fixture: ComponentFixture<AdminPanelFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
