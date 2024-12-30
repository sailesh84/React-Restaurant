import {EventEmitter, Injectable} from '@angular/core';
import {User} from '@app/shared/models/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {share} from 'rxjs/operators';

/**
 * This service is used to keep in memory the current user.
 */
@Injectable()
export class UserSharingService {
  /**
   * Observable User source
   */
  private userSubject: BehaviorSubject<User>;

  /**
   * Observable User stream
   */
  public user: Observable<User>;
  toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor
   */
  constructor() {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable().pipe(share());
  }

  /**
   * This method is a getter for getting the current user in memory.
   */
  public get currentUser(): User {
    return this.userSubject.value;
  }

  /**
   * This method allows to update the current user in memory.
   * The parameter `user` is the value of the new user to keep in memory.
   */
  public updateUser(user: User): void {
    if (user) {
      if (user.image === null || user.image === undefined || user.image === '') {
        user.image = 'https://avatars.dicebear.com/v2/initials/user.svg';
      }
    }
    this.userSubject.next(user);
  }

  public sendSidebarToggledStatus(data: boolean): void {
    this.toggleSidebar.emit(data);
  }

}
