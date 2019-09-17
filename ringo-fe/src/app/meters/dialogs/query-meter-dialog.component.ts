import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromMeter from '@ringo/meters/reducers';
import {Actions, ofType} from '@ngrx/effects';
import {map, take} from 'rxjs/operators';
import {MeterApiActions, MeterPageActions} from '@ringo/meters/actions';
import {Meter} from '@ringo/meters/models';
import {takeUntilDestroyed} from '@ringo/shared';


export interface QueryLoadProfileDialogResult {
  from: number;
  to: number;
}

@Component({
  selector: 'rng-query-load-profile-dialog',
  template: `
      <form [formGroup]="form">
          <h1 mat-dialog-title i18n="@@Create Account">Send Command</h1>

          <mat-dialog-content>
              <rng-pending [pending]="pending$ | async">
                  <p>
                      <mat-form-field>
                          <input matInput
                                 formControlName="fromDate"
                                 i18n-placeholder="@@From date"
                                 placeholder="From date"
                                 [matDatepicker]="fromPicker"
                          >
                      </mat-form-field>
                      <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                      <mat-datepicker #fromPicker></mat-datepicker>
                      <mat-select formControlName="fromTime" i18n="@@From time" placeholder="From time">
                          <mat-option *ngFor="let t of times" [value]="t">{{t}}</mat-option>
                      </mat-select>
                  </p>
                  <p>
                      <mat-form-field>
                          <input matInput
                                 formControlName="toDate"
                                 i18n-placeholder="@@To date"
                                 placeholder="To date"
                                 [matDatepicker]="toPicker"
                          >
                      </mat-form-field>
                      <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
                      <mat-datepicker #toPicker></mat-datepicker>
                      <mat-select formControlName="toTime" i18n="@@To time" placeholder="To time">
                          <mat-option *ngFor="let t of times" [value]="t">{{t}}</mat-option>
                      </mat-select>
                  </p>
              </rng-pending>
          </mat-dialog-content>
          <mat-dialog-actions class="dlg-actions">
              <button mat-flat-button
                      class="cancel"
                      [disabled]="pending$ | async"
                      (click)="close()"
                      i18n="@@Cancel">Cancel
              </button>
              <button mat-flat-button
                      class="query"
                      [disabled]="form.invalid || (pending$ | async)"
                      (click)="submit()"
                      i18n="@@Send Query">Send Query
              </button>
          </mat-dialog-actions>
      </form>
  `,
  styles: [`
      .mat-datepicker {
          width: 70%;
      }

      .mat-select {
          margin-bottom: 0.5rem;
          width: 20%;
      }

      ::ng-deep .mat-select-value-text {
          font-size: 1rem;
          font-weight: 400;
      }

      .query {
          border: #BF0000 solid 2px;
      }
  `]
})
export class QueryMeterDialogComponent implements OnInit, OnDestroy {
  error$ = this.store.pipe(select(fromMeter.selectMeterQueryError));
  pending$ = this.store.pipe(select(fromMeter.selectMeterQueryPending));
  selected$ = this.store.pipe(select(fromMeter.selectMeterSelection));

  INTERVAL = 30;
  times: string[] = [];

  form = new FormGroup({
    fromDate: new FormControl(new Date(), [Validators.required]),
    toDate: new FormControl(new Date(), [Validators.required]),
    fromTime: new FormControl(this.times[0], [Validators.required]),
    toTime: new FormControl(this.times[this.times.length - 1], [Validators.required]),
  });

  constructor(
    private store: Store<fromMeter.State>,
    private actions$: Actions,
    private dialog: MatDialogRef<QueryMeterDialogComponent>,
  ) {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 45; m += this.INTERVAL) {
        this.times.push(h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0'));
      }
    }
    this.actions$
      .pipe(
        ofType(
          MeterApiActions.meterQuerySuccess
        ),
        takeUntilDestroyed(this)
      )
      .subscribe(() => this.close());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  submit() {
    const v: { fromDate: Date, toDate: Date; fromTime: string; toTime: string } = this.form.value;
    const from = v.fromTime.split(':');
    v.fromDate.setHours(+from[0]);
    v.fromDate.setMinutes(+from[1]);

    const to = v.toTime.split(':');
    v.toDate.setHours(+to[0]);
    v.toDate.setMinutes(+to[1]);

    const range = {
      from: Math.floor(v.fromDate.valueOf() / 1000),
      to: Math.floor(v.toDate.valueOf() / 1000),
    };

    this.selected$.pipe(
      take(1),
      map((meters: Meter[]) => meters.map(m => ({
        meterId: m.meterId,
        fanId: m.fanId,
        from: range.from,
        to: range.to
      })))
    ).subscribe(request => this.store.dispatch(MeterPageActions.sendMeterQueryRequest({request})));
  }

  close() {
    this.store.dispatch(MeterPageActions.meterQueryDialogClose());
    this.dialog.close();
  }

}
