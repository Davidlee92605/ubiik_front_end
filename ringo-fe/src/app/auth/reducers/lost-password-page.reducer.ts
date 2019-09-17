import {AuthApiActions, LostPasswordPageActions} from '@ringo/auth/actions';
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
  on(LostPasswordPageActions.lostPasswordReset, state => ({
    ...state,
    error: null,
    pending: true,
  })),

  on(AuthApiActions.lostPasswordSuccess, state => ({
    ...state,
    error: null,
    pending: false,
  })),
  on(AuthApiActions.lostPasswordFailure, (state, {error}) => ({
    ...state,
    error: error,
    pending: false,
  }))
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
