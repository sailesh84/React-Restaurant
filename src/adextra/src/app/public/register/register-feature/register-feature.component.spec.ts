import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFeatureComponent } from './register-feature.component';
import {FormsModule} from '@angular/forms';

describe('RegisterFeatureComponent', () => {
  let component: RegisterFeatureComponent;
  let fixture: ComponentFixture<RegisterFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterFeatureComponent ],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should valid the login form', () => {
    component.model.email = 'admin@localhost.com';
    component.model.buyerName = 'admin';
    component.model.reason = 'test';
    fixture.detectChanges();
    component.onSubmit();
    expect(component.submitted).toEqual(true);
  });

  it('should invalid the login form', () => {
    component.onSubmit();
    expect(component.submitted).toEqual(false);
  });
});
