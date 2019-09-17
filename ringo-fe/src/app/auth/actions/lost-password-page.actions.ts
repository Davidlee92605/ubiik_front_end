import {createAction, props} from '@ngrx/store';

export const lostPasswordReset = createAction(
  '[Lost Password Page] Lost Password Reset Request',
  props<{ email: string }>()
);
