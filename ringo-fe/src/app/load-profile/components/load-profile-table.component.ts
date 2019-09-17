import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LoadProfileRow} from '@ringo/load-profile/models';
import {MatPaginator, PageEvent, Sort} from '@angular/material';
import {BackendError} from '@ringo/core/models';

@Component({
  selector: 'rng-load-profile-table',
  template: `
      <rng-pending [pending]="form.disabled">
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z8" matSort (matSortChange)="sortData($event)">

              <!--- Note that these columns can be defined in any order.
                    The actual rendered columns are set as a property on the row definition" -->

              <ng-container matColumnDef="tstamp">
                  <th mat-header-cell *matHeaderCellDef i18n="@@Time" mat-sort-header>Time</th>
                  <td mat-cell *matCellDef="let element"> {{element.tstamp | hesdate}} </td>
              </ng-container>

              <ng-container matColumnDef="meter_id">
                  <th mat-header-cell *matHeaderCellDef i18n="@@Meter ID" mat-sort-header>Meter ID</th>
                  <td mat-cell *matCellDef="let element"> {{element.meterId}} </td>
              </ng-container>

              <ng-container matColumnDef="received_at">
                  <th mat-header-cell *matHeaderCellDef i18n="@@Received" mat-sort-header>Received</th>
                  <td mat-cell *matCellDef="let element"> {{element.receivedAt | hesdate}} </td>
              </ng-container>

              <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef i18n="@@Status" mat-sort-header>Status</th>
                  <td mat-cell *matCellDef="let element"> {{element.status}} </td>
              </ng-container>

              <ng-container matColumnDef="fan_id">
                  <th mat-header-cell *matHeaderCellDef i18n="@@FAN ID" mat-sort-header>FAN ID</th>
                  <td mat-cell *matCellDef="let element"> {{element.fanId}} </td>
              </ng-container>

              <ng-container matColumnDef="record_id">
                  <th mat-header-cell *matHeaderCellDef i18n="@@Record ID" mat-sort-header>Record ID</th>
                  <td mat-cell *matCellDef="let element"> {{element.recordId}} </td>
              </ng-container>

              <ng-container matColumnDef="reading">
                  <th mat-header-cell *matHeaderCellDef i18n="@@Reading" mat-sort-header>Reading</th>
                  <td mat-cell *matCellDef="let element"> {{element.reading}} </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <p><rng-backend-error-message [error]="error"></rng-backend-error-message></p>
          <mat-paginator [disabled]="form.disabled"
                         [pageIndex]="pageIndex"
                         [length]="loadProfileTotalRows"
                         [pageSize]="pageSize"
                         [pageSizeOptions]="pageSizeOptions"
                         (page)="onPageEvent($event)">
          </mat-paginator>
      </rng-pending>
  `,
  styles: [`
      th.mat-header-cell {
          color: #31345B;
          font-size: 14px;
      }

      tr.mat-header-row {
          height: 2rem;
      }

      tr.mat-row:not(.meter-expanded-row):hover {
          background: #f5f5f5;
      }

      tr.mat-row:not(.meter-expanded-row):active {
          background: #efefef;
      }

      .mat-row td {
          border-bottom-width: 0;
          align-content: center;
      }

      td.mat-cell {
          padding-top: 13px;
      }
  `],
})
export class LoadProfileTableComponent implements OnInit {
  displayedColumns = ['tstamp', 'meter_id', 'fan_id', 'record_id', 'reading', 'received_at'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | undefined;

  form = new FormGroup({
    search: new FormControl(null),
  });

  @Input() error: BackendError | null = null;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageIndex = 0;
  @Input() pageSize = 0;
  @Input() loadProfileTotalRows = 0;
  @Input() dataSource: LoadProfileRow[] = [];
  @Output() page = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<Sort>();

  constructor() {
  }

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  ngOnInit() {
  }

  sortData(sort: Sort) {
    this.sort.emit(sort);
  }

  onPageEvent(pageEvent: PageEvent) {
    this.page.emit(pageEvent);
  }
}
