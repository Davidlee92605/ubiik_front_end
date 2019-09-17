import {MonoTypeOperatorFunction, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

const debuggerOn = !environment.production;

export function debug<T>(name: string): MonoTypeOperatorFunction<T> {
  return function debugOperatorFunction(source: Observable<T>): Observable<T> {
    if (debuggerOn) {
      console.log('RXJS LOGGING:', name);
    }
    return source.pipe(
      tap(
        (next: T) => {
          if (debuggerOn) {
            console.log('RXJS:', name, JSON.parse(JSON.stringify(next)));
          }
        },
        (err) => {
          if (debuggerOn) {
            console.error('RXJS ERROR:', name, err);
          }
        },
        () => {
          if (debuggerOn) {
            console.log('RXJS COMPLETE:', name);
          }
        }
      )
    );
  };
}
