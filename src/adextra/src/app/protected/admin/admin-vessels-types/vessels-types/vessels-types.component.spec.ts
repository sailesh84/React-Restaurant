import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselsTypesComponent } from './vessels-types.component';

describe('VesselTypesComponent', () => {
  let component: VesselsTypesComponent;
  let fixture: ComponentFixture<VesselsTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselsTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
