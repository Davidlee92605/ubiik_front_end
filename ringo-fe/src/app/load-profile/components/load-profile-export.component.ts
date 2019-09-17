import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {DateTime} from 'luxon';
import {BackendError} from '@ringo/core/models';

@Component({
  selector: 'rng-load-profile-export',
  template: `
      <h4 i18n="@@Export Data By Date Range">Export Data By Date Range</h4>
      <rng-pending [pending]="form.disabled">
      <form [formGroup]="form" (submit)="onSubmit()">
          <p>
              <mat-form-field>
                  <input matInput [min]="minDate" [max]="maxDate" [matDatepicker]="startPicker"
                         formControlName="startDate"
                         i18n-placeholder="@@Choose a start date" placeholder="Choose a start date">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>
          </p>
          <p>
              <mat-form-field>
                  <input matInput [min]="minDate" [max]="maxDate" [matDatepicker]="endPicker"
                         formControlName="endDate"
                         i18n-placeholder="@@Choose an end date" placeholder="Choose an end date">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
          </p>
          <p>
              <rng-backend-error-message [error]="error"></rng-backend-error-message>
              <rng-backend-error-message [error]="rangeError"></rng-backend-error-message>
          </p>
          <div>
              <button mat-flat-button class="outline" *ngIf="!downloadURL" color="primary"
                      [disabled]="form.invalid"
                      i18n="@@Generate Export File">
                  Generate Export File
              </button>
              <a *ngIf="downloadURL" (click)="download($event)" i18n="@@Download Export File">
                  Download Export File</a>
          </div>
      </form>
      </rng-pending>
  `,
  styles: [`
    h4 {
        margin-bottom: 2rem;
        font-size: 14px;
        color: #31345B;
    }

    mat-form-field {
        width: 100%;
    }
  `]
})
export class LoadProfileExportComponent implements OnInit {
  form = new FormGroup({
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null, [Validators.required])
  }, {validators: [this.validateExportForm.bind(this)]});

  @Input() error: BackendError | null = null;
  @Input() rangeError: BackendError | null = null;
  @Output() exportData = new EventEmitter<{ startDate: string, endDate: string }>();
  @Output() downloadClicked = new EventEmitter();
  @Input() downloadURL = '';
  minDateTime: DateTime = DateTime.local();
  maxDateTime: DateTime = DateTime.local();

  constructor() {
  }

  get minDate(): DateTime {
    return this.minDateTime;
  }

  @Input() set minDate(dt: DateTime) {
    this.minDateTime = dt;
    this.form.controls.startDate.setValue(dt);
  }

  get maxDate(): DateTime {
    return this.maxDateTime;
  }

  @Input() set maxDate(dt: DateTime) {
    this.maxDateTime = dt;
    this.form.controls.endDate.setValue(dt);
  }

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    const m = {
      startDate: this.form.value.startDate.toUTC().toISO(),
      endDate: this.form.value.endDate.toUTC().toISO()
    };
    this.exportData.emit(m);
  }

  download($event: MouseEvent) {
    window.open(this.downloadURL, '_blank');
    this.downloadClicked.emit();
  }

  private validateExportForm(control: AbstractControl): ValidationErrors | null {
    const v: { startDate: DateTime, endDate: DateTime } = control.value;
    if (!v || !v.startDate) {
      return {noStartDate: true};
    }
    if (!v || !v.endDate) {
      return {noEndDate: true};
    }

    if (v.startDate < this.minDateTime) {
      return {startDateGtMin: true};
    }
    if (v.endDate > this.maxDateTime) {
      return {endDateGtMax: true};
    }

    return null;
  }
}
