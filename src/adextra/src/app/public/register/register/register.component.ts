import { Component, OnInit } from '@angular/core';
import {routerTransition} from '@app/shared/animations/router.animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [routerTransition()]
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
