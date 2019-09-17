import {AbstractControl, ValidationErrors} from '@angular/forms';

export function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const req: {password: string, verifyPassword: string } = control.value;
  return req.password === req.verifyPassword ? null : {noMatch: true};
}
