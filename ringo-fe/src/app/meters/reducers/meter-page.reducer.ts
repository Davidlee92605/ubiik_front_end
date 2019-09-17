import {createReducer, on} from '@ngrx/store';
import {Meter} from '@ringo/meters/models/meter';
import {MeterApiActions, MeterPageActions} from '@ringo/meters/actions';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {BackendQueryParams} from '@ringo/shared/models/query';
import {BackendError} from '@ringo/core/models';

export interface State {
  pending: boolean;
  editMeterPending: boolean;
  meterQueryPending: boolean;
  importPending: boolean;
  atCommandPending: boolean;

  // delete and search(list) error
  error: BackendError | null;

  // errors for specific dialogs
  editMeterError: BackendError | null;
  importMeterError: BackendError | null;
  atCommandError: BackendError | null;
  meterQueryError: BackendError | null;

  foundIds: [];
  selectedMeters: Meter[];

  // query result
  searchResults: Meter[];
  searchResultSize: number;


  // query params
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc' | '';
  query: string;

}

export const initialState: State = {
  pending: false,
  editMeterPending: false,
  meterQueryPending: false,
  atCommandPending: false,
  importPending: false,

  error: null,
  importMeterError: null,
  editMeterError: null,
  atCommandError: null,
  meterQueryError: null,

  foundIds: [],
  selectedMeters: [],

  searchResults: [],
  searchResultSize: 0,

  pageIndex: 0,
  pageSize: PageSizeOptions[0],
  sortField: '',
  sortDirection: '',
  query: ''
};

export function filterArray(meters: Meter[], meter: Meter) {
  const idx = meters.findIndex(m => m.meterId === meter.meterId);
  console.log('filterArray', idx);
  if (idx !== -1) {
    return [...meters.slice(0, idx), ...meters.slice(idx + 1)];
  }
  return meters;
}

export const reducer = createReducer(
  initialState,
  // selection
  on(MeterPageActions.selectionChanged, (state, result): State => ({
    ...state,
    selectedMeters: result.checked ? [...state.selectedMeters, result.meter] : filterArray(state.selectedMeters, result.meter)
  })),
  // browsing
  on(MeterPageActions.pageEvent, (state, result): State => ({
    ...state,
    pending: true,
    pageIndex: result.pageEvent.pageIndex,
    pageSize: result.pageEvent.pageSize
  })),
  on(MeterPageActions.sort, (state, result): State => ({
    ...state,
    pending: true,
    sortField: result.sort.active,
    sortDirection: result.sort.direction
  })),
  on(MeterPageActions.search, (state, result): State => ({
    ...state,
    pending: true,
    query: result.query
  })),
  on(MeterApiActions.searchSuccess, (state, result): State => ({
    ...state,
    pending: false,
    searchResults: result.result.meters,
    searchResultSize: result.result.size
  })),
  on(MeterApiActions.searchFailure, (state, result): State => ({
    ...state,
    pending: false,
    error: result.error
  })),
  // delete
  on(MeterPageActions.deleteMeter, (state, result): State => ({
    ...state,
    pending: true,
    error: null,
  })),
  on(MeterApiActions.deleteMeterSuccess, (state, result): State => ({
    ...state,
    pending: false,
    error: null,
  })),
  on(MeterApiActions.deleteMeterFailure, (state, result): State => ({
    ...state,
    pending: false,
    error: result.error,
  })),
  // edit
  on(MeterPageActions.editMeter, (state, result): State => ({
    ...state,
    editMeterPending: true,
    editMeterError: null,
  })),
  on(MeterApiActions.editMeterSuccess, MeterPageActions.editMeterDialogClose, (state, result): State => ({
    ...state,
    editMeterPending: false,
    editMeterError: null,
  })),
  on(MeterApiActions.editMeterFailure, (state, result): State => ({
    ...state,
    editMeterPending: false,
    editMeterError: result.error,
  })),
  // import
  on(MeterPageActions.importMetersFromFile, (state, result): State => ({
    ...state,
    importPending: true,
    importMeterError: null,
  })),
  on(MeterApiActions.importMetersSuccess, MeterPageActions.importMeterDialogClose, (state, result): State => ({
    ...state,
    importPending: false,
    importMeterError: null,
  })),
  on(MeterApiActions.importMetersFailure, (state, result): State => ({
    ...state,
    importPending: false,
    importMeterError: result.error,
  })),
  // at
  on(MeterPageActions.atCommand, (state, result): State => ({
    ...state,
    atCommandPending: true,
    atCommandError: null,
  })),
  on(MeterApiActions.atCommandSuccess, MeterPageActions.atCommandDialogClose, (state, result): State => ({
    ...state,
    atCommandPending: false,
    atCommandError: null,
  })),
  on(MeterApiActions.atCommandFailure, (state, result): State => ({
    ...state,
    atCommandPending: false,
    atCommandError: result.error,
  })),
  // meter query
  on(MeterPageActions.sendMeterQueryRequest, (state, result): State => ({
    ...state,
    meterQueryPending: true,
    meterQueryError: null,
  })),
  on(MeterApiActions.meterQuerySuccess, MeterPageActions.meterQueryDialogClose, (state, result): State => ({
    ...state,
    meterQueryPending: false,
    meterQueryError: null,
  })),
  on(MeterApiActions.meterQueryFailure, (state, result): State => ({
    ...state,
    meterQueryPending: false,
    meterQueryError: result.error,
  })),

);

export const getError = (state: State) => state.error;
export const getEditMeterError = (state: State) => state.editMeterError;
export const getImportMeterError = (state: State) => state.importMeterError;
export const getATCommandError = (state: State) => state.atCommandError;
export const getMeterQueryError = (state: State) => state.meterQueryError;

export const getPending = (state: State) => state.pending;
export const getEditMeterPending = (state: State) => state.editMeterPending;
export const getImportMeterPending = (state: State) => state.importPending;
export const getATCommandPending = (state: State) => state.atCommandPending;
export const getMeterQueryPending = (state: State) => state.meterQueryPending;

export const getSearchResults = (state: State) => state.searchResults;
export const getSearchResultSize = (state: State) => state.searchResultSize;
export const getSelectedMeters = (state: State) => state.selectedMeters;
export const getSelectedMeterCount = (state: State) => state.selectedMeters.length;

export const getQuery = (state: State): BackendQueryParams => ({
  pageIndex: state.pageIndex,
  pageSize: state.pageSize,
  query: state.query,
  sortDirection: state.sortDirection,
  sortField: state.sortField
});

