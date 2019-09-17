import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, switchMap, take} from 'rxjs/operators';
import {AccountService} from '@ringo/accounts/services/account.service';
import {BackendError, fromHttpError, isBackendError} from '@ringo/core/models';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import * as fromAccount from '@ringo/accounts/reducers';
import {AccountApiActions, AccountPageActions} from '@ringo/accounts/actions';
import {AccountSearchResult, isAccountSearchResult} from '@ringo/accounts/models/account';

// function genericHandler<Result>(success: ActionCreator, failure: ActionCreator, isResultFn: (obj: any) => obj is Result) {
//   return pipe(
//     switchMap((response: BackendError | Result) => {
//       if (response && isBackendError(response)) {
//         return of(failure({message: response}));
//       } else if (response && isResultFn(response)) {
//         return of(success({result: response}));
//       }
//       return of(failure({message: {code: 'EBADRESP', message: 'invalid response'}}));
//     }),
//     catchError((err: HttpErrorResponse) => {
//       return of(failure({message: fromHttpError(err)}));
//     })
//   );
// }

@Injectable()
export class AccountEffects {

  search$ = createEffect(
    () => this.actions$.pipe(
      // update search if:
      //  - pagination changes
      //  - sort order changes
      //  - search terms change
      //  - an edit account request succeeds
      ofType(
        AccountPageActions.pageEvent,
        AccountPageActions.sortEvent,
        AccountPageActions.searchEvent,
        AccountApiActions.editAccountSuccess,
        AccountApiActions.createAccountSuccess,
        AccountApiActions.deleteAccountSuccess,
      ),
      // take(1) is key, otherwise the select never completes!
      switchMap(() => this.store$.pipe(select(fromAccount.selectAccountQuery), take(1))),
      exhaustMap(query => this.accountService.search(query)
        .pipe(
          switchMap((response: BackendError | AccountSearchResult) => {
            if (response && isBackendError(response)) {
              return of(AccountApiActions.accountSearchFailure({error: response}));
            } else if (response && isAccountSearchResult(response)) {
              return of(AccountApiActions.accountSearchSuccess({result: response}));
            }
            return of(AccountApiActions.accountSearchFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
          }),
          catchError((err: HttpErrorResponse) => {
            return of(AccountApiActions.accountSearchFailure({error: fromHttpError(err)}));
          })
        ))
    )
  );

  createAccount$ = createEffect(
    () => this.actions$.pipe(
      ofType(AccountPageActions.createAccount),
      exhaustMap(payload => this.accountService.updateAccount(payload.account)
        .pipe(
          switchMap((response: BackendError | null) => {
            if (response && isBackendError(response)) {
              return of(AccountApiActions.createAccountFailure({error: response}));
            }
            return of(AccountApiActions.createAccountSuccess());
          }),
          catchError((err: HttpErrorResponse) => {
            return of(AccountApiActions.createAccountFailure({error: fromHttpError(err)}));
          })
        )
      )
    )
  );

  editAccount$ = createEffect(
    () => this.actions$.pipe(
      ofType(AccountPageActions.updateAccount),
      exhaustMap(payload => this.accountService.updateAccount(payload.account)),
      switchMap((response: BackendError | null) => {
        if (response && isBackendError(response)) {
          return of(AccountApiActions.editAccountFailure({error: response}));
        }
        return of(AccountApiActions.editAccountSuccess());
      }),
      catchError((err: HttpErrorResponse) => {
        return of(AccountApiActions.editAccountFailure({error: fromHttpError(err)}));
      })
    )
  );

  deleteAccount$ = createEffect(
    () => this.actions$.pipe(
      ofType(AccountPageActions.deleteAccount),
      exhaustMap(payload => this.accountService.deleteAccount(payload.accountId)),
      switchMap((response: BackendError | null) => {
        if (response && isBackendError(response)) {
          return of(AccountApiActions.deleteAccountFailure({error: response}));
        }
        return of(AccountApiActions.deleteAccountSuccess());
      }),
      catchError((err: HttpErrorResponse) => {
        return of(AccountApiActions.deleteAccountFailure({error: fromHttpError(err)}));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private store$: Store<fromAccount.State>,
  ) {
  }
}
