import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Credentials, PasswordChangeRequest, PasswordResetRequest} from '@ringo/auth/models';
import {debug, url} from '@ringo/shared';
import {BackendError} from '@ringo/core/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) {
  }

  login(credentials: Credentials, redirectURL: string) {
    // this.pending$.next(true);
    // this.invalidCredentials$.next(false);
    return this.http.post<BackendError | null>(url('/login'), credentials)
      .pipe(
        // finalize(() => this.pending$.next(false)),
        // catchError((err: HttpErrorResponse) => {
        //   if (err.status === 401) {
        //     this.invalidCredentials$.next(true);
        //   }
        //   console.message('auth.login', err);
        //   return throwError(err);
        // }),
        debug('auth.login.post')
      );
      // .subscribe(x => {
      //   this.router.navigateByUrl(redirectURL).then();
      // });
  }

  changePassword(req: PasswordChangeRequest): Observable<BackendError | null> {
    return this.http.post<BackendError | null>(url(`/change-password`), req)
      .pipe(
        // finalize(() => this.pending$.next(false)),
        debug('auth.changePassword.post')
      );
      // .subscribe(() => this.router.navigateByUrl('/auth/password-changed'));
  }

  sendLostPasswordEmail(email: string) {
    return this.http.post<BackendError>(url(`/lost-password`), {email: email})
      .pipe(
        debug('auth.sendLostPasswordEmail.post')
      );
  }

  lostPasswordReset(value: PasswordResetRequest) {
    return this.http.post<BackendError>(url(`/lost-password-reset`), value)
      .pipe(
        // finalize(() => this.pending$.next(false)),
        debug('auth.lostPasswordReset.post')
      );
      // .subscribe(() => this.router.navigateByUrl('/auth/password-changed'));
  }
}
