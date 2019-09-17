import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromMeter from '@ringo/meters/reducers';
import {Actions, ofType} from '@ngrx/effects';
import {MeterApiActions, MeterPageActions} from '@ringo/meters/actions';
import {takeUntilDestroyed} from '@ringo/shared';
import {map, take} from 'rxjs/operators';
import {Meter} from '@ringo/meters/models';
import {BehaviorSubject} from 'rxjs';
import {BackendError} from '@ringo/core/models';

@Component({
  selector: 'rng-send-command-dialog',
  template: `
    <form [formGroup]="form">
      <h1 mat-dialog-title i18n="@@Create Account">Send Command</h1>

      <mat-dialog-content>
        <p>
          <mat-form-field>
            <input matInput formControlName="cmd" i18n-placeholder="@@Command (AT or HEX)" placeholder="Command (AT or HEX)" type="text">
          </mat-form-field>
        </p>
        <p>
            <rng-backend-error-message [error]="error$ | async"></rng-backend-error-message>
        </p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-flat-button
                class="cancel"
                [disabled]="pending$ | async"
                (click)="close()"
                i18n="@@Cancel">Cancel</button>
        <button mat-flat-button
                class="outline"
                [disabled]="form.invalid || form.pristine || (pending$ | async)"
                i18n="@@Send Command"
                (click)="submit()">Send Command</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})
export class ATCommandDialogComponent implements OnInit, OnDestroy {
  error$ = new BehaviorSubject<BackendError | null>(null);
  pending$ = this.store.pipe(select(fromMeter.selectATCommandPending));
  selected$ = this.store.pipe(select(fromMeter.selectMeterSelection));

  form = new FormGroup({
    cmd: new FormControl(null, [Validators.required])
  });

  constructor(
    private store: Store<fromMeter.State>,
    private actions$: Actions,
    @Inject(MAT_DIALOG_DATA) public data: {code: string | undefined},
    private dialog: MatDialogRef<ATCommandDialogComponent>
  ) {
    this.store.pipe(select(fromMeter.selectATCommandError), takeUntilDestroyed(this)).subscribe(this.error$);
    this.selected$.pipe(take(1)).subscribe(selected => {
      // check that the selected meters have fanIds
      const filtered = selected.filter(m => !!m.fanId);
      if (!filtered || filtered.length === 0) {
        this.error$.next({code: 'ENOFANSELECTED', message: 'No FANs were selected'});
      }
    });
    this.actions$
      .pipe(
        ofType(
          MeterApiActions.atCommandSuccess
        ),
        takeUntilDestroyed(this)
      )
      .subscribe(() => this.close());
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  submit() {
    const command = btoa(this.form.value.cmd);
    this.selected$.pipe(
      take(1),
      map((meters: Meter[]) => ({
        fanIds: meters.map(m => m.fanId),
        command: command
        }))
    ).subscribe(request => this.store.dispatch(MeterPageActions.atCommand({request})));
  }

  close() {
    this.store.dispatch(MeterPageActions.atCommandDialogClose());
    this.dialog.close();
  }
}
