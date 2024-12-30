import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { Login } from '@app/shared/models/login';
import { ActivatedRoute, Router } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '@app/core/services/users.service';
import { Subject } from 'rxjs';
import { ReCaptcha2Component } from 'ngx-captcha';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { HttpClient } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';


@Component({
  selector: 'app-login-feature',
  templateUrl: './login-feature.component.html',
  styleUrls: ['./login-feature.component.scss']
})
export class LoginFeatureComponent implements OnInit, OnDestroy {

  emailReset = '';
  typeModal = 'success';
  closeModal = false;
  submitted = false;
  messageModal = null;
  returnUrl: string;
  model: Login = { username: '', password: '', type: 'internal', captcha: '' };
  theme: string;
  size: string;
  type: string;
  isDisabledBtn: boolean;
  currentRoute: string;
  siteKey: string;
  isIframe = false;
  loggedIn = false;
  profile = null;

  @ViewChild('modalResetPassword', { static: true }) modalResetPassword: ElementRef;
  @ViewChild('captchaElem', { static: true }) captchaElem: ReCaptcha2Component;

  private isUserDead$ = new Subject();
  private isAuthDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private authServiceBackEnd: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private userService: UsersService,
    private broadcastService: BroadcastService, 
    private authService: MsalService
  ) {
    this.isDisabledBtn = false;
    this.theme = "light";
    this.size = "normal";
    this.type = "image";
    const isLogged = this.authServiceBackEnd.isLogged;
    if (isLogged === true) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.currentRoute = window.location.hostname;
    if (this.currentRoute === "infieldportal-qa.lab.technipfmc.com") { // QA server
      // this.siteKey = "6LeUmy4iAAAAAJROWx0mycZtmTcTEBONAD27peCN"; //qa-apps
      this.siteKey = "6LcgBBcpAAAAAAIsXQIwYSJwXutAgqtLXq3Xt6tp"; //qa-labs
    } else if (this.currentRoute === "infieldportal-uat.lab.technipfmc.com") { // UAT Server
      this.siteKey = "6LcDUp0iAAAAAKRt7g8cuUqfVY8dsR9fP8unFwbX";
    } else if (this.currentRoute === "infieldportal.apps.technipfmc.com") { // Prod Server
      this.siteKey = "6LfI758iAAAAAJZ23cDCNxMyVJStDJ63cr592YFa";
    } else { // Localhost
      this.siteKey = "6LfCKxkiAAAAADVEDgmVK7V_RCrPwyIhFUukrS-b";
    }

    this.isIframe = window !== window.parent && !window.opener;

    this.checkAccountLogin();

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      this.toastrService.warning(message)
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));

  }

  checkoutAccount() {
    var accountLoggedIn = this.authService.getAccount();

    if(accountLoggedIn)
    {
      this.authServiceBackEnd.login(accountLoggedIn).subscribe(response => {
        if (response && response.success === true) {
          this.router.navigate(['/']);
        }
      });

     
    }
  }

  checkAccountLogin(){
    var accountLoggedIn = this.authService.getAccount();

    if(accountLoggedIn && this.authServiceBackEnd.isLogged)
    {
      this.router.navigate(['/']);
    }
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }
  }

  logout() {
    this.authService.logout();
  }

  handleSuccess(data) {
    // console.log(data);
  }

  reset(): void {
    this.captchaElem.resetCaptcha();
  }

  onSubmit() {
    this.submitted = true;
  }

  onCancel() {
    this.submitted = false;
    this.model.username = "";
    this.model.password = "";
    this.isDisabledBtn = false;
    this.captchaElem.reloadCaptcha();
  }

  showResetPasswordModal() {
    this.modalService.open(this.modalResetPassword, { centered: true, size: 'lg', backdrop: 'static' });
  }

  resetPassword(modal: NgbActiveModal) {
    // save in db
    if (this.emailReset !== '' || this.emailReset !== null || this.emailReset !== undefined) {
      this.userService.sendEmailResetPassword(this.emailReset).pipe(takeUntil(this.isUserDead$)).subscribe((response) => {
        this.emailReset = '';
        if (response.success === true) {
          this.typeModal = 'success';
          this.closeModal = false;
          this.messageModal = `<strong>Success !</strong> A new password has been sent to '${response.data}.'`;
          setTimeout(() => {
            this.typeModal = 'success';
            this.closeModal = true;
            modal.close('Close click');
            this.messageModal = null;
          }, 2000);
        } else {
          this.typeModal = 'warning';
          this.closeModal = true;
          this.messageModal = `<strong>Warning !</strong> Try with another email because '${response.data}' didn't match with any account.`;
        }
      }, (error) => {
        this.emailReset = '';
        this.typeModal = 'warning';
        this.closeModal = true;
        this.messageModal = 'An error occurred on the server side.';
      });
    } else {
      this.emailReset = '';
      this.typeModal = 'warning';
      this.closeModal = true;
      this.messageModal = 'Please complete the field.';
    }
  }

  ngOnDestroy() {
    this.isUserDead$.next();
    this.isAuthDead$.next();
  }
}
