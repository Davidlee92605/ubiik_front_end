import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromLoadProfile from '@ringo/load-profile/reducers';
import {PageEvent, Sort} from '@angular/material';
import {LoadProfileApiActions, LoadProfilePageActions} from '@ringo/load-profile/actions';
import {map} from 'rxjs/operators';
import {DateTime} from 'luxon';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'rng-load-profile-page',
  template: `
    <div class="wrapper">
      <div id="search">
        <rng-load-profile-search [pending]="pending$ | async"
                                 [meterIds]="searchResults$ | async"
                                 [selectedMeterIds]="selectedMeterIds$ | async"
                                 [error]="meterIdSearchError$ | async"
                                 (search)="onSearch($event)"
                                 (selectMeter)="applySelectedMeter($event)"
                                 (remove)="removeSelectedMeter($event)"></rng-load-profile-search>
      </div>
      <!--
      <div class="chart">
        <rng-load-profile-chart [pending]="pending$ | async"
                                [selectedMeterIds]="selectedMeterIds$ | async"></rng-load-profile-chart>
      </div>
      -->
      <div class="flex">
        <div class="item" id="table">
          <rng-load-profile-table [pending]="pending$ | async"
                                  [dataSource]="loadProfileData$ | async"
                                  [loadProfileTotalRows]="loadProfileTotalRows$ | async"
                                  [pageSizeOptions]="pageSizeOptions"
                                  [error]="loadProfileError$ | async"
                                  (page)="onPage($event)"
                                  (sort)="onSort($event)">
          </rng-load-profile-table>
        </div>
      </div>
      <div class="item" id="export">
        <rng-load-profile-export [minDate]="minDate$ | async"
                                 [maxDate]="maxDate$ | async"
                                 [pending]="exportPending$ | async"
                                 [error]="exportError$ | async"
                                 [rangeError]="exportRangeError$ | async"
                                 [downloadURL]="downloadURL$ | async"
                                 (downloadClicked)="onDownloadFile()"
                                 (exportData)="onExport($event)">
        </rng-load-profile-export>
      </div>
    </div>
  `,
  styles: [`
    /* remember to add grid areas when adding chart */
    .wrapper {
      padding: 2rem;
      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: 3fr 1fr;
      grid-template-areas: 'search search'
                           'table export';
      grid-gap: 1.5rem;
    }

    .item {
      background:white;
      border-radius: 0.75rem;
      box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
      padding: 2%;
    }

    #search {
      grid-area: search;
    }

    #table {
      grid-area: table;
    }

    #export {
      grid-area: export;
      padding: 2rem;
      height: 19rem;
    }
  `]
})
export class LoadProfilePageComponent implements OnInit {
  exportError$ = this.store.pipe(select(fromLoadProfile.selectExportError));
  exportRangeError$ = this.store.pipe(select(fromLoadProfile.selectExportRangeError));
  loadProfileError$ = this.store.pipe(select(fromLoadProfile.selectLoadProfileError));
  meterIdSearchError$ = this.store.pipe(select(fromLoadProfile.selectMeterIdSearchError));

  exportPending$ = this.store.pipe(select(fromLoadProfile.selectExportPending));
  pending$ = this.store.pipe(select(fromLoadProfile.selectLoadProfilePagePending));
  searchResults$ = this.store.pipe(select(fromLoadProfile.selectMeterSearchResults));
  selectedMeterIds$ = this.store.pipe(select(fromLoadProfile.selectMeterSelection));
  loadProfileData$ = this.store.pipe(
    select(fromLoadProfile.selectLoadProfileData)
  );
  loadProfileTotalRows$ = this.store.pipe(select(fromLoadProfile.selectLoadProfileTotalRows));
  minDate$ = this.store.pipe(select(fromLoadProfile.selectMinDate), map(x => DateTime.fromISO(x || '')));
  maxDate$ = this.store.pipe(select(fromLoadProfile.selectMaxDate), map(x => DateTime.fromISO(x || '')));
  downloadURL$ = this.store.pipe(select(fromLoadProfile.selectDownloadURL));

  pageSizeOptions = PageSizeOptions;


  constructor(
    private store: Store<fromLoadProfile.State>,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.onPage({length: 0, pageIndex: 0, pageSize: this.pageSizeOptions[0], previousPageIndex: 0});
    this.store.dispatch(LoadProfileApiActions.getExportRange());
    this.activatedRoute.params.subscribe((params: Params) => {
      if (!params) {
        return;
      }
      if (params.meterIds) {
        for (const meterId of params.meterIds.split(',')) {
          this.applySelectedMeter(meterId);
        }
      }
    });
  }

  onPage(pageEvent: PageEvent) {
    this.store.dispatch(LoadProfilePageActions.pageEvent({pageEvent}));
  }

  onSort(sort: Sort) {
    this.store.dispatch(LoadProfilePageActions.sort({sort}));
  }

  onSearch(query: string) {
    this.store.dispatch(LoadProfilePageActions.search({query}));
  }

  applySelectedMeter(meterId: string) {
    this.store.dispatch(LoadProfilePageActions.addSelectedMeter({meterId}));
  }

  removeSelectedMeter(idx: number) {
    this.store.dispatch(LoadProfilePageActions.removeSelectedMeter({idx}));
  }

  onExport(range: { startDate: string; endDate: string }) {
    this.store.dispatch(LoadProfilePageActions.exportLoadProfile(range));
  }

  onDownloadFile() {
    this.store.dispatch(LoadProfilePageActions.downloadFileClicked());
  }
}
