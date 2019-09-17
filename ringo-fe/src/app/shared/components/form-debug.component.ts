import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {environment} from '@env/environment';

@Component({
  selector: 'rng-form-debug',
  template: `
    <div *ngIf="enabled">
      <a (click)="visible=!visible"> _ </a>
      <p *ngIf="visible">
        <code>{{form.value | json}}</code><br>
        <code>{{form.errors | json}}</code><br>
        <code>{{form.status | json}}</code><br>
      </p>
    </div>
  `,
  styles: [`
  * {
    font-size: xx-small;
  }
  `]
})
export class FormDebugComponent implements OnInit {
  enabled = !environment.production;
  visible = false;
  @Input() form: FormGroup | undefined;

  constructor() {
  }

  ngOnInit() {
  }
}

