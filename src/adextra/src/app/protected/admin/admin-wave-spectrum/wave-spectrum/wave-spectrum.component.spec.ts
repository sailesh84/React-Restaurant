import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WebSpectrumComponent } from './wave-spectrum.component';

describe('WebSpectrumComponent', () => {
  let component: WebSpectrumComponent;
  let fixture: ComponentFixture<WebSpectrumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebSpectrumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSpectrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
