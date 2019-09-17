import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, first, map, mergeMap} from 'rxjs/operators';
import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@ringo/auth/reducers';
import {AuthActions, AuthApiActions} from '@ringo/auth/actions';

/*
Intercept responses and display login dialog when we get a 401.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<fromAuth.State>,
    private zone: NgZone,
    private snackBar: MatSnackBar
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.addToken(request).pipe(
      mergeMap( requestWithToken => next.handle(requestWithToken).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('isResponse', event);
          const token = event.headers.get('Authorization');
          if (token) {
            const arr = token.split(' ');
            // console.log('token', arr[1]);
            this.store.dispatch(AuthApiActions.recievedToken({ token: arr[1] }));
          }
        }
        return event;
      }),
      catchError(event => {
        console.log('isErrorResponse', event);
        if (event.status === 401) {
          // could be the token has expired, clear it out
          this.store.dispatch(AuthActions.logout());
        } else {
          this.zone.run(() => {
            let msg = '.';
            if (typeof event.backend === 'string') {
              msg = ': ' + event.backend.charAt(0).toLocaleUpperCase() + event.backend.slice(1);
            }
            this.snackBar.open('Oops! Something went wrong with that last request' + msg, 'Dismiss', {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          });
        }
        return throwError(event);
      })
    )));
  }

  /**
   * Adds the JWT token to the request's header.
   */
  private addToken(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    // NOTE: DO NOT try to immediately setup this selector in the constructor or as an assignment in a
    // class member variable as there's no stores available when this interceptor fires fires up and
    // as a result it'll throw a runtime message.
    return this.store.pipe(
      select(fromAuth.getToken),
      first(),
      mergeMap((token: string | null) => {
        if (token) {
          request = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`),
            withCredentials: true
          });
        }
        return of(request);
      })
    );
  }
}
