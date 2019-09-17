import { Component, OnInit } from '@angular/core';
import {PasswordChangeRequest} from '@ringo/auth/models';
import * as fromAuth from '@ringo/auth/reducers';
import {select, Store} from '@ngrx/store';
import {ChangePasswordPageActions} from '@ringo/auth/actions';
import {map} from 'rxjs/operators';

@Component({
  selector: 'rng-change-password-page',
  template: `
    <rng-change-password-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [invalidCredentials]="invalidCredentials$ | async"
      [failedComplexity]="failedComplexity$ | async">
    </rng-change-password-form>
  `,
  styles: []
})
export class ChangePasswordPageComponent implements OnInit {
  pending$ = this.store.pipe(select(fromAuth.getChangePasswordPagePending));
  invalidCredentials$ = this.store.pipe(select(fromAuth.getChangePasswordPageError), map(e => e && e.code === 'EMISMATCH'));
  failedComplexity$ = this.store.pipe(select(fromAuth.getChangePasswordPageError), map(e => e && e.code === 'ECOMPLEX'));


  constructor(
    private store: Store<fromAuth.State>
  ) { }

  ngOnInit() {
  }

  onSubmit(request: PasswordChangeRequest) {
    this.store.dispatch(ChangePasswordPageActions.changePassword({request}));
  }
}
