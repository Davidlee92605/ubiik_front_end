import {createAction, props} from '@ngrx/store';
import {PasswordResetRequest} from '@ringo/auth/models';

export const resetLostPassword = createAction(
  '[Handle Reset Link Page] Reset Lost Password',
  props<{ request: PasswordResetRequest }>()
);
