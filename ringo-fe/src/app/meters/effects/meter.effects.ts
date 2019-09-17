import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {MeterApiActions, MeterPageActions} from '@ringo/meters/actions';
import {catchError, exhaustMap, switchMap, take} from 'rxjs/operators';
import {MeterService} from '@ringo/meters/services/meter.service';
import {BackendError, fromHttpError, isBackendError} from '@ringo/core/models';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import * as fromMeter from '@ringo/meters/reducers';
import {isMeterSearchResult, MeterSearchResult} from '@ringo/meters/models/meter';
import hack = require('@ringo/meters/reducers/file-hack');

@Injectable()
export class MeterEffects {

  meterImport$ = createEffect(
    () => this.actions$.pipe(
      ofType(MeterPageActions.importMetersFromFile),
      // @ts-ignore
      exhaustMap(() => this.meterService.uploadMetersFile(hack.gBadHackImportFile)
        .pipe(
          switchMap((response: BackendError | null) =>
            response && response.message
              ? of(MeterApiActions.importMetersFailure({error: response}))
              : of(MeterApiActions.importMetersSuccess())),
          catchError((err: HttpErrorResponse) => {
            return of(MeterApiActions.importMetersFailure({error: fromHttpError(err)}));
          }),
        )
      )
    )
  );

  delete$ = createEffect(
    () => this.actions$.pipe(
      ofType(MeterPageActions.deleteMeter),
      exhaustMap(
        payload => this.meterService.deleteMeter(payload.meter)
          .pipe(
            switchMap((response: BackendError | null) => {
              if (response && isBackendError(response)) {
                return of(MeterApiActions.deleteMeterFailure({error: response}));
              }
              return of(MeterApiActions.deleteMeterSuccess());
            }),
            catchError((err: HttpErrorResponse) => {
              return of(MeterApiActions.deleteMeterFailure({error: fromHttpError(err)}));
            })
          )
      )
    )
  );

  search$ = createEffect(
    () => this.actions$.pipe(
      // update search if:
      //  - pagination changes
      //  - sort order changes
      //  - search terms change
      //  - an edit meter request succeeds
      ofType(
        MeterPageActions.pageEvent,
        MeterPageActions.sort,
        MeterPageActions.search,
        MeterApiActions.editMeterSuccess,
        MeterApiActions.deleteMeterSuccess,
      ),
      // take(1) is key, otherwise the select never completes!
      exhaustMap(() => this.store$
          .pipe(
            select(fromMeter.selectMeterPageQuery),
            take(1),
            switchMap(query => this.meterService.search(query)),
            switchMap((response: BackendError | MeterSearchResult) => {
              if (response && isBackendError(response)) {
                return of(MeterApiActions.searchFailure({error: response}));
              } else if (response && isMeterSearchResult(response)) {
                return of(MeterApiActions.searchSuccess({result: response}));
              }
              return of(MeterApiActions.searchFailure({error: {code: 'EBADRESP', message: 'invalid response'}}));
            }),
            catchError((err: HttpErrorResponse) => {
              return of(MeterApiActions.searchFailure({error: fromHttpError(err)}));
            })
          )
      )
    )
  );

  atCommand$ = createEffect(
    () => this.actions$.pipe(
      ofType(MeterPageActions.atCommand),
      exhaustMap(request => this.meterService.sendATCommand(request.request)),
      // TODO: handle errors
      exhaustMap(response => of(MeterApiActions.atCommandSuccess()))
    )
  );

  queryLoadProfile$ = createEffect(
    () => this.actions$.pipe(
      ofType(MeterPageActions.sendMeterQueryRequest),
      exhaustMap(request => this.meterService.queryLoadProfile(request.request)),
      // TODO: handle errors
      exhaustMap(response => of(MeterApiActions.meterQuerySuccess()))
    )
  );

  editMeter$ = createEffect(
    () => this.actions$.pipe(
      ofType(MeterPageActions.editMeter),
      exhaustMap(payload => this.meterService.updateMeter(payload.meter)),
      switchMap((response: BackendError) => {
        if (response && isBackendError(response)) {
          return of(MeterApiActions.editMeterFailure({error: response}));
        }
        return of(MeterApiActions.editMeterSuccess());
      }),
      catchError((err: HttpErrorResponse) => {
        return of(MeterApiActions.editMeterFailure({error: fromHttpError(err)}));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private meterService: MeterService,
    private store$: Store<fromMeter.State>,
    // private router: Router,
    // private dialog: MatDialog
  ) {
  }
}
