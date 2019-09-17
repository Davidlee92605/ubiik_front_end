import {createAction, props} from '@ngrx/store';
import {BackendError} from '@ringo/core/models';
import {AccountSearchResult} from '@ringo/accounts/models/account';

export const accountSearchSuccess = createAction(
  '[Account/API] Account Search Success',
  props<{ result: AccountSearchResult }>()
);

export const accountSearchFailure = createAction(
  '[Account/API] Account Search Failure',
  props<{ error: BackendError }>()
);

export const createAccountSuccess = createAction(
  '[Account/API] Create Account Success'
);

export const createAccountFailure = createAction(
  '[Account/API] Create Account Failure',
  props<{ error: BackendError }>()
);

export const editAccountSuccess = createAction(
  '[Account/API] Edit Account Success'
);

export const editAccountFailure = createAction(
  '[Account/API] Edit Account Failure',
  props<{ error: BackendError }>()
);

export const deleteAccountSuccess = createAction(
  '[Account/API] Delete Account Success'
);

export const deleteAccountFailure = createAction(
  '[Account/API] Delete Account Failure',
  props<{ error: BackendError }>()
);

export const updateUserMeterSuccess = createAction(
  '[UserMeter/API] Update UserMeter Success'
);

export const updateUserMeterFailure = createAction(
  '[UserMeter/API] Update UserMeter Failure',
  props<{ error: BackendError }>()
);

export const deleteUserMeterSuccess = createAction(
  '[UserMeter/API] Delete UserMeter Success'
);

export const deleteUserMeterFailure = createAction(
  '[UserMeter/API] Delete UserMeter Failure',
  props<{ error: BackendError }>()
);

