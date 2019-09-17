import {createAction, props} from '@ngrx/store';
import {PasswordChangeRequest} from '@ringo/auth/models';

export const changePassword = createAction(
  '[Auth] Change Password',
  props<{request: PasswordChangeRequest}>()
);
