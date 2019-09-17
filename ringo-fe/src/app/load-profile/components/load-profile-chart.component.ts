import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'rng-load-profile-chart',
  template: `
    <!-- div class="card" [formGroup]="chartForm">

    <h1 i18n="@@Load Profile Chart">Load Profile Chart</h1>

  <div class="card-content" id="graph-container" formArrayName="readings">
    <div>
      <h3 i18n="@@Filter">Filter</h3>
      <p *ngFor="let m of chartFormArray.controls; let idx = index" [formGroupName]="idx">
        <mat-checkbox checked formControlName="enabled">{{m.value.name}}</mat-checkbox>
      </p>
      <p>
        <rng-form-field>
          <mat-select i18n-placeholder="@@Inteval" placeholder="Interval">
            <mat-option value="" i18n="@@15 Minute">15 Minute</mat-option>
          </mat-select>
        </rng-form-field>
      </p>
    </div>
    <p>
      <canvas #lineChart>{{ chart }}</canvas>
    </p>
  </div>
</div -->
  `,
  styles: [`
    ::ng-deep .mat-chip-list-stacked .mat-chip-list-wrapper .mat-standard-chip {
      width: auto!important;
    }
  `]
})
export class LoadProfileChartComponent implements OnInit {
  form = new FormGroup({
    search: new FormControl(null),
  });

  @Input() selectedMeterIds: string[] = [];
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  constructor() { }

  ngOnInit() {
  }



}
