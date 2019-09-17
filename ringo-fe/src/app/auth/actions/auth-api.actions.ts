import {createAction, props} from '@ngrx/store';
import {UserInfo} from '@ringo/auth/models';
import {BackendError} from '@ringo/core/models';

// API actions

export const loginSuccess = createAction(
  '[Auth/API] Login Success'
);

export const loginFailure = createAction(
  '[Auth/API] Login Failure',
  props<{error: BackendError}>()
);

// not logged in, redirect to login
export const loginRedirect = createAction(
  '[Auth/API] Login Redirect',
  props<{redirectURL: string}>()
);

export const recievedToken = createAction(
  '[Auth/API] Received Token',
  props<{token: string}>()
);

export const parsedUserInfo = createAction(
  '[Auth/API] Parsed User Info',
  props<{userInfo: UserInfo}>()
);

export const changePasswordSuccess = createAction(
  '[Auth/API] Change Password Success'
);

export const changePasswordFailure = createAction(
  '[Auth/API] Change Password Failure',
  props<{error: BackendError}>()
);

export const lostPasswordSuccess = createAction(
  '[Auth/API] Lost Password Success'
);

export const lostPasswordFailure = createAction(
  '[Auth/API] Lost Password Failure',
  props<{error: BackendError}>()
);

export const resetPasswordSuccess = createAction(
  '[Auth/API] Reset Password Success'
);

export const resetPasswordFailure = createAction(
  '[Auth/API] Reset Password Failure',
  props<{error: BackendError}>()
);
