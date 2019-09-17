import {OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';


/**
 * Easily unsubscribe from an observable stream by appending `takeUntilDestroyed(this)` to the observable pipe.
 * If the component already has a `ngOnDestroy` method defined, it will call this first.
 * Note that the component *must* implement OnDestroy for this to work (the typings will enforce this anyway)
 */


export function takeUntilDestroyed<T>(component: OnDestroy): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> => {
    const onDestroy = new Subject();
    const previousOnDestroy = component.ngOnDestroy;

    component.ngOnDestroy = () => {
      if (previousOnDestroy) {
        previousOnDestroy.apply(component);
      }

      onDestroy.next();
      onDestroy.complete();
    };

    return source.pipe(takeUntil(onDestroy));
  };
}


export function url(path: string) {
  return `${environment.config.apiURI}${path}`;
}
