import { AuthApiActions, LoginPageActions } from '@ringo/auth/actions';
import { createReducer, on } from '@ngrx/store';
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
  on(LoginPageActions.login, state => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(AuthApiActions.loginSuccess, state => ({
    ...state,
    error: null,
    pending: false,
  })),
  on(AuthApiActions.loginFailure, (state, error) => ({
    ...state,
    error: error.error,
    pending: false,
  }))
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
