import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BackendError} from '@ringo/core/models';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'rng-load-profile-search',
  template: `
    <div class="wrapper">
        <p i18n-placeholder="@@ Browse Load Profile Data">Browse Load Profile Data</p>
        <div class="search">
          <form [formGroup]="form">
            <mat-form-field floatLabel="never">
              <mat-chip-list #chipList>
                <mat-chip *ngFor="let m of selectedMeterIds; let idx = index" [removable]="removable" (removed)="removeSelectedMeter(idx)">
                    {{m}}
                    <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
                </mat-chip>
              <input [matChipInputFor]="chipList"
                     (matChipInputTokenEnd)="onSubmit()"
                     formControlName="search" type="text"
                     placeholder="Filter Meter IDs"
                     i18n-placeholder="@@Filter Meter IDs">
              </mat-chip-list>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </form>
          <p><rng-backend-error-message [error]="error"></rng-backend-error-message>
          <mat-select i18n-placeholder="@@Found $NUM_METERS Meters"
                    placeholder="Found {{meterIds ? meterIds.length : 0}} Meters"
                    [(ngModel)]="selectedMeter"
                    (selectionChange)="applySelectedMeter()">
            <mat-option [value]="m" *ngFor="let m of meterIds">{{m}}</mat-option>
          </mat-select>
        </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .search {
      background: white;
      border-radius: 0.75rem;
      padding: 0.2rem 0.75rem 0.5rem 0.75rem;
      box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
      height: auto;
      width: 40%;
    }

    mat-form-field {
      width: 100%;
      font-size: 13px;
      color: #31345B;
      margin-bottom: -1rem;
    }
    
    .mat-chip {
        font-size: 13px;
    }
    
    p {
        align-self: center;
    }
  `]
})
export class LoadProfileSearchComponent implements OnInit {
  form = new FormGroup({
    search: new FormControl(null),
  });
  selectedMeter = '';
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  @Output() remove = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();
  @Output() selectMeter = new EventEmitter<string>();
  @Input() meterIds: string[] = [];
  @Input() selectedMeterIds: string[] = [];
  @Input() error: BackendError | null = null;
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
    this.search.emit(this.form.value.search);
  }

  applySelectedMeter() {
    this.selectMeter.emit(this.selectedMeter);
  }

  removeSelectedMeter(idx: number) {
    this.remove.emit(idx);
  }
}
