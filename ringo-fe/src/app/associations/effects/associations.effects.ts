import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AssociationsPageActions, AssociationsApiActions} from '@ringo/associations/actions';
import {catchError, exhaustMap, switchMap, take} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromAssociations from '@ringo/associations/reducers';
import {BackendError, fromHttpError, isBackendError} from '@ringo/core/models';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {AssociationsService} from '@ringo/associations/services/associations.service';
import {isManagerSearchResult, Manager} from '@ringo/associations/models/associations';
import {isMeterSearchResult, MeterSearchResult} from '@ringo/meters/models';
import {MeterService} from '@ringo/meters/services/meter.service';

@Injectable()
export class AssociationsEffects {

  search$ = createEffect(
    () => this.actions$.pipe(
      ofType(
        AssociationsPageActions.pageEvent,
        AssociationsApiActions.associateMetersSuccess,
        AssociationsApiActions.dissociateMetersSuccess
      ),
      // take(1) is key, otherwise the select never completes!
      switchMap(() => this.store$.pipe(select(fromAssociations.selectAccountQuery), take(1))),
      exhaustMap(query => this.associationsService.search(query)
        .pipe(
          switchMap((response: BackendError | Manager[]) => {
            if (response && isBackendError(response)) {
              return of(AssociationsApiActions.accountSearchFailure({error: response}));
            } else if (response && isManagerSearchResult(response)) {
              return of(AssociationsApiActions.accountSearchSuccess({result: response}));
            }
            return of(AssociationsApiActions.accountSearchFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
          }),
          catchError((err: HttpErrorResponse) => {
            return of(AssociationsApiActions.accountSearchFailure({error: fromHttpError(err)}));
          })
        ))
    )
  );

  searchMeters$ = createEffect(
    () => this.actions$.pipe(
      ofType(
        AssociationsPageActions.dialogPageEvent,
        AssociationsPageActions.searchMeters,
        AssociationsPageActions.sort,
      ),
        exhaustMap(() => this.store$
        .pipe(
          select(fromAssociations.selectMeterSearchQuery), take(1),
          switchMap(query => this.meterService.search(query)),
          switchMap((response: BackendError | MeterSearchResult) => {
            if (response && isBackendError(response)) {
              return of(AssociationsApiActions.meterSearchFailure({error: response}));
            } else if (response && isMeterSearchResult(response)) {
              console.log(response);
              return of(AssociationsApiActions.meterSearchSuccess({result: response}));
            }
            return of(AssociationsApiActions.meterSearchFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
          }),
          catchError((err: HttpErrorResponse) => {
            return of(AssociationsApiActions.meterSearchFailure({error: fromHttpError(err)}));
          })
        )
      )
    )
  );

  associateMeters$ = createEffect(
    () => this.actions$.pipe(
      ofType(AssociationsPageActions.associateMeters),
      exhaustMap(payload => {
        const arr = [];
        for (const m of payload.meters) {
          arr.push(this.associationsService.associate(payload.user.id, m.meterId));
        }
        return forkJoin(arr);
      }),
      switchMap((response: BackendError[]) => {
        if (response && isBackendError(response)) {
          return of(AssociationsApiActions.associateMetersFailure({error: response}));
        }
        return of(AssociationsApiActions.associateMetersSuccess(), AssociationsPageActions.closeDialog());
      }),
      catchError((err: HttpErrorResponse) => {
        return of(AssociationsApiActions.associateMetersFailure({error: fromHttpError(err)}));
      })
    )
  );

  dissociateMeters$ = createEffect(
    () => this.actions$.pipe(
      ofType(AssociationsPageActions.dissociateMeters),
      exhaustMap(payload => {
        const arr = [];
        for (const m of payload.meters) {
          arr.push(this.associationsService.dissociate(payload.user.id, m.meterId));
        }
        return forkJoin(arr);
      }),
      switchMap((response: BackendError[]) => {
        if (response && isBackendError(response)) {
          return of(AssociationsApiActions.dissociateMetersFailure({error: response}));
        }
        return of(AssociationsApiActions.dissociateMetersSuccess());
        }),
      catchError((err: HttpErrorResponse) => {
        return of(AssociationsApiActions.dissociateMetersFailure({error: fromHttpError(err)}));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private associationsService: AssociationsService,
    private meterService: MeterService,
    private store$: Store<fromAssociations.State>,
  ) {
  }
}
