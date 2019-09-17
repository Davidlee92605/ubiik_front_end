import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Meter} from '@ringo/meters/models';

@Component({
  selector: 'rng-meter-info-dialog',
  template: `
      <h1 mat-dialog-title>Meter ID: {{meter.meterId}}</h1>
      <mat-dialog-content>
        <dl>
          <dt i18n="@@GUK">GUK:</dt>
          <dd>{{meter.guk}}</dd>
          <dt i18n="@@AK">AK:</dt>
          <dd>{{meter.ak}}</dd>
          <dt i18n="@@Address">Address:</dt>
          <dd>{{meter.address}}</dd>
          <dt i18n="@@Coordinates">Coordinates:</dt>
          <dd>
            <a href="https://www.google.com/maps/place/{{meter.coords}}" target="_blank" data-popup="true">
              {{meter.coords}}
            </a>
          </dd>
          <dt i18n="@@Notes">Notes:</dt>
          <dd>{{meter.notes}}</dd>
        </dl>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-flat-button class="cancel" [mat-dialog-close]="true" i18n="@@Close">Close</button>
      </mat-dialog-actions>
  `,
  styles: [`
    dd {
      margin: 2%;
    }

    button {
        width: 100%;
    }
  `]
})
export class MeterInfoDialogComponent implements OnInit {
  meter: Meter;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Meter) {
    this.meter = data;
  }

  ngOnInit() {
  }

}
