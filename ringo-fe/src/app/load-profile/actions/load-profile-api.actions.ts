import {createAction, props} from '@ngrx/store';
import {BackendError} from '@ringo/core/models';
import {DateRange, LoadProfileResponse, MeterIdsSearchResult} from '@ringo/load-profile/models';

export const meterIdSearchSuccess = createAction(
  '[LoadProfile/API] MeterID Search Success',
  props<{ result: MeterIdsSearchResult }>()
);

export const meterIdSearchFailure = createAction(
  '[LoadProfile/API] MeterID Search Failure',
  props<{ error: BackendError }>()
);

export const getLoadProfileSuccess = createAction(
  '[LoadProfile/API] Load Profile Success',
  props<{ loadProfile: LoadProfileResponse }>()
);

export const getLoadProfileFailure = createAction(
  '[LoadProfile/API] Load Profile Failure',
  props<{ error: BackendError }>()
);

export const getExportRange = createAction(
  '[LoadProfile/API] Get Export Range'
);

export const getExportRangeSuccess = createAction(
  '[LoadProfile/API] Get Export Range Success',
  props<{range: DateRange}>()
);

export const getExportRangeFailure = createAction(
  '[LoadProfile/API] Get Export Range Failure ',
  props<{ error: BackendError }>()
);

export const exportSuccess = createAction(
  '[LoadProfile/API] Export File Got Token',
  props<{url: string}>()
);

export const exportFailure = createAction(
  '[LoadProfile/API] Export File Request Failed',
  props<{ error: BackendError }>()
);

