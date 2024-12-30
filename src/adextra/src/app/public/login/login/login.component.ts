import { Component, OnInit } from '@angular/core';
import {routerTransition} from '@app/shared/animations/router.animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
