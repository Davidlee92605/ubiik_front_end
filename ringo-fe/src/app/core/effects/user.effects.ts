import {Injectable} from '@angular/core';

import {fromEvent, merge, timer} from 'rxjs';
import {map, switchMapTo} from 'rxjs/operators';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserActions} from '@ringo/core/actions';
import {environment} from '@env/environment';

@Injectable()
export class UserEffects {
  clicks$ = fromEvent(document, 'click');
  keys$ = fromEvent(document, 'keydown');
  mouse$ = fromEvent(document, 'mousemove');

  idle$ = createEffect(() =>
    merge(this.clicks$, this.keys$, this.mouse$).pipe(
      switchMapTo(timer(environment.idleTimeout)), // 1 hour inactivity timeout
      map(() => UserActions.idleTimeout())
    )
  );

  lang$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.changeLanguage),
    )
  );

  constructor(
    private actions$: Actions
  ) {}

}
