import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsAccessesComponent } from './applications-accesses.component';

describe('ApplicationsAccessesComponent', () => {
  let component: ApplicationsAccessesComponent;
  let fixture: ComponentFixture<ApplicationsAccessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsAccessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsAccessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
