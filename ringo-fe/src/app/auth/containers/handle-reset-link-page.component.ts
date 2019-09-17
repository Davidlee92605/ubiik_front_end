import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@ringo/auth/reducers';
import {HandleResetLinkPageActions} from '@ringo/auth/actions';
import {PasswordResetRequest} from '@ringo/auth/models';
import {takeUntilDestroyed} from '@ringo/shared';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'rng-handle-password-reset-page',
  template: `
    <rng-handle-password-reset-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [genericError]="genericError$ | async"
      [failedComplexity]="failedComplexity$ | async"
    >
    </rng-handle-password-reset-form>
  `,
  styles: []
})
export class HandleResetLinkPageComponent implements OnInit, OnDestroy {

  pending$ = this.store.pipe(select(fromAuth.getHandleResetLinkPagePending));
  failedComplexity$ = new BehaviorSubject<boolean>(false);
  genericError$ = new BehaviorSubject<boolean>(false);
  private token = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromAuth.State>
  ) {
    this.store.pipe(
      select(fromAuth.getHandleResetLinkPageError),
      map(e => {
        console.log('getHandleResetLinkPageError', e);
        if (e) {
          switch (e.code) {
            case 'ECOMPLEX':
              this.failedComplexity$.next(true);
              break;
            default:
              this.genericError$.next(true);
              break;
          }
        }
      }),
      takeUntilDestroyed(this)
    )
      .subscribe();
  }

  ngOnInit() {
    this.route.queryParamMap
      .pipe(take(1))
      .subscribe((m: ParamMap) => {
        this.token = m.get('token') || '';
      });
  }

  ngOnDestroy(): void {
  }

  onSubmit(password: string) {
    const request: PasswordResetRequest = {password: password, token: this.token};
    this.store.dispatch(HandleResetLinkPageActions.resetLostPassword({request}));
  }
}
