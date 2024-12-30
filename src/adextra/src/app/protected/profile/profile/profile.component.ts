import { Component, OnInit } from '@angular/core';
import {TitlePageService} from '@app/core/services/title-page.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title = 'Profile';

  constructor(private titlePageService: TitlePageService) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
  }

}
