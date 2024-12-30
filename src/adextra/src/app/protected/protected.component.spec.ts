import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedComponent } from './protected.component';
import {NavbarComponent} from '@app/shared/components/navbar/navbar.component';
import {SidebarComponent} from '@app/shared/components/sidebar/sidebar.component';
import {FooterComponent} from '@app/shared/components/footer/footer.component';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';

describe('PublicComponent', () => {
  let component: ProtectedComponent;
  let fixture: ComponentFixture<ProtectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, RouterModule
      ],
      declarations: [ ProtectedComponent, NavbarComponent, SidebarComponent, FooterComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
