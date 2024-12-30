import { Component, OnInit } from '@angular/core';
import {TitlePageService} from '@app/core/services/title-page.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';

  constructor(private titlePageService: TitlePageService) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
  }

}
