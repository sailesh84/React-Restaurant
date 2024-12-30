import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaFactorComponent } from './alpha-factor.component';

describe('AlphaFactorComponent', () => {
  let component: AlphaFactorComponent;
  let fixture: ComponentFixture<AlphaFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlphaFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
