import { Component, OnInit } from '@angular/core';
import {TitlePageService} from '@app/core/services/title-page.service';

@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.scss']
})
export class DownloadCenterComponent implements OnInit {
  title = 'Download Center';

  isCollapsePanels = [true, true, true];
  expandIcons = ['expand_more', 'expand_more', 'expand_more'];

  constructor(private titlePageService: TitlePageService) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
  }

  collapsePanel(panel: number) {
    this.isCollapsePanels[panel] = !this.isCollapsePanels[panel];
    if (this.isCollapsePanels[panel]) {
      this.expandIcons[panel] = 'expand_more';
    } else {
      this.expandIcons[panel] = 'expand_less';
    }
  }
}
