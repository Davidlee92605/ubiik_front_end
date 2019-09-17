import {createAction, props} from '@ngrx/store';
import {PageEvent, Sort} from '@angular/material';
import {Manager} from '@ringo/associations/models/associations';
import {Meter} from '@ringo/meters/models';
import {UserInfo} from '@ringo/auth/models';

export const pageEvent = createAction(
  '[AssociationsPage] Page Event',
  props<{ pageEvent: PageEvent }>()
);

export const dialogPageEvent = createAction(
  '[AssociationsPage] Dialog Event',
  props<{ dialogPageEvent: PageEvent }>()
);

export const sort = createAction(
  '[AssociationsPage] Sort Data',
  props<{ sort: Sort }>()
);

export const getAccountsList = createAction(
  '[AssociationsPage] Get Manager List'
);

export const selectUser = createAction(
  '[AssociationsPage] Select User',
  props<{ user: Manager[] }>()
);

export const deselectUser = createAction(
  '[AssociationsPage] Deselect User',
);

export const openDialog = createAction(
  '[AssociationsPage] Open Dialog',
);

export const searchMeters = createAction(
  '[AssociationsPage] Search Meters',
  props<{ query: string }>()
);

export const closeDialog = createAction(
  '[AssociationsPage] Close Dialog',
);

export const selectMetersDialog = createAction(
  '[AssociationsPage] Meters Selection Changed',
  props<{ meters: Meter[] }>()
);

export const selectMetersTable = createAction(
  '[AssociationsPage] Meters Selection Changed',
  props<{ meter: Meter, checked: boolean }>()
);

export const associateMeters = createAction(
  '[AssociationsPage] Associate Meters',
  props<{ meters: Meter[], user: UserInfo }>()
);

export const dissociateMeters = createAction(
  '[AssociationsPage] Dissociate Meters',
  props<{ meters: Meter[], user: UserInfo }>()
);
