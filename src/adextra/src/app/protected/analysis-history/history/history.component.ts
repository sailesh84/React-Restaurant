import { Component, OnInit } from '@angular/core';
import {TitlePageService} from '@app/core/services/title-page.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  title = 'Field Analysis History';

  constructor(private titlePageService: TitlePageService) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
  }

}
