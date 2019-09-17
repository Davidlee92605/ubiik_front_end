import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromAssociations from '@ringo/associations/reducers';
import {MatDialog, PageEvent, Sort} from '@angular/material';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {AssociationsPageActions} from '@ringo/associations/actions';
import {Manager} from '@ringo/associations/models/associations';
import {Meter} from '@ringo/meters/models';
import {ConfirmActionDialogComponent} from '@ringo/core/components/confirm-action-dialog.component';
import {UserInfo} from '@ringo/auth/models';

@Component({
  selector: 'rng-associations-page',
  template: `
    <div class="wrapper">
      <div class="item">
          <rng-account-list [pending]="pending$ | async"
                            [dataSource]="accountData$ | async"
                            [loadProfileTotalRows]="accountTotalRows$ | async"
                            [pageSizeOptions]="pageSizeOptions"
                            (selectUser)="onSelectUser($event)"
                            (deselectUser)="onDeselectUser()"
                            (page)="onPage($event)"></rng-account-list>
      </div>
    </div>
    <div class="wrapper">
      <div class="item">
          <rng-meter-associations [pending]="pending$ | async"
                                  [pageSizeOptions]="pageSizeOptions"
                                  [meters]="userMeters$ | async"
                                  [selectedMeters]="selectedMeters$ | async"
                                  [dataLength]="userMetersLength$ | async"
                                  [isSelected]="isSelected$ | async"
                                  [selectedUser]="selectedUser$ | async"
                                  [meterIsSelected]="meterIsSelected$ | async"
                                  (sort)="onSort($event)"
                                  (page)="onPage($event)"
                                  (delete)="onDelete($event.meters, $event.user)"
                                  (selectionChanged)="onSelectMeters($event.meter, $event.checked)"></rng-meter-associations>
      </div>
    </div>
  `,
  styles: [`
    :host {
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-gap: 1.5rem;
        padding: 2rem;
     }

    .item {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
        padding: 1rem;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
    }

    .mat-dialog-container {
        width: 80rem!important;
    }
  `]
})
export class AssociationsPageComponent implements OnInit {
  pending$ = this.store.pipe(select(fromAssociations.selectPending));
  accountData$ = this.store.pipe(select(fromAssociations.selectAccounts));
  accountTotalRows$ = this.store.pipe(select(fromAssociations.selectAccountsTotalRows));
  userMeters$ = this.store.pipe(select(fromAssociations.selectUserMeters));
  userMetersLength$ = this.store.pipe(select(fromAssociations.selectUserMetersLength));
  selectedUser$ = this.store.pipe(select(fromAssociations.selectSelectedUser));
  selectedMeters$ = this.store.pipe(select(fromAssociations.selectSelectedMeters));
  pageSizeOptions = PageSizeOptions;
  isSelected$ = this.store.pipe(select(fromAssociations.selectIsSelected));
  meterIsSelected$ = this.store.pipe(select(fromAssociations.selectMeterIsSelected));

  constructor(
    private store: Store<fromAssociations.State>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.onPage({length: 0, pageIndex: 0, pageSize: this.pageSizeOptions[0], previousPageIndex: 0});
  }

  onPage(pageEvent: PageEvent) {
    this.store.dispatch(AssociationsPageActions.pageEvent({pageEvent}));
  }

  onSort(sort: Sort) {
    this.store.dispatch(AssociationsPageActions.sort({sort}));
  }

  onSelectUser(user: Manager[]) {
    this.store.dispatch(AssociationsPageActions.selectUser({user}));
  }

  onDeselectUser() {
    this.store.dispatch(AssociationsPageActions.deselectUser());
  }

  onDelete(meters: Meter[], user: UserInfo) {
    this.dialog.open<ConfirmActionDialogComponent>(ConfirmActionDialogComponent, {
      data: {
        title: 'Dissociate Meter',
        message: 'Are you sure you want to dissociate meters?'
      }
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.store.dispatch(AssociationsPageActions.dissociateMeters({meters: meters, user: user}));
        }
      });
  }

  onSelectMeters( meter: Meter, checked: boolean ) {
    this.store.dispatch(AssociationsPageActions.selectMetersTable({meter, checked}));
  }
}
