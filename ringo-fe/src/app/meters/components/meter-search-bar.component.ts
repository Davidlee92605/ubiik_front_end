import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

// Not really sure what this is supposed to search on. I guess maybe we can have it search for key=value pairs or something

@Component({
  selector: 'rng-meter-search-bar',
  template: `
      <form [formGroup]="form" (submit)="onSubmit()">
          <mat-select i18n-placeholder="@@Select a group..." placeholder="Select a group...">
              <mat-option value="*" i18n="@@All groups">All groups</mat-option>
          </mat-select>
          <mat-form-field>
              <input matInput  formControlName="query" type="text" placeholder="Search..." i18n-placeholder="@@Search...">
              <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button type="submit" style="display: none">Submit</button>
      </form>
  `,
  styles: [`
    mat-select {
      width: 30%;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }

    mat-form-field {
      width: 67%;
      font-size: 13px;
      margin-top: 3px;
    }

    mat-icon {
      position: relative;
      top: 4px;
    }
  `]
})
export class MeterSearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<{query: string}>();
  form = new FormGroup({
    query: new FormControl(null)
  });

  constructor() {
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
    console.log('onSubmit');
    this.search.emit(this.form.value);
  }
}
