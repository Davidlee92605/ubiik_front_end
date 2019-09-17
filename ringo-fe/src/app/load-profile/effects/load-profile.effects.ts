import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoadProfileApiActions, LoadProfilePageActions} from '@ringo/load-profile/actions';
import {catchError, exhaustMap, switchMap, take} from 'rxjs/operators';
import {LoadProfileService} from '@ringo/load-profile/services/load-profile.service';
import {BackendError, fromHttpError, isBackendError} from '@ringo/core/models';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {DateRange, isMeterIdsSearchResult, LoadProfileResponse, MeterIdsSearchResult} from '@ringo/load-profile/models';
import {select, Store} from '@ngrx/store';
import * as fromLoadProfile from '@ringo/load-profile/reducers';
import {debug} from '@ringo/shared';

@Injectable()
export class LoadProfileEffects {
  search$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoadProfilePageActions.search),
      exhaustMap(payload => this.lpService.searchMeterIds(payload.query)),
      switchMap((response: BackendError | MeterIdsSearchResult) => {
        if (response && isBackendError(response)) {
          return of(LoadProfileApiActions.meterIdSearchFailure({error: response}));
        } else if (response && isMeterIdsSearchResult(response)) {
          return of(LoadProfileApiActions.meterIdSearchSuccess({result: response}));
        }
        return of(LoadProfileApiActions.meterIdSearchFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
      }),
      catchError((err: HttpErrorResponse) => {
        return of(LoadProfileApiActions.meterIdSearchFailure({error: fromHttpError(err)}));
      })
    )
  );

  loadProfile$ = createEffect(
    () => this.actions$.pipe(
      ofType(
        LoadProfilePageActions.pageEvent,
        LoadProfilePageActions.sort,
        LoadProfilePageActions.addSelectedMeter,
        LoadProfilePageActions.removeSelectedMeter
      ),
      switchMap(() => this.store$
        .pipe(
          debug('loadProfile$'),
          select(fromLoadProfile.selectLoadProfileQuery),
          take(1),
          switchMap(payload => this.lpService.requestLoadProfile(payload)
            .pipe(
              switchMap((response: BackendError | LoadProfileResponse) => {
                if (response && isBackendError(response)) {
                  return of(LoadProfileApiActions.getLoadProfileFailure({error: response}));
                } else if (response) {
                  return of(LoadProfileApiActions.getLoadProfileSuccess({loadProfile: response}));
                }
                return of(LoadProfileApiActions.getLoadProfileFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
              }),
              catchError((err: HttpErrorResponse) => {
                return of(LoadProfileApiActions.getLoadProfileFailure({error: fromHttpError(err)}));
              })
            )
          )
        )
      )
    )
  );


  export$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoadProfilePageActions.exportLoadProfile),
      exhaustMap(payload => this.lpService.export(payload.startDate, payload.endDate)),
      switchMap((response: BackendError | { url: string }) => {
        if (response && isBackendError(response)) {
          return of(LoadProfileApiActions.exportFailure({error: response}));
        } else if (response) {
          return of(LoadProfileApiActions.exportSuccess(response));
        }
        return of(LoadProfileApiActions.exportFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
      }),
    )
  );

  exportRange$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoadProfileApiActions.getExportRange),
      exhaustMap(() => this.lpService.exportRange()),
      switchMap((response: BackendError | DateRange) => {
        if (response && isBackendError(response)) {
          return of(LoadProfileApiActions.getExportRangeFailure({error: response}));
        } else if (response) {
          return of(LoadProfileApiActions.getExportRangeSuccess({range: response}));
        }
        return of(LoadProfileApiActions.getExportRangeFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
      }),
    )
  );

  constructor(
    private actions$: Actions,
    private lpService: LoadProfileService,
    private store$: Store<fromLoadProfile.State>,
    // private router: Router,
    // private dialog: MatDialog
  ) {
  }
}
