import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {passwordsMatch} from '@ringo/auth/validators';


@Component({
  selector: 'rng-handle-password-reset-form',
  template: `
    <img src="assets/ringo-logo.jpg" alt="logo">
    <div class="title">
        <h2>Power Meter <span>Management System</span></h2>
    </div>
    <form [formGroup]="form" (submit)="submit()">
      <div class="card">
        <rng-pending [pending]="form.disabled">
          <h1 i18n="@@Create New Password">Create New Password</h1>
  
          <div>
            <p>
              <mat-form-field>
                <fa-icon icon="lock" matPrefix></fa-icon>
                <input matInput i18n-placeholder="@@NEW PASSWORD" type="password" placeholder="NEW PASSWORD"
                       formControlName="password" autocomplete="new-password">
              </mat-form-field>
            </p>
            <p>
              <mat-form-field>
                <fa-icon icon="lock" matPrefix></fa-icon>
                <input matInput i18n-placeholder="@@CONFIRM NEW PASSWORD" type="password" placeholder="CONFIRM NEW PASSWORD"
                       formControlName="verifyPassword" autocomplete="new-password">
              </mat-form-field>
            </p>
            <p>
              <rng-backend-error-message *ngIf="genericError"></rng-backend-error-message>
              <mat-error *ngIf="form.hasError('noMatch')" i18n="@@Passwords do not match">Passwords do not match</mat-error>
              <mat-error *ngIf="failedComplexity">Password must be at least 6 characters long</mat-error>
            </p>
          </div>
          <div>
            <button mat-flat-button type="submit" i18n="@@Submit"  [disabled]="form.invalid || form.disabled">Submit</button>
          </div>
        </rng-pending>
      </div>
    </form>
    <rng-form-debug [form]="form"></rng-form-debug>
  `,
  styles: [`
      .card {
          position: absolute;
          right: 0;
          left: 0;
          margin: 5rem auto auto auto;
          padding: 2.5rem;
          width: 23rem;
          border-radius: 8px;
          box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
      }

      mat-form-field {
          width: 100%;
          margin-bottom: 1rem;
      }

      button {
          margin-top: 1rem;
      }

      h1 {
          margin-top: -1.5rem;
      }
  `]
})
export class HandleResetLinkFormComponent implements OnInit {
  @Input() failedComplexity = false;
  @Input() genericError = false;
  @Output() submitted = new EventEmitter<string>();
  form = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    verifyPassword: new FormControl(null, [Validators.required]),
  }, {validators: [passwordsMatch]});

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

  submit() {
    this.submitted.emit(this.form.value.password);
  }
}
