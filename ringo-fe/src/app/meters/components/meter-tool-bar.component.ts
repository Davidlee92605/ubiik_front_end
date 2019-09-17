import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rng-meter-tool-bar',
  template: `
      <button mat-flat-button class="outline" [disabled]="!metersSelected || pending" (click)="onShowLoadProfile()" i18n="@@Query Load Profile">
          Show Load Profile
      </button>
      <button mat-flat-button class="outline" [disabled]="!metersSelected || pending" (click)="onQueryMeter()" i18n="@@Query Load Profile">
          Query Meter
      </button>
      <button mat-flat-button class="outline" [disabled]="!metersSelected || pending" (click)="onSendCommand()" i18n="@@Send Command">
          Send Command
      </button>
  `,
  styles: [`
    :host {
        display: flex;
        justify-content: flex-end;
    }

    button {
      padding: 1rem;
      width: auto;
      margin: 0.2rem;
      font-weight: bolder;
    }
  `]
})
export class MeterToolBarComponent implements OnInit {
  @Output() queryMeter = new EventEmitter();
  @Output() loadProfile = new EventEmitter();
  @Output() sendCommand = new EventEmitter();
  @Input() metersSelected = 0;
  @Input() pending = false;

  form = new FormGroup({});

  constructor() {
  }

  ngOnInit() {
  }

  onQueryMeter() {
    this.queryMeter.emit();
  }

  onSendCommand() {
    this.sendCommand.emit();
  }

  onShowLoadProfile() {
    this.loadProfile.emit();
  }
}
