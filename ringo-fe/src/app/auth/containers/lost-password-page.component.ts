import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@ringo/auth/reducers';
import {LostPasswordPageActions} from '@ringo/auth/actions';

@Component({
  selector: 'rng-lost-password-page',
  template: `
    <rng-lost-password-form
      [pending]="pending$ | async"
      [invalidCredentials]="invalidCredentials$ | async"
      (submitted)="onSubmit($event)"></rng-lost-password-form>
  `,
  styles: [`
    .back-link {
      padding-bottom: 2rem;
      margin: 0 2rem;
      text-align: right;
    }
  `]
})
export class LostPasswordPageComponent implements OnInit {
  pending$ = this.store.pipe(select(fromAuth.getLostPasswordPagePending));
  invalidCredentials$ = this.store.pipe(select(fromAuth.getLostPasswordPageError));

  constructor(
    private store: Store<fromAuth.State>
  ) {
  }

  ngOnInit() {
  }

  onSubmit(email: string) {
    this.store.dispatch(LostPasswordPageActions.lostPasswordReset({email}));
  }
}
