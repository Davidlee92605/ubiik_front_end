import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rng-meter-import-bar',
  template: `
      <p>Meters</p>
      <form [formGroup]="form">
        <button mat-flat-button class="outline" [disabled]="form.disabled" (click)="onImportMeter()" i18n="@@Import"><fa-icon icon="cloud-upload-alt"></fa-icon>  Import</button>
        <button mat-flat-button class="outline" [disabled]="form.disabled" (click)="onAddMeter()" i18n="@@Add Meter"><fa-icon icon="plus"></fa-icon>  Add Meter</button>
      </form>
  `,
  styles: [`
    :host {
        display: flex;
        justify-content: space-between;
    }
    
    fa-icon {
        position: relative;
        bottom: 1px;
        right: 2px;
    }

    button {
      padding: 1rem;
      width: auto;
      margin: 0.2rem;
      font-weight: bolder;
    }

    p {
      align-self:center;
    }
  `]
})
export class MeterImportBarComponent implements OnInit {
  @Output() addMeter = new EventEmitter();
  @Output() importMeter = new EventEmitter();
  form = new FormGroup({});

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

  onAddMeter() {
    this.addMeter.emit();
  }

  onImportMeter() {
    this.importMeter.emit();
  }
}
