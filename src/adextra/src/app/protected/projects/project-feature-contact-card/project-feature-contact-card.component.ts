import {Component, Input, OnInit} from '@angular/core';
import {User} from '@app/shared/models/user';

@Component({
  selector: 'app-project-feature-contact-card',
  templateUrl: './project-feature-contact-card.component.html',
  styleUrls: ['./project-feature-contact-card.component.scss']
})
export class ProjectFeatureContactCardComponent implements OnInit {
  @Input() contact: User;

  constructor() { }

  ngOnInit() {
  }

}
