import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map, switchMap, tap} from 'rxjs/operators';
import {
  AuthActions,
  AuthApiActions,
  ChangePasswordPageActions,
  HandleResetLinkPageActions,
  LoginPageActions,
  LostPasswordPageActions
} from '@ringo/auth/actions';
import {Credentials} from '@ringo/auth/models';
import {AuthService} from '@ringo/auth/services';
import {UserActions} from '@ringo/core/actions';
import {ConfirmLogoutDialogComponent} from '@ringo/auth/components/confirm-logout-dialog.component';
import {HttpErrorResponse} from '@angular/common/http';
import {BackendError, fromHttpError, isBackendError, str2role} from '@ringo/core/models';
import * as jwt_decode from 'jwt-decode';


@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginPageActions.login),
      exhaustMap((action: {credentials: Credentials, redirectURL: string}) =>
        this.authService.login(action.credentials, action.redirectURL)
          .pipe(
            switchMap((response: BackendError | null) => {
              if (response && isBackendError(response)) {
                return of(AuthApiActions.loginFailure({error: response}));
              }
              return of(AuthApiActions.loginSuccess());
            }),
            catchError((err: HttpErrorResponse) => {
              return of(AuthApiActions.loginFailure({error: fromHttpError(err)}));
            })
          )
      )
    )
  );

  receivedToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthApiActions.recievedToken),
      map(action => action.token),
      exhaustMap(token => {
        // ugh, had to copy paste here, parseToken() isn't available this early for some reason
        const decoded: {id: number; name: string; email: string; role: string; exp: number} = jwt_decode(token);
        const userInfo = {...decoded, role: str2role(decoded.role)};
        localStorage.setItem('uh-token', token);
        console.log('receivedToken:', userInfo);
        // TODO: do something with exp, e.g. set logout timer
        return of(AuthApiActions.parsedUserInfo({userInfo}));
      })
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.loginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.loginRedirect, AuthActions.logout),
        tap(action => {
          if (action && action.hasOwnProperty('redirectURL')) {
            this.router.navigate(['/login'], { queryParams: action });
          } else {
            this.router.navigate(['/login']);
          }
        })
      ),
    { dispatch: false }
  );

  logoutConfirmation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutConfirmation),
      exhaustMap(() => {
        const dialogRef = this.dialog.open<
          ConfirmLogoutDialogComponent,
          undefined,
          boolean
        >(ConfirmLogoutDialogComponent);

        return dialogRef.afterClosed();
      }),
      map(
        result =>
          result
            ? AuthActions.logout()
            : AuthActions.logoutConfirmationDismiss()
      )
    )
  );

  logoutIdleUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.idleTimeout),
      map(() => AuthActions.logout())
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(
        () => {
          localStorage.removeItem('uh-token');
          // window.location.assign('/');
        }
      )
    ),
    {dispatch: false}
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangePasswordPageActions.changePassword),
      map(action => action.request),
      exhaustMap(request =>
        this.authService.changePassword(request)
          .pipe(
            switchMap((response: BackendError | null) =>
              response && response.code
                ? of(AuthApiActions.changePasswordFailure({error: response}))
                : of(AuthApiActions.changePasswordSuccess())),
            catchError((err: HttpErrorResponse) => {
              return of(AuthApiActions.changePasswordFailure({error: fromHttpError(err)}));
            }),
          )
      )
    )
  );

  lostPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LostPasswordPageActions.lostPasswordReset),
      exhaustMap(action =>
        this.authService.sendLostPasswordEmail(action.email)
          .pipe(
            switchMap((response: BackendError | null) =>
              response && response.message
                ? of(AuthApiActions.lostPasswordFailure({error: response}))
                : of(AuthApiActions.lostPasswordSuccess())),
            catchError((err: HttpErrorResponse) => {
              console.log('AuthEffects.lostPassword$ message', err);
              return of(AuthApiActions.lostPasswordFailure({error: fromHttpError(err)}));
            }),
          )
      )
    )
  );

  lostPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.lostPasswordSuccess),
        tap(() => this.router.navigate(['/auth/lost-password-link-sent']))
      ),
    { dispatch: false }
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HandleResetLinkPageActions.resetLostPassword),
      map(action => action.request),
      exhaustMap(request =>
        this.authService.lostPasswordReset(request)
          .pipe(
            switchMap((response: BackendError | null) =>
              response && response.message
                ? of(AuthApiActions.resetPasswordFailure({error: response}))
                : of(AuthApiActions.resetPasswordSuccess())),
            catchError((err: HttpErrorResponse) => {
              console.log('AuthEffects.resetPassword$ message', err);
              return of(AuthApiActions.resetPasswordFailure({error: fromHttpError(err)}));
            }),
          )
      )
    )
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.resetPasswordSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}
}
