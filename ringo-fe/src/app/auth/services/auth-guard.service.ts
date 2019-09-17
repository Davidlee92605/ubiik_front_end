import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {combineLatest, from, Observable, of} from 'rxjs';
import * as fromAuth from '@ringo/auth/reducers';
import {Store} from '@ngrx/store';
import {AuthApiActions} from '@ringo/auth/actions';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromAuth.State>,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return combineLatest([
      this.store.select(fromAuth.getLoggedIn),
      this.store.select(fromAuth.getUserInfo)
    ])
      .pipe(
        switchMap(([loggedIn, userInfo]) => {
          const role: string | string[] = next.data['role'];

          if (!loggedIn || !userInfo) {
            this.store.dispatch(AuthApiActions.loginRedirect({redirectURL: state.url}));
            return of(false);
          }

          if (typeof role === 'object') {
            const found = role.find(x => x === userInfo.role || x === 'any');
            if (loggedIn && found) {
              return of(true);
            }
          } else {
            if (loggedIn && (role === 'any' || userInfo.role === role)) {
              return of(true);
            }
          }

          // if root gets here, they should be redirected to the only page they qualify for
          if (userInfo.role === 'root') {
            return from(this.router.navigate(['/accounts']).then(() => false));
          }

          this.store.dispatch(AuthApiActions.loginRedirect({redirectURL: state.url}));
          return of(false);
        })
      );
  }
}
