import {createAction, props} from '@ngrx/store';
import {PageEvent, Sort} from '@angular/material';

export const sort = createAction(
  '[LoadProfile] Sort Data',
  props<{ sort: Sort }>()
);

export const addSelectedMeter = createAction(
  '[LoadProfile] Add Meter to Selection',
  props<{ meterId: string }>()
);

export const removeSelectedMeter = createAction(
  '[LoadProfile] Remove Meter from Selection',
  props<{ idx: number }>()
);

export const pageEvent = createAction(
  '[LoadProfile] Page Event',
  props<{ pageEvent: PageEvent }>()
);

export const search = createAction(
  '[LoadProfile] Search For Meter',
  props<{ query: string }>()
);

export const exportLoadProfile = createAction(
  '[LoadProfile] Export File',
  props<{startDate: string, endDate: string}>()
);

export const downloadFileClicked = createAction(
  '[LoadProfilePage] Download Clicked'
);


