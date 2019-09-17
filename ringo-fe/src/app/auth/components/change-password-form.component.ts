import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {passwordsMatch} from '@ringo/auth/validators';
import {PasswordChangeRequest} from '@ringo/auth/models';

@Component({
  selector: 'rng-change-password-form',
  template: `
      <form [formGroup]="form" (submit)="submit()">
          <div class="card-content">
              <rng-pending [pending]="form.disabled">
                  <h1 i18n="@@Change Password">Change Password</h1>
                  <p>
                      <mat-form-field  appearance="standard">
                          <fa-icon icon="lock" matPrefix></fa-icon>
                          <input matInput i18n-placeholder="@@CURRENT PASSWORD" type="password" placeholder="CURRENT PASSWORD"
                                 formControlName="oldPassword" autocomplete="password">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <fa-icon icon="lock" matPrefix></fa-icon>
                          <input matInput i18n-placeholder="@@NEW PASSWORD" type="password" placeholder="NEW PASSWORD"
                                 formControlName="password" autocomplete="new-password">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field appearance="standard">
                          <fa-icon icon="lock" matPrefix></fa-icon>
                          <input matInput i18n-placeholder="@@CONFIRM NEW PASSWORD" type="password" placeholder="CONFIRM NEW PASSWORD"
                                 formControlName="verifyPassword" autocomplete="new-password">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-error *ngIf="failedComplexity" i18n="@@Password must be at least 6 characters">
                          Password must be at least 6 characters
                      </mat-error>
                      <mat-error *ngIf="invalidCredentials" i18n="@@Invalid credentials">Invalid credentials</mat-error>
                      <rng-backend-error-message *ngIf="genericError"></rng-backend-error-message>
                      <mat-error *ngIf="form.hasError('noMatch')" i18n="@@Passwords do not match">Passwords do not match</mat-error>
                  </p>
                  <div class="card-actions">
                      <button mat-flat-button type="button" class="cancel" routerLink="/meters" i18n="@@Back to login">Cancel</button>
                      <span>
                        <button mat-flat-button
                                class="red"
                                type="submit"
                                i18n="@@Submit"
                                [disabled]="form.invalid || form.disabled">Change</button>
                      </span>
                  </div>
              </rng-pending>
          </div>
      </form>
  `,
  styles: [`
      .card-content {
          align-self: center;
          margin: 5rem auto auto auto;
          width: 23rem;
      }

      .cancel {
          width: 48%;
          margin-right: 4%;
      }

      .red {
          width: 48%;
      }

      .card h1 {
          padding: 5%;
      }

      h1 {
          margin-bottom: 1rem;
      }

      mat-form-field {
          width: 100%;
          align-self: center;
      }

      .card-actions {
          margin-top: 1rem;
      }
  `]
})
export class ChangePasswordFormComponent implements OnInit {
  @Input() invalidCredentials = false;
  @Input() failedComplexity = false;
  @Input() genericError = false;
  @Output() submitted = new EventEmitter<PasswordChangeRequest>();
  form = new FormGroup({
    oldPassword: new FormControl(null, [Validators.required]),
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
    this.submitted.emit(this.form.value);
  }
}
