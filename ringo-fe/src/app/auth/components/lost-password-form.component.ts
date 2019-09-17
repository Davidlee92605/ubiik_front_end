import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'rng-lost-password-form',
  template: `
      <img src="assets/ringo-logo.jpg" alt="logo">
      <div class="title">
          <h2>Power Meter <span>Management System</span></h2>
      </div>
      <form [formGroup]="form" (submit)="submit()">
          <div class="card-content">
              <rng-pending [pending]="form.disabled">
                  <h1 i18n="@@Send Password Reset Link">Restore Password</h1>
                  <p>
                      <mat-form-field [hideRequiredMarker]="true" appearance="standard">
                          <fa-icon icon="envelope" matPrefix></fa-icon>
                          <input matInput i18n-placeholder="@@E-MAIL" placeholder="E-MAIL" formControlName="email" required type="email">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-error *ngIf="invalidCredentials" i18n="@@Email not found">Email not found</mat-error>
                  </p>
                  <div class="card-actions">
                      <button mat-flat-button
                              class="red"
                              type="submit"
                              [disabled]="form.invalid || form.disabled"
                              i18n="@@Restore My Password">Restore My Password
                      </button>
                  </div>
              </rng-pending>
          </div>
      </form>
  `,
  styles: [`
      mat-form-field {
          width: 100%;
          border-radius: 5px;
      }

      fa-icon {
          color: #999999;
      }

      h1 {
          margin-bottom: 1rem;
      }

      .card-content {
          margin: 5rem auto auto auto;
          left: 0;
          right: 0;
          position: absolute;
          width: 23rem;
      }

      .card-actions {
          margin-top: 1.6rem;
      }

      button.mat-flat-button {
          color: white;
          font-weight: bolder;
      }
  `]
})
export class LostPasswordFormComponent implements OnInit {
  @Input() invalidCredentials = false;
  @Input() genericError = false;
  @Output() submitted = new EventEmitter<string>();
  form = new FormGroup({
    email: new FormControl(null, [Validators.required])
  });

  constructor() {
  }

  @Input()
  set pending(isPending: boolean) {
    console.error('LostPasswordForm pending', isPending);
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  ngOnInit() {
  }

  submit() {
    this.submitted.emit(this.form.value.email);
  }
}
