import { createAction, props } from '@ngrx/store';
import { Credentials } from '@ringo/auth/models';

export const login = createAction(
  '[Login Page] Login',
  props<{ credentials: Credentials, redirectURL: string }>()
);
