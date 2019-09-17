import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromMeter from '@ringo/meters/reducers';
import {MatDialog, PageEvent, Sort} from '@angular/material';
import {MeterPageActions} from '@ringo/meters/actions';
import {Meter} from '@ringo/meters/models/meter';
import {map, take} from 'rxjs/operators';
import {ATCommandDialogComponent} from '@ringo/meters/dialogs/at-command-dialog.component';
import {EditMeterDialogComponent} from '@ringo/meters/dialogs/edit-meter-dialog.component';
import {QueryMeterDialogComponent} from '@ringo/meters/dialogs/query-meter-dialog.component';
import {MeterInfoDialogComponent} from '@ringo/meters/dialogs/meter-info-dialog.component';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {MeterImportDialogComponent} from '@ringo/meters/dialogs/meter-import-dialog.component';
import {ConfirmActionDialogComponent} from '@ringo/core/components/confirm-action-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'rng-meter-list-page',
  template: `
      <div>
          <rng-meter-import-bar [pending]="pending$ | async"
                                (addMeter)="onAddMeter()"
                                (importMeter)="onImportMeter()"></rng-meter-import-bar>
      </div>
      <div id="search">
          <rng-meter-search-bar (search)="onSearch($event)" [pending]="pending$ | async"></rng-meter-search-bar>
      </div>
      <div id="tool">
          <rng-meter-tool-bar [pending]="pending$ | async"
                              [metersSelected]="metersSelected$ | async"
                              (loadProfile)="showLoadProfile()"
                              (queryMeter)="onQueryMeter()"
                              (sendCommand)="onCommand()"></rng-meter-tool-bar>
      </div>
      <div id="table">
          <rng-pending [pending]="pending$ | async">
              <rng-meter-table [pending]="pending$ | async"
                               [dataSource]="searchResults$ | async"
                               [dataLength]="searchResultSize$ | async"
                               [showActions]="true"
                               [pageSizeOptions]="pageSizeOptions"
                               (edit)="onEdit($event)"
                               (page)="onPage($event)"
                               (sort)="onSort($event)"
                               (showDetail)="onShowDetail($event)"
                               (delete)="onDelete($event)"
                               (selectionChanged)="onSelectionChanged($event)"></rng-meter-table>
          </rng-pending>

      </div>
  `,
  styles: [`
      :host {
          padding: 2rem;
          display: grid;
          grid-template-rows: 1fr 0.75fr 1fr auto;
          grid-gap: 1.5rem;
      }

      #search {
          background: white;
          border-radius: 0.75rem;
          padding-right: 0.5rem;
          padding-left: 0.5rem;
          box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
          height: 3rem;
      }

      #table {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
          padding: 1rem;
      }
  `]
})
export class MeterPageComponent implements OnInit, OnDestroy {
  pending$ = this.store.pipe(select(fromMeter.selectMeterPagePending));
  searchResults$ = this.store.pipe(select(fromMeter.selectMeterSearchResults));
  searchResultSize$ = this.store.pipe(select(fromMeter.selectMeterSearchResultSize));
  metersSelected$ = this.store.pipe(select(fromMeter.selectMeterSelectionCount));
  pageSizeOptions = PageSizeOptions;

  constructor(
    private store: Store<fromMeter.State>,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // kick start some data
    this.onPage({length: 0, pageIndex: 0, pageSize: this.pageSizeOptions[0], previousPageIndex: 0});
  }

  ngOnDestroy() {
  }

  onImportMeter() {
    this.dialog.open(MeterImportDialogComponent);
  }

  onAddMeter() {
    this.dialog.open(EditMeterDialogComponent);
  }

  showLoadProfile() {
    this.store.pipe(
      select(fromMeter.selectMeterSelection),
      take(1),
      map(selected => selected.map(m => m.meterId).join(',')),
    )
      .subscribe(meterIds => this.router.navigate(['/load-profile', {meterIds: meterIds}]));
  }

  onQueryMeter() {
    this.dialog.open(QueryMeterDialogComponent);
  }

  onCommand() {
    this.dialog.open(ATCommandDialogComponent);
  }

  onEdit(meter: Meter) {
    this.dialog.open(EditMeterDialogComponent, {data: meter});
  }

  onPage(pageEvent: PageEvent) {
    this.store.dispatch(MeterPageActions.pageEvent({pageEvent}));
  }

  onShowDetail(meter: Meter) {
    this.dialog.open<MeterInfoDialogComponent, any, Meter>(MeterInfoDialogComponent, {data: meter});
  }

  onDelete(meter: Meter) {
    this.dialog.open<ConfirmActionDialogComponent>(ConfirmActionDialogComponent, {
      data: {
        title: 'Delete Meter',
        message: 'Are you sure you want to delete this meter?'
      }
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          console.log('meter deleted');
          this.store.dispatch(MeterPageActions.deleteMeter({meter}));
        }
      });
  }

  onSelectionChanged(change: { meter: Meter, checked: boolean }) {
    this.store.dispatch(MeterPageActions.selectionChanged(change));
  }

  onSort(sort: Sort) {
    this.store.dispatch(MeterPageActions.sort({sort}));
  }

  onSearch(search: { query: string }) {
    console.log('searching', search);
    this.store.dispatch(MeterPageActions.search(search));
  }
}
