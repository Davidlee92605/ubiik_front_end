import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromMeter from '@ringo/meters/reducers';
import {takeUntilDestroyed} from '@ringo/shared';
import hack = require('@ringo/meters/reducers/file-hack');
import {MeterApiActions, MeterPageActions} from '@ringo/meters/actions';
import {Actions, ofType} from '@ngrx/effects';

@Component({
  selector: 'rng-import-meter-dialog',
  template: `
      <mat-dialog-content>
          <rng-pending [pending]="pending$ | async">
              <h1 i18n="@@Meter Key Upload">Meter Key Upload</h1>
              <p i18n="@@File type supported: CSV">File type supported: CSV</p>
              <p i18n="@@File format: TAB separated">File format: TAB separated</p>
              <p i18n="@@CSV fields: MeterID, GUK, AK, Address (optional), Coords (optional), Notes (optional)">
                  CSV fields: MeterID, GUK, AK, Address (optional), Coords (optional), Notes (optional)</p>
              <p>
                  <label for="file" i18n="@@Choose file">
                      <fa-icon icon="paperclip"></fa-icon>
                      Choose file</label>
                  <input type="file"
                         id="file"
                         [disabled]="pending$ | async"
                         (click)="selectedFile = undefined"
                         (change)="handleFileInput($event.target.files)">
              </p>
              <rng-backend-error-message [error]="error$ | async"></rng-backend-error-message>
          </rng-pending>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-flat-button type="button" class="cancel" (click)="close()">Cancel</button>
          <button mat-flat-button
                  (click)="onUploadFile(selectedFile)"
                  [disabled]="!selectedFile"
                  i18n="@@Upload">Upload</button>
      </mat-dialog-actions>
  `,
  styles: [`
      label {
          font-weight: bold;
      }

      label:hover {
          cursor: pointer;
      }

      h1 {
          margin-bottom: 2rem;
      }

      p {
          color: #666666;
          font-size: 14px;
          font-weight: 300;
          margin-bottom: 1rem;
      }
  `]
})
export class MeterImportDialogComponent implements OnInit, OnDestroy {
  selectedFile: File | null | undefined;
  error$ = this.store.pipe(select(fromMeter.selectImportMeterError));
  pending$ = this.store.pipe(select(fromMeter.selectImportMeterPending));

  constructor(
    private dialogRef: MatDialogRef<MeterImportDialogComponent>,
    private store: Store<fromMeter.State>,
    private actions$: Actions,
  ) {
    this.actions$
      .pipe(
        ofType(
          MeterApiActions.importMetersSuccess
        ),
        takeUntilDestroyed(this)
      )
      .subscribe(() => this.close());
  }

  handleFileInput(files: FileList) {
    console.log('input-files', files);
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files.item(0);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onUploadFile(file: File | undefined) {
    if (file) {
      hack.gBadHackImportFile = file;
      this.store.dispatch(MeterPageActions.importMetersFromFile());
    }
  }

  close() {
    this.store.dispatch(MeterPageActions.importMeterDialogClose());
    return this.dialogRef.close();
  }
}
