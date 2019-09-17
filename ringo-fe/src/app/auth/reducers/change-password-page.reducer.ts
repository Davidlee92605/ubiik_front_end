import {AuthApiActions, ChangePasswordPageActions} from '@ringo/auth/actions';
import {createReducer, on} from '@ngrx/store';
import {BackendError} from '@ringo/core/models';

export interface State {
  error: BackendError | null;
  pending: boolean;
}

export const initialState: State = {
  error: null,
  pending: false,
};

export const reducer = createReducer(
  initialState,
  on(ChangePasswordPageActions.changePassword, state => ({
    ...state,
    error: null,
    pending: true,
  })),

  on(AuthApiActions.changePasswordSuccess, state => ({
    ...state,
    error: null,
    pending: false,
  })),
  on(AuthApiActions.changePasswordFailure, (state, {error}) => ({
    ...state,
    error: error,
    pending: false,
  }))
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
