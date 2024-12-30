import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectID = '-1';
  vesselID = '-1';
  projectTypeID = '-1';
  productName = '-1';
  contactID = '-1';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private ngZone: NgZone) {
    this.activatedRoute.params.subscribe(params => {
      if (params.pr && params.ve && params.pt && params.pn && params.contact) {
        this.projectID = params.pr;
        this.vesselID = params.ve;
        this.projectTypeID = params.pt;
        this.productName = params.pn;
        this.contactID = params.contact;
      } else {
        this.ngZone.run(() => this.router.navigate(['/not-found']));
      }
    });
  }

  ngOnInit() {
  }

}
