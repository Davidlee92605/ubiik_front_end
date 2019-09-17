import * as fromRoot from '@ringo/reducers';
import * as fromLoadProfilePage from './load-profile-page.reducer';

import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';

export interface LoadProfileState {
  loadProfilePage: fromLoadProfilePage.State;
}

export interface State extends fromRoot.State {
  loadProfile: LoadProfileState;
}

export function reducers(state: LoadProfileState | undefined, action: Action): LoadProfileState {
  return combineReducers({
    loadProfilePage: fromLoadProfilePage.reducer,
  })(state, action);
}

export const selectLoadProfileState = createFeatureSelector<State, LoadProfileState>('loadProfile');

export const selectLoadProfilePageState = createSelector(
  selectLoadProfileState,
  (state: LoadProfileState) => state.loadProfilePage
);

export const selectLoadProfileError = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getLoadProfileError
);
export const selectMeterIdSearchError = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getMeterIdSearcherror
);
export const selectExportRangeError = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getExportRangeError
);
export const selectExportError = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getExportError
);

export const selectLoadProfilePagePending = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getPending
);

export const selectExportPending = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getExportPending
);


export const selectMeterSearchResults = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getMeterSearchResults
);

export const selectMeterSearchResultSize = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getMeterSearchResultSize
);

export const selectMeterSelection = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getSelectedMeterIds
);

export const selectMeterSelectionCount = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getSelectedMeterCount
);

export const selectLoadProfileData = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getLoadProfileData
);

export const selectLoadProfileTotalRows = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getLoadProfileTotalRows
);

export const selectLoadProfileQuery = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getLoadProfileQuery
);

export const selectMinDate = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getMinDate
);

export const selectMaxDate = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getMaxDate
);

export const selectDownloadURL = createSelector(
  selectLoadProfilePageState,
  fromLoadProfilePage.getDownloadURL
);

