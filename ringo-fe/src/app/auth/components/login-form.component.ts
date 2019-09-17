import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Credentials} from '@ringo/auth/models';
import {BackendError} from '@ringo/core/models';

@Component({
  selector: 'rng-login-form',
  template: `
      <img src="assets/ringo-logo.jpg" alt="logo">
      <div class="title">
          <h2>Power Meter <span>Management System</span></h2>
      </div>
      <form [formGroup]="form" (submit)="submit()">
          <div class="card-content">
              <rng-pending [pending]="form.disabled">
                  <h1 i18n="@@Login">LOGIN</h1>
                  <p>
                      <mat-form-field [hideRequiredMarker]="true" appearance="standard">
                          <fa-icon icon="envelope" matPrefix></fa-icon>
                          <input matInput i18n-placeholder="@@E-MAIL" placeholder="E-MAIL" formControlName="email" required>
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field [hideRequiredMarker]="true" appearance="standard">
                          <fa-icon icon="lock" matPrefix></fa-icon>
                          <input matInput i18n-placeholder="@@PASSWORD" placeholder="PASSWORD" formControlName="password" type="password"
                                 required>
                      </mat-form-field>
                  </p>
                  <p>
                      <rng-backend-error-message *ngIf="error" [error]="error"></rng-backend-error-message>
                  </p>
                  <p class="forgot-password">
                      <a routerLink="/auth/lost-password" i18n="@@Forgot password?">Forgot password</a>
                  </p>
                  <div class="card-actions">
                      <button mat-flat-button class="red" type="submit" [disabled]="form.invalid || form.disabled" i18n="@@Login">Log In
                      </button>
                  </div>
              </rng-pending>
          </div>
      </form>
  `,
  styles: [`
      .forgot-password {
          text-align: right;
      }

      mat-form-field {
          width: 100%;
          margin-top: 1rem;
      }

      fa-icon {
          color: #999999;
      }

      .card-content p:nth-child(2) {
          margin-top: 1rem;
      }

      .card-content {
          position: absolute;
          right: 0;
          left: 0;
          margin: 5rem auto auto auto;
          width: 23rem;
      }

      .card-actions {
          margin-top: 2rem;
      }

      button.mat-flat-button {
          color: white;
          font-weight: bolder;
      }
  `]
})
export class LoginFormComponent implements OnInit {

  @Input() error: BackendError | null = null;
  @Output() submitted = new EventEmitter<Credentials>();
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', []),
  });

  constructor() {
  }

  @Input()
  set pending(isPending: boolean) {
    console.error('login form pending', isPending);
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }
}
