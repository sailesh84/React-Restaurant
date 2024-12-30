import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeatureProjectProductComponent } from './dashboard-feature-project-product.component';

describe('DashboardFeatureProjectProductComponent', () => {
  let component: DashboardFeatureProjectProductComponent;
  let fixture: ComponentFixture<DashboardFeatureProjectProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFeatureProjectProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFeatureProjectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
