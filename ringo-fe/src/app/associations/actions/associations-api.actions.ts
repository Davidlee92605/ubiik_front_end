import {createAction, props} from '@ngrx/store';
import {BackendError} from '@ringo/core/models';
import {MeterSearchResult} from '@ringo/meters/models';
import {Manager} from '@ringo/associations/models/associations';

export const accountSearchSuccess = createAction(
  '[Associations/API] Account Search Success',
  props<{ result: Manager[] }>()
);

export const accountSearchFailure = createAction(
  '[Associations/API] Account Search Failure',
  props<{ error: BackendError }>()
);

export const meterSearchSuccess = createAction(
  '[Associations/API] Meter Search Success',
  props<{ result: MeterSearchResult }>()
);

export const meterSearchFailure = createAction(
  '[Associations/API] Meter Search Failure',
  props<{ error: BackendError }>()
);

export const associateMetersSuccess = createAction(
  '[Associations/API] Meter Association Success',
);

export const associateMetersFailure = createAction(
  '[Associations/API] Meter Association Failure',
  props<{ error: BackendError }>()
);

export const dissociateMetersSuccess = createAction(
  '[Associations/API] Meter Dissociation Success',
);

export const dissociateMetersFailure = createAction(
  '[Associations/API] Meter Dissociation Failure',
  props<{ error: BackendError }>()
);
