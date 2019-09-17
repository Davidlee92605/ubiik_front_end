import * as fromRoot from '@ringo/reducers';
import * as fromMeterPage from './meter-page.reducer';

import {Action, combineReducers, createFeatureSelector, createSelector} from '@ngrx/store';

export interface MeterState {
  meterPage: fromMeterPage.State;
}

export interface State extends fromRoot.State {
  meter: MeterState;
}

export function reducers(state: MeterState | undefined, action: Action): MeterState {
  return combineReducers({
    meterPage: fromMeterPage.reducer,
  })(state, action);
}

export const selectMeterState = createFeatureSelector<State, MeterState>('meter');

export const selectMeterPageState = createSelector(
  selectMeterState,
  (state: MeterState) => state.meterPage
);
export const selectError = createSelector(
  selectMeterPageState,
  fromMeterPage.getError
);
export const selectEditMeterError = createSelector(
  selectMeterPageState,
  fromMeterPage.getEditMeterError
);
export const selectImportMeterError = createSelector(
  selectMeterPageState,
  fromMeterPage.getImportMeterError
);
export const selectATCommandError = createSelector(
  selectMeterPageState,
  fromMeterPage.getATCommandError
);
export const selectMeterQueryError = createSelector(
  selectMeterPageState,
  fromMeterPage.getMeterQueryError
);


export const selectMeterPagePending = createSelector(
  selectMeterPageState,
  fromMeterPage.getPending
);
export const selectEditMeterPending = createSelector(
  selectMeterPageState,
  fromMeterPage.getEditMeterPending
);
export const selectImportMeterPending = createSelector(
  selectMeterPageState,
  fromMeterPage.getImportMeterPending
);
export const selectATCommandPending = createSelector(
  selectMeterPageState,
  fromMeterPage.getATCommandPending
);
export const selectMeterQueryPending = createSelector(
  selectMeterPageState,
  fromMeterPage.getMeterQueryPending
);

export const selectMeterSearchResults = createSelector(
  selectMeterPageState,
  fromMeterPage.getSearchResults
);

export const selectMeterSearchResultSize = createSelector(
  selectMeterPageState,
  fromMeterPage.getSearchResultSize
);

export const selectMeterSelection = createSelector(
  selectMeterPageState,
  fromMeterPage.getSelectedMeters
);

export const selectMeterSelectionCount = createSelector(
  selectMeterPageState,
  fromMeterPage.getSelectedMeterCount
);


export const selectMeterPageQuery = createSelector(
  selectMeterPageState,
  fromMeterPage.getQuery
);

