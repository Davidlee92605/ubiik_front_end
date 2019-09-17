import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Meter} from '@ringo/meters/models/meter';
import {select, Store} from '@ngrx/store';
import * as fromMeter from '@ringo/meters/reducers';
import {Actions, ofType} from '@ngrx/effects';
import {MeterApiActions, MeterPageActions} from '@ringo/meters/actions';
import {takeUntilDestroyed} from '@ringo/shared';

@Component({
  selector: 'rng-edit-meter-dialog',
  template: `
      <form [formGroup]="form">
          <h1 mat-dialog-title *ngIf="!isEdit" i18n="@@Create Meter Record">Create Meter Record</h1>
          <h1 mat-dialog-title *ngIf="isEdit" i18n="@@Edit Meter Record">Edit Meter Record</h1>
          <mat-dialog-content>
              <rng-pending [pending]="pending$ | async">
                  <p>
                      <mat-form-field appearance="standard">
                          <input matInput formControlName="meterId" i18n-placeholder="@@Meter ID" placeholder="Meter ID" type="text">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <input matInput formControlName="guk" i18n-placeholder="@@GUK" placeholder="GUK" [maxLength]="32" type="text">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <input matInput formControlName="ak" i18n-placeholder="@@AK" placeholder="AK" [maxLength]="32" type="text">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <input matInput formControlName="coords" i18n-placeholder="@@Coordinates" placeholder="Coordinates"
                                 [maxLength]="32"
                                 type="text">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <textarea matInput formControlName="address" i18n-placeholder="@@Address" placeholder="Address"></textarea>
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <textarea matInput formControlName="notes" i18n-placeholder="@@Notes" placeholder="Notes"></textarea>
                      </mat-form-field>
                  </p>
                  <p>
                      <rng-backend-error-message [error]="error$ | async"></rng-backend-error-message>
                  </p>
              </rng-pending>
          </mat-dialog-content>

          <mat-dialog-actions>
              <button mat-flat-button
                      class="cancel"
                      (click)="close()"
                      i18n="@@Cancel"
                      [disabled]="pending$ | async">Cancel
              </button>
              <button mat-flat-button
                            class="outline"
                            (click)="submit()"
                            [disabled]="!form.valid || form.pristine || (pending$ | async)"
                            i18n="@@Submit">Submit
              </button>
          </mat-dialog-actions>
      </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      padding: 0 0 -1em 0;
    }
`]
})
export class EditMeterDialogComponent implements OnInit, OnDestroy {
  error$ = this.store.pipe(select(fromMeter.selectEditMeterError));
  pending$ = this.store.pipe(select(fromMeter.selectEditMeterPending));
  form: FormGroup;
  isEdit = true;

  constructor(
    private store: Store<fromMeter.State>,
    private actions$: Actions,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditMeterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Meter | undefined,
  ) {
    if (!data) {
      this.isEdit = false;
    }
    this.form = this.formBuilder.group({
      meterId: [data && data.meterId, {validators: Validators.required}],
      guk: [data && data.guk, {validators: Validators.required}],
      ak: [data && data.ak, {validators: Validators.required}],
      notes: [data && data.notes],
      address: [data && data.address],
      coords: [data && data.coords],
    });
    this.actions$
      .pipe(
        ofType(
          MeterApiActions.editMeterSuccess
        ),
        takeUntilDestroyed(this)
      )
      .subscribe(() => this.close());
  }

  ngOnInit() {
    if (this.isEdit) {
      this.form.controls.meterId.disable();
    }
  }

  ngOnDestroy() {
  }

  submit() {
    this.store.dispatch(MeterPageActions.editMeter({meter: this.form.value}));
  }

  close() {
    this.store.dispatch(MeterPageActions.editMeterDialogClose());
    this.dialogRef.close();
  }
}

