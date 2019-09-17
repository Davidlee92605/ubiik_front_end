import {createAction, props} from '@ngrx/store';
import {MeterSearchResult} from '@ringo/meters/models/meter';
import {BackendError} from '@ringo/core/models';

export const searchSuccess = createAction(
  '[Meters/API] Search Success',
  props<{ result: MeterSearchResult }>()
);

export const searchFailure = createAction(
  '[Meters/API] Search Failure',
  props<{ error: BackendError }>()
);

export const editMeterSuccess = createAction(
  '[Meters/API] Edit Meter Success'
);

export const editMeterFailure = createAction(
  '[Meters/API] Edit Meter Failure',
  props<{ error: BackendError }>()
);

export const deleteMeterSuccess = createAction(
  '[Meters/API] Delete Meter Success'
);

export const deleteMeterFailure = createAction(
  '[Meters/API] Delete Meter Failure',
  props<{ error: BackendError }>()
);


export const importMetersSuccess = createAction(
  '[Meters/API] Import Meter Success'
);

export const importMetersFailure = createAction(
  '[Meters/API] Import Meter Failure',
  props<{ error: BackendError }>()
);

export const atCommandSuccess = createAction(
  '[Meters/API] AT Command Success'
);

export const atCommandFailure = createAction(
  '[Meters/API] AT Command Failure',
  props<{ error: BackendError }>()
);

export const meterQuerySuccess = createAction(
  '[Meters/API] Query LoadProfile Success'
);

export const meterQueryFailure = createAction(
  '[Meters/API] Query LoadProfile Failure',
  props<{ error: BackendError }>()
);
