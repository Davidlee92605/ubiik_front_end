import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BackendError, Role} from '@ringo/core/models';
import {UserInfo} from '@ringo/auth/models';

const validateRole = (control: AbstractControl): ValidationErrors | null => {
  if (!Object.values(Role).includes(control.value)) {
    return {invalidRole: true};
  }
  return null;
};

@Component({
  selector: 'rng-account-dialog',
  template: `
      <form [formGroup]="form" (submit)="submit()">
          <h1 mat-dialog-title *ngIf="!form.value.id" i18n="@@Create Account">Create Account</h1>
          <h1 mat-dialog-title *ngIf="form.value.id" i18n="@@Edit Account">Edit Account</h1>

          <mat-dialog-content>
              <rng-pending [pending]="form.disabled">
                  <p>
                      <mat-form-field>
                          <input matInput formControlName="name" i18n-placeholder="@@Real name" placeholder="Real name" type="text">
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field>
                          <input matInput formControlName="email" i18n-placeholder="@@Email address" placeholder="Email address"
                                 type="email">
                      </mat-form-field>
                  </p>
                  <p class="role-select">
                      <mat-select formControlName="role" i18n-placeholder="@@Role" placeholder="Role">
                          <mat-option *ngFor="let r of roles" [value]="r">{{r}}</mat-option>
                      </mat-select>
                  </p>
                  <rng-backend-error-message [error]="error"></rng-backend-error-message>
              </rng-pending>
          </mat-dialog-content>
          <mat-dialog-actions>
              <button mat-flat-button class="cancel" [mat-dialog-close]="false" i18n="@@Cancel" [disabled]="form.disabled">Cancel</button>
              <button mat-flat-button class="outline" *ngIf="!form.value.id" [disabled]="form.invalid || form.pristine || form.disabled"
                      i18n="@@Create Account">
                  Create Account
              </button>
              <button mat-flat-button class="outline" *ngIf="form.value.id" [disabled]="form.invalid || form.pristine || form.disabled"
                      i18n="@@Edit Account">
                  Edit Account
              </button>
          </mat-dialog-actions>
      </form>
  `,
  styles: [`
      h1 {
          margin-top: 1rem;
      }

      .role-select {
          padding: 2rem 0;
      }

    mat-form-field {
        width: 100%;
    }
  `]
})
export class AccountDialogComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email, Validators.required]),
    role: new FormControl(null, [validateRole])
  });
  roles = Object.values(Role).filter(r => r !== Role.ROOT);
  error: BackendError | null = null;
  private callback: (account: UserInfo) => null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      data: UserInfo | undefined,
      cb: (account: UserInfo) => null
    }
  ) {
    if (data.data) {
      this.form.patchValue(data.data);
    }
    this.callback = data.cb;
  }

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  submit() {
    this.callback(this.form.value);
  }

  ngOnInit() {
  }

}
