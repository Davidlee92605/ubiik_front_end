import {createAction, props} from '@ngrx/store';
import {Meter} from '@ringo/meters/models/meter';
import {PageEvent, Sort} from '@angular/material';
import {ATCommandRequest, MeterQueryRequest} from '@ringo/meters/models/on-demand';

export const sort = createAction(
  '[Meters] Sort Data',
  props<{ sort: Sort }>()
);

export const selectionChanged = createAction(
  '[Meters] Selection Changed',
  props<{ meter: Meter, checked: boolean }>()
);

export const deleteMeter = createAction(
  '[Meters] Delete Meter',
  props<{ meter: Meter }>()
);

export const showMeterDetail = createAction(
  '[Meters] Show Meter Detail',
  props<{ meter: Meter }>()
);

export const pageEvent = createAction(
  '[Meters] Page Event',
  props<{ pageEvent: PageEvent }>()
);

export const editMeter = createAction(
  '[Meters] Edit Meter',
  props<{ meter: Meter }>()
);

export const editMeterDialogClose = createAction(
  '[Meters] Edit Meter Dialog Cancel'
);
export const importMeterDialogClose = createAction(
  '[Meters] Import Meter Dialog Cancel'
);
export const atCommandDialogClose = createAction(
  '[Meters] AT Command Dialog Cancel'
);
export const meterQueryDialogClose = createAction(
  '[Meters] Meter Query Dialog Cancel'
);

export const atCommand = createAction(
  '[Meters] AT Command',
  props<{request: ATCommandRequest}>()
);

export const sendMeterQueryRequest = createAction(
  '[Meters] Send Meter Query Request',
  props<{request: MeterQueryRequest[]}>()
);

export const addMeter = createAction(
  '[Meters] Add Meter',
  props<{ meter: Meter }>()
);

export const search = createAction(
  '[Meters] Search',
  props<{ query: string }>()
);

export const importMetersFromFile = createAction(
  '[Meters] Import Meters From File'
  // bugger: ngrx needs to be able to serialise the objects it reduces, and File isn't serialisable.
  // props<{ file: File }>()
);
