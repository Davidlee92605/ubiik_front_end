import {Component, OnDestroy, OnInit} from '@angular/core';
import {Credentials} from '@ringo/auth/models';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {take} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@ringo/auth/reducers';
import {LoginPageActions} from '@ringo/auth/actions';
import {BehaviorSubject} from 'rxjs';
import {debug} from '@ringo/shared';


@Component({
  selector: 'rng-login-page',
  template: `
    <rng-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [error]="error$ | async"
    ></rng-login-form>
  `,
  styles: []
})
export class LoginPageComponent implements OnInit, OnDestroy {
  error$ = this.store.pipe(select(fromAuth.getLoginPageError));
  pending$ = this.store.pipe(
    debug('getLoginPagePending'),
    select(fromAuth.getLoginPagePending)
  );
  invalidCredentials$ = new BehaviorSubject<boolean>(false);
  genericError$ = new BehaviorSubject<boolean>(false);
  private redirectURL = '/';

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromAuth.State>
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap
      .pipe(take(1))
      .subscribe((m: ParamMap) => {
        this.redirectURL = m.get('redirectURL') || '/';
        this.redirectURL = decodeURI(this.redirectURL);
      });
  }

  onSubmit(credentials: Credentials) {
    this.store.dispatch(LoginPageActions.login({credentials, redirectURL: this.redirectURL}));
  }

  ngOnDestroy(): void {
  }
}
