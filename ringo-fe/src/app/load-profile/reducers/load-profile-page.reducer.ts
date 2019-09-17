import {createReducer, on} from '@ngrx/store';
import {LoadProfileApiActions, LoadProfilePageActions} from '@ringo/load-profile/actions';
import {LoadProfile} from '@ringo/load-profile/models';
import {BackendQueryParams} from '@ringo/shared/models/query';
import {BackendError} from '@ringo/core/models';

export interface State {
  pending: boolean;
  exportPending: boolean;

  loadProfileError: BackendError | null;
  meterIdSearchError: BackendError | null;
  exportRangeError: BackendError | null;
  exportError: BackendError | null;

  // meter search
  meterSearchQuery: string;
  meterSearchResults: string[]; // array of meter ids
  meterSearchResultSize: number;

  // meters to display load profile data for (we only need the ids)
  selectedMeterIds: string[];

  // query params
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc' | '';

  loadProfileData: LoadProfile[];
  loadProfileTotalRows: number;

  minDate: string | null;
  maxDate: string | null;

  downloadURL: string | null;
}

export const initialState: State = {
  pending: false,
  exportPending: false,

  loadProfileError: null,
  meterIdSearchError: null,
  exportRangeError: null,
  exportError: null,

  meterSearchQuery: '',
  meterSearchResults: [],
  meterSearchResultSize: 0,

  selectedMeterIds: [],

  pageIndex: 0,
  pageSize: 50,
  sortField: '',
  sortDirection: '',

  loadProfileData: [],
  loadProfileTotalRows: 0,

  minDate: null,
  maxDate: null,

  downloadURL: null,
};

export const reducer = createReducer(
  initialState,
  on(LoadProfilePageActions.addSelectedMeter, (state, ev): State => {
    const selectedMeterIds = [...state.selectedMeterIds];
    selectedMeterIds.push(ev.meterId);
    selectedMeterIds.sort();
    const meterSearchResults = state.meterSearchResults.filter(m => m !== ev.meterId);
    meterSearchResults.sort();
    return {
      ...state,
      selectedMeterIds: selectedMeterIds,
      meterSearchResults: meterSearchResults
    };
  }),
  on(LoadProfilePageActions.removeSelectedMeter, (state, ev): State => {
    const meterIds = [...state.selectedMeterIds];
    const searchResults = [...state.meterSearchResults];
    const gonner = meterIds.splice(ev.idx, 1);
    // add meter back into list of available meters
    searchResults.push(gonner[0]);
    meterIds.sort();
    searchResults.sort();
    return {
      ...state,
      selectedMeterIds: meterIds,
      meterSearchResults: searchResults
    };
  }),
  on(LoadProfilePageActions.pageEvent, (state, ev): State => ({
    ...state,
    pending: true,
    pageIndex: ev.pageEvent.pageIndex,
    pageSize: ev.pageEvent.pageSize
  })),
  on(LoadProfilePageActions.sort, (state, ev): State => ({
    ...state,
    pending: true,
    sortField: ev.sort.active,
    sortDirection: ev.sort.direction
  })),
  on(LoadProfilePageActions.search, (state, ev): State => ({
    ...state,
    pending: true,
    meterSearchQuery: ev.query
  })),
  on(LoadProfileApiActions.meterIdSearchSuccess, (state, result): State => ({
    ...state,
    pending: false,
    meterIdSearchError: null,
    meterSearchResults: result.result.meterIds,
    meterSearchResultSize: result.result.total
  })),
  on(LoadProfileApiActions.meterIdSearchFailure, (state, result): State => ({
    ...state,
    meterIdSearchError: result.error,
    pending: false
  })),
  on(LoadProfileApiActions.getLoadProfileSuccess, (state, result): State => ({
    ...state,
    pending: false,
    loadProfileError: null,
    loadProfileData: result.loadProfile.data,
    loadProfileTotalRows: result.loadProfile.total
  })),
  on(LoadProfileApiActions.getLoadProfileFailure, (state, result): State => ({
    ...state,
    loadProfileError: result.error,
    pending: false
  })),
  on(LoadProfileApiActions.getExportRangeSuccess, (state, payload): State => ({
    ...state,
    exportRangeError: null,
    exportPending: false,
    minDate: payload.range.minDate,
    maxDate: payload.range.maxDate
  })),
  on(LoadProfileApiActions.getExportRangeFailure, (state, payload): State => ({
    ...state,
    exportPending: false,
    exportRangeError: payload.error
  })),
  on(LoadProfilePageActions.exportLoadProfile, (state, payload): State => ({
    ...state,
    exportPending: true,
    exportRangeError: null,
    exportError: null,
  })),
  on(LoadProfileApiActions.exportSuccess, (state, payload): State => ({
    ...state,
    exportRangeError: null,
    exportError: null,
    exportPending: false,
    downloadURL: payload.url
  })),
  on(LoadProfileApiActions.exportFailure, (state, payload): State => ({
    ...state,
    exportPending: false,
    exportRangeError: null,
    exportError: payload.error
  })),
  on(LoadProfilePageActions.downloadFileClicked, (state): State => ({
    ...state,
    // once clicked, clear the URL
    downloadURL: null
  }))
);

export const getLoadProfileError = (state: State) => state.loadProfileError;
export const getExportRangeError = (state: State) => state.exportRangeError;
export const getExportError = (state: State) => state.exportError;
export const getMeterIdSearcherror = (state: State) => state.meterIdSearchError;

export const getPending = (state: State) => state.pending;
export const getExportPending = (state: State) => state.exportPending;

export const getMeterSearchQuery = (state: State) => state.meterSearchQuery;
export const getMeterSearchResults = (state: State) => state.meterSearchResults;
export const getMeterSearchResultSize = (state: State) => state.meterSearchResultSize;

export const getSelectedMeterIds = (state: State) => state.selectedMeterIds;
export const getSelectedMeterCount = (state: State) => state.selectedMeterIds.length;
export const getLoadProfileData = (state: State) => state.loadProfileData;
export const getLoadProfileTotalRows = (state: State) => state.loadProfileTotalRows;

export const getLoadProfileQuery = (state: State): BackendQueryParams => ({
  query: state.selectedMeterIds.join(','),
  pageIndex: state.pageIndex,
  pageSize: state.pageSize,
  sortDirection: state.sortDirection,
  sortField: state.sortField
});

export const getMinDate = (state: State) => state.minDate;
export const getMaxDate = (state: State) => state.maxDate;
export const getDownloadURL = (state: State) => state.downloadURL;

