import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { UsersService } from '@app/core/services/users.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  // Feedback Variables
  isPageTitleDisabled: boolean = true;
  feedbackFrm = { feedbackMessage: null, feedbackFileUpload: [], feedbackPageUrl: null };
  feedbackCategory: string = "";
  isUrlActive: string;
  isFeedbackDefaultValueVisible: boolean = true;
  isReportABugActive: boolean = false;
  isRequestAFeatureActive: boolean = false;
  isShareMyThoughtsActive: boolean = false;
  emojiText: string = "N";
  lblFeedback: string = "";
  feedbackPlaceholder: string = "";
  filePlaceholder: string = "Select your file!";
  isDisabledButton: boolean = true;
  isHiddenFeedbackBody: boolean = false;
  isHiddenThankyouBody: boolean = true;
  bugOccuredNameList = ['This Page', 'Another Page'];
  selectedbugOccuredNameList = {option: 'This Page'};

  @ViewChild('modalFeedback', { static: true }) modalFeedback: ElementRef;
  private isUserDead$ = new Subject();
  constructor(private router: Router, private modalService: NgbModal, private userSharingService: UserSharingService, private usersService: UsersService) {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
            // Show loading indicator
        }
    
        if (event instanceof NavigationEnd) {
            // Hide loading indicator
            this.feedbackFrm.feedbackPageUrl = location.hostname + this.router.url;
        }
    
        if (event instanceof NavigationError) {
            // Hide loading indicator
    
            // Present error to user
            console.log(event.error);
        }
    });
  }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
  }

  // Feedback Functions Start
  openF() {
    this.modalService.open(this.modalFeedback, { centered: false, size: 'lg', backdrop: 'static', scrollable: true, windowClass: 'modal-side' });
  }

  changeReportForBug(event, status) {
    this.clearFeedbackfrm();
    this.feedbackCategory = status;
    this.feedbackFrm.feedbackPageUrl = location.hostname + this.router.url;
    this.isUrlActive = "Y";
    this.isFeedbackDefaultValueVisible = false;
    this.isReportABugActive = true;
    this.isRequestAFeatureActive = false;
    this.isShareMyThoughtsActive = false;
    this.emojiText = "N";
    this.lblFeedback = "This is what happened";
    this.feedbackPlaceholder = "Clearly describe the problems and the steps you took that led to it";
  }

  changeReqAFeature(event, status) {
    this.clearFeedbackfrm();
    this.feedbackCategory = status;
    this.isUrlActive = "N";
    this.isFeedbackDefaultValueVisible = false;
    this.isReportABugActive = false;
    this.isRequestAFeatureActive = true;
    this.isShareMyThoughtsActive = false;
    this.emojiText = "N";
    this.feedbackFrm.feedbackPageUrl = location.hostname + "/";
    this.lblFeedback = "The Feature i'd like is";
    this.feedbackPlaceholder = "Describe the feature and why it would help";
  }

  changeShareMyThoughts(event, status) {
    this.clearFeedbackfrm();
    this.feedbackCategory = status;
    this.isUrlActive = "N";
    this.isFeedbackDefaultValueVisible = false;
    this.isReportABugActive = false;
    this.isRequestAFeatureActive = false;
    this.isShareMyThoughtsActive = true;
    this.feedbackFrm.feedbackPageUrl = location.hostname + "/";
    this.lblFeedback = "My views on the app are";
    this.feedbackPlaceholder = "Let us know what you like, or don't like and why";
  }

  changeFeedbackMessage(event) {
    if (event.length <= 0) {
      this.isDisabledButton = true;
    }
    else {
      this.isDisabledButton = false;
    }
  }

  fileSelect(event) {
    const fileType = event.target.files[0].type;
    if(fileType === "image/png" || fileType === "image/jpeg"){
      this.filePlaceholder = event.target.files[0].name;
      this.feedbackFrm.feedbackFileUpload = [];
      if (event.target.files) {
        for (var i = 0; i < event.target.files.length; i++) {
          this.feedbackFrm.feedbackFileUpload.push(event.target.files[i]);
        }
      }
  
      this.feedbackFrm.feedbackFileUpload.forEach((element) => {
        var reader = new FileReader();
        reader.readAsDataURL(element);
        reader.onload = (_event) => {
          element.imageName = reader.result;
        };
      });
    } else {
      this.filePlaceholder = "Invalid File!.";
    }
  }

  changebugOccList(event) {
    const strWhtValue = event.target.value;
    if (strWhtValue === "Another Page") {
      this.isPageTitleDisabled = false;
      this.feedbackFrm.feedbackPageUrl = null;
    }
    else {
      this.isPageTitleDisabled = true;
      this.feedbackFrm.feedbackPageUrl = location.hostname + this.router.url;
    }
  }

  emojiTerrible(event, status) {
    this.emojiText = status;
  }

  verifyFeedback(): [string, boolean] {
    const excludes = ['feedbackPageUrl'];
    for (const prop in this.feedbackFrm) {
      if ((excludes.includes(prop) === false) && (this.feedbackFrm[prop] === null)) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  saveFeedback(modal: NgbActiveModal) {

    let fieldToValidate = this.verifyFeedback();
    if (fieldToValidate[0] === "noFieldToValidate") {

      this.isDisabledButton = false;
      const user = this.userSharingService.currentUser;
      const feedbackObj = {
        from: user.email,
        message: "<b>" + this.lblFeedback + "</b> - " + this.feedbackFrm.feedbackMessage,
        subject: this.feedbackCategory,
        emoji: this.emojiText,
        attach: this.feedbackFrm.feedbackFileUpload,
        isUrl: this.isUrlActive,
        url: this.feedbackFrm.feedbackPageUrl
      }

      this.usersService.sendFeedback(feedbackObj).pipe(takeUntil(this.isUserDead$)).subscribe((response) => {
        if (response.success == true) {
          this.isHiddenFeedbackBody = true;
          this.isHiddenThankyouBody = false;
          this.clearFeedbackfrm();
        }
      });

    }
    else {
      this.isDisabledButton = true;
    }
  }

  clearFeedbackfrm() {
    this.feedbackFrm = { feedbackMessage: null, feedbackFileUpload: [], feedbackPageUrl: null };
    this.filePlaceholder = "Select your file!";
    this.feedbackFrm.feedbackFileUpload = [];
    this.emojiText = "N";
    this.isDisabledButton = true;
    this.feedbackFrm.feedbackPageUrl = location.hostname + this.router.url;
    if (this.isReportABugActive == true) {
      this.isUrlActive = "Y";
    }
    else {
      this.isUrlActive = "N";
    }
  }

}
