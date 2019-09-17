import * as fromRoot from '@ringo/reducers';
import * as fromAccountPage from './account-page.reducer';

import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';

export interface AccountState {
  accountPage: fromAccountPage.State;
}

export interface State extends fromRoot.State {
  account: AccountState;
}

export function reducers(state: AccountState | undefined, action: Action): AccountState {
  return combineReducers({
    accountPage: fromAccountPage.reducer,
  })(state, action);
}

export const selectAccountState = createFeatureSelector<State, AccountState>('account');

export const selectAccountPageState = createSelector(
  selectAccountState,
  (state: AccountState) => state.accountPage
);

export const selectError = createSelector(
  selectAccountPageState,
  fromAccountPage.getError
);

export const selectPending = createSelector(
  selectAccountPageState,
  fromAccountPage.getPending
);

export const selectAccounts = createSelector(
  selectAccountPageState,
  fromAccountPage.getAccounts
);

export const selectAccountsTotalRows = createSelector(
  selectAccountPageState,
  fromAccountPage.getAccountsTotalRows
);

export const selectAccountQuery = createSelector(
  selectAccountPageState,
  fromAccountPage.getQuery
);
