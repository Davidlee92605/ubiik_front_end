import * as fromRoot from '@ringo/reducers';
import * as fromAssociationsPage from '@ringo/associations/reducers/associations-page.reducer';

import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';

export interface AssociationsState {
  associationsPage: fromAssociationsPage.State;
}

export interface State extends fromRoot.State {
  association: AssociationsState;
}

export function reducers(state: AssociationsState | undefined, action: Action): AssociationsState {
  return combineReducers({
    associationsPage: fromAssociationsPage.reducer,
  })(state, action);
}

export const selectAssociationsState = createFeatureSelector<State, AssociationsState>('association');

export const selectAssociationsPageState = createSelector(
  selectAssociationsState,
  (state: AssociationsState) => state.associationsPage
);

export const selectError = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getError
);

export const selectPending = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getPending
);

export const selectAccounts = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getAccounts
);

export const selectAccountsTotalRows = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getAccountsTotalRows
);

export const selectAccountQuery = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getQuery
);

export const selectSelectedUser = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getSelectedUser
);


export const selectUserMeters = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getSelectedUserMeters
);

export const selectUserMetersLength = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getSelectedUserMetersLength
);

export const selectIsSelected = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getIsSelected
);

export const selectMeterSearchQuery = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getMeterSearchQuery
);

export const selectMeterSearchResults = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getMeterSearchResults
);

export const selectMeterSearchResultsSize = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getMeterSearchResultsSize
);

export const selectSelectedMeters = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getSelectedMeters
);

export const selectMeterIsSelected = createSelector(
  selectAssociationsPageState,
  fromAssociationsPage.getMeterIsSelected
);
