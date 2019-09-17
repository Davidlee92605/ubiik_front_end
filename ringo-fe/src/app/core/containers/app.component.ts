import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {LangState} from '@ringo/core/state/lang-state';
import {Router} from '@angular/router';
import {UserInfo} from '@ringo/auth/models';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@ringo/auth/reducers';
import * as fromRoot from '@ringo/reducers';
import {AuthActions} from '@ringo/auth/actions';
import {Alert} from '@ringo/alerts/models';
import {SpinnerService} from '@ringo/core/services';

@Component({
  selector: 'rng-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrapper">
      <rng-toolbar (changePassword)="onChangePassword()"
                   (logout)="onLogout()"
                   (languageChanged)="onLanguageChanged($event)"
                   [languages]="languages$ | async"
                   [userInfo]="userInfo$ | async">
      </rng-toolbar>
      <rng-sidenav *ngIf="loggedIn$ | async">
        <ng-container *ngIf="(userInfo$ | async)?.role === 'manager' || (userInfo$ | async)?.role === 'admin'">
          <!-- rng-nav-item routerLink="/" routerLinkActive="active" icon="poll">
            <span i18n="@@Home">Dashboard</span>
          </rng-nav-item>
          <rng-nav-item routerLink="/alerts" routerLinkActive="active" icon="bell">
            <span i18n="@@Alerts">Alerts</span>
            <span *ngIf="(alerts$ | async)?.length > 0" class="alert-circle">{{(alerts$ | async)?.length}}</span>
          </rng-nav-item -->
          <rng-nav-item routerLink="/meters" routerLinkActive="active" icon="eye">
            <span i18n="@@View Meters">View Meters</span>
          </rng-nav-item>
          <rng-nav-item routerLink="/load-profile" routerLinkActive="active" icon="chart-bar">
            <span i18n="@@Load Profile">Load Profile</span>
          </rng-nav-item>
          <!-- rng-nav-item *ngIf="(userInfo$ | async)?.role === 'admin'" routerLink="/user-meter" icon="clipboard-list">
            <span i18n="@@Meter Associations">Meter Associations</span>
          </rng-nav-item>
          <rng-nav-item *ngIf="(userInfo$ | async)?.role === 'admin'" routerLink="/user-meter" icon="fire-extinguisher">
            <span i18n="@@Meter Associations">Meter Groups</span>
          </rng-nav-item -->
        </ng-container>

        <rng-nav-item *ngIf="(userInfo$ | async)?.role == 'root'" routerLink="/accounts" icon="user-plus">
          <span i18n="@@Accounts">Accounts</span>
        </rng-nav-item>
        <rng-nav-item *ngIf="(userInfo$ | async)?.role == 'root'" routerLink="/meter-associations" icon="clipboard-list">
            <span i18n="@@Meter Associations">Meter Associations</span>
        </rng-nav-item>
      </rng-sidenav>
      <section>
        <router-outlet></router-outlet>
      </section>
    </div>
    <div *ngIf="spinner.enabled" class="loading">
        <div class="container">
            <div class="row">
                <div id="loader">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="loading"></div>
                </div>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: grid;
      grid-template-areas: "nav  header" "nav     content";

      grid-template-columns: 240px 1fr;
      grid-template-rows: auto 1fr;
      grid-gap: 0;

      height: 100vh;

      color: var(--widget-color);

    }

    rng-toolbar {
      grid-area: header;
    }

    rng-sidenav {
      grid-area: nav;
      background-color: #EDEDED;
    }

    section {
      grid-area: content;
    }

    *,
    /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `]
})
export class AppComponent {
  loggedIn$: Observable<boolean>;
  languages$: Observable<{ code: string; label: string }[]>;
  userInfo$: Observable<UserInfo | null>;
  alerts$: Observable<Alert[]>;

  constructor(
    private store: Store<fromRoot.State & fromAuth.State>,
    private langState: LangState,
    private router: Router,
    public spinner: SpinnerService
  ) {
    this.loggedIn$ = this.store.pipe(select(fromAuth.getLoggedIn));
    this.userInfo$ = this.store.pipe(select(fromAuth.getUserInfo));
    this.languages$ = this.langState.languages$;
    this.alerts$ = new Observable();
  }

  onChangePassword() {
    this.router.navigateByUrl('/auth/change-password');
  }

  onLogout() {
    this.store.dispatch(AuthActions.logoutConfirmation());
  }

  onLanguageChanged(lang: string) {
    this.langState.langChangedEvent$.next(lang);
  }
}
