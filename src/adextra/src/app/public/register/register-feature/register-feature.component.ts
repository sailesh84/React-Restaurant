import {Component, OnDestroy, OnInit} from '@angular/core';
import {Request} from '@app/shared/models/request';
import {RequestsService} from '@app/core/services/requests.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-register-feature',
  templateUrl: './register-feature.component.html',
  styleUrls: ['./register-feature.component.scss']
})
export class RegisterFeatureComponent implements OnInit, OnDestroy {
  submitted = false;
  typeModal = 'success';

  errorForm = false;
  errorMessageForm = null;

  private isDead$ = new Subject();

  // model = new Register({ id: -1,  email: '', buyerName: '', reason: '', requestDate: 0});
  model: Request = { _id: '-1', email: '', buyerName: '', reason: '', type: 0, createdAt: 0, closedAt: 0, status: 0, managedBy: []};

  constructor(private requestsService: RequestsService) { }

  ngOnInit() {
  }

  verifyRequest() {
    for (const prop in this.model) {
      if (prop !== '_id' && (this.model[prop] === undefined || this.model[prop] === null || this.model[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  ngOnDestroy() {
    this.isDead$.next();
  }


  onSubmit() {
    this.submitted = true;
    this.errorForm = false;
    this.errorMessageForm = '';
    if (this.verifyRequest() === true) {
      this.model.createdAt = Date.now();
      this.requestsService.addRequest(this.model).pipe(takeUntil(this.isDead$)).subscribe(response => {
        this.typeModal = 'success';
        this.errorForm = true;
        this.errorMessageForm = 'Success';
        this.model = response.data;
        this.submitted = false;
      }, (error) => {
        this.submitted = false;
        this.typeModal = 'warning';
        this.errorForm = true;
        this.errorMessageForm = 'An error occurred on the server side.';
      });
    } else {
      this.submitted = false;
      this.typeModal = 'warning';
      this.errorForm = true;
      this.errorMessageForm = 'Please complete all projects.';
    }
  }

}
