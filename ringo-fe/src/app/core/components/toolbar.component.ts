import {Component, Output, EventEmitter, Input} from '@angular/core';
import {UserInfo} from '@ringo/auth/models';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@ringo/auth/reducers';
import * as fromRoot from '@ringo/reducers';
import {Observable} from 'rxjs';


@Component({
  selector: 'rng-toolbar',
  template: `
    <header class="top">
      <div class="logo" *ngIf="loggedIn$ | async">
        <h1><a class="header" i18n="@@Ubiik Power Meter Management System" routerLink="/">
          <img src="assets/ringo-logo.jpg" alt="logo">
        </a></h1>
      </div>
      <div class="right-container">
        <div class="account-container">
          <div class="account-role">{{userInfo?.role | titlecase}}</div>
          <div class="account-name">{{userInfo?.name | titlecase}}</div>
        </div>
        <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-btn"
                i18n-title="@@Edit account" title="Edit account">
          <fa-icon id="user" icon="user-circle"></fa-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button *ngIf="loggedIn$ | async" mat-menu-item (click)="changePw()" i18n="@@Change Password">
            <fa-icon icon="lock"></fa-icon>
            Change Password
          </button>
          <button mat-menu-item i18n="@@Change Language" [matMenuTriggerFor]="langMenu">
            <fa-icon icon="globe"></fa-icon>
            Change Language
          </button>
          <button *ngIf="loggedIn$ | async" mat-menu-item (click)="userLogout()" i18n="@@Logout">
            <fa-icon icon="power-off"></fa-icon>
            Logout
          </button>
        </mat-menu>
        <mat-menu #langMenu="matMenu">
          <button *ngFor="let l of languages" mat-menu-item (click)="setLanguage(l.code)">{{l.label}}</button>
        </mat-menu>
        </div>
    </header>
  `,
  styles: [`
    .top {
      grid-area: header;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      height: 4rem;
      background-color: #F5F5F5;
      z-index: 1;
    }

    h1 a {
      font-size: 1rem;
      color: var(--header-color);
      text-transform: none;
      padding-left: 1rem;
    }

    img {
      position: relative;
    }

    .menu-btn {
      font-size: 2.2rem !important;
    }

    #user {
      position: relative;
      bottom: 0.3rem;
    }

    .logo {
      grid-column-start: 2;
      grid-column-end: 2;
      justify-self: center;
    }

    .right-container {
      justify-self: end;
      grid-column-start: 3;
      margin: 0.5rem;
    }

    .account-container {
      text-align: right;
      float: left;
      margin-right: 0.5rem;
    }

    .account-role {
      font-size: 0.75rem;
    }

    .account-name {
      font-size: 1rem;
      color: #31345B;
    }
  `]
})
export class ToolbarComponent {
  @Output() logout = new EventEmitter();
  @Output() changePassword = new EventEmitter();
  @Output() languageChanged = new EventEmitter<string>();

  @Input() userInfo: UserInfo | undefined;
  @Input() languages: {code: string, label: string}[] = [];

  loggedIn$: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State & fromAuth.State>,
  ) {
    this.loggedIn$ = this.store.pipe(select(fromAuth.getLoggedIn));
  }

  changePw() {
    this.changePassword.emit();
  }

  userLogout() {
    this.logout.emit();
  }

  setLanguage(code: string) {
    this.languageChanged.emit(code);
  }
}
