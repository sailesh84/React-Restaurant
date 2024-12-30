import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsFeatureComponent } from './requests-feature.component';

describe('RequestsFeatureComponent', () => {
  let component: RequestsFeatureComponent;
  let fixture: ComponentFixture<RequestsFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
