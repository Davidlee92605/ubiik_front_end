import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Meter} from '@ringo/meters/models/meter';
import {MatCheckboxChange, PageEvent, Sort} from '@angular/material';

@Component({
  selector: 'rng-meter-table',
  template: `
      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="sortData($event)">

          <!--- Note that these columns can be defined in any order.
                The actual rendered columns are set as a property on the row definition" -->

          <ng-container matColumnDef="meter_id">
              <th mat-header-cell *matHeaderCellDef i18n="@@Meter ID" mat-sort-header> Meter ID</th>
              <td mat-cell *matCellDef="let element"> {{element.meterId}} </td>
          </ng-container>

          <ng-container matColumnDef="fan_id">
              <th mat-header-cell *matHeaderCellDef i18n="@@Fan ID" mat-sort-header> Fan ID</th>
              <td mat-cell *matCellDef="let element"> {{element.fanId}} </td>
          </ng-container>

          <ng-container matColumnDef="fan_state">
              <th mat-header-cell *matHeaderCellDef i18n="@@FAN State" mat-sort-header> FAN State</th>
              <td mat-cell *matCellDef="let element"> {{element.fanState}} </td>
          </ng-container>

          <ng-container matColumnDef="meter_state">
              <th mat-header-cell *matHeaderCellDef i18n="@@Meter State" mat-sort-header> Meter State</th>
              <td mat-cell *matCellDef="let element"> {{element.meterState}} </td>
          </ng-container>

          <ng-container matColumnDef="registered">
              <th mat-header-cell *matHeaderCellDef i18n="@@Registered" mat-sort-header> Registered</th>
              <td mat-cell *matCellDef="let element"> {{element.registered}} </td>
          </ng-container>

          <ng-container matColumnDef="authenticated">
              <th mat-header-cell *matHeaderCellDef i18n="@@Authenticated" mat-sort-header> Authenticated</th>
              <td mat-cell *matCellDef="let element"> {{element.authenticated}} </td>
          </ng-container>

          <ng-container matColumnDef="last_seen">
              <th mat-header-cell *matHeaderCellDef i18n="@@Last Seen" mat-sort-header> Last Seen</th>
              <td mat-cell *matCellDef="let element"> {{element.lastSeen * 1000 | date:"short"}} </td>
          </ng-container>

          <ng-container matColumnDef="expand">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let element">
                <span *ngIf="selectableMeters">
                  <mat-checkbox (change)="onCheckRow(element, $event)"></mat-checkbox>
                </span>
              </td>
          </ng-container>

          <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions</th>
              <td mat-cell *matCellDef="let element">
                  <button *ngIf="showDetailButton" mat-icon-button (click)="onShowDetail(element, $event)">
                    <fa-icon icon="eye"></fa-icon>
                  </button>
                  <button *ngIf="showDeleteButton" mat-icon-button (click)="onDelete(element, $event)">
                    <fa-icon icon="trash"></fa-icon>
                  </button>
                  <button *ngIf="showEditButton" mat-icon-button (click)="onEdit(element, $event)">
                    <fa-icon icon="pen"></fa-icon>
                  </button>
              </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let element; columns: displayedColumns;"
              class="meter-row">
          </tr>

      </table>
      <mat-paginator *ngIf="showPaginator"
                     [disabled]="pending"
                     [pageIndex]="pageIndex"
                     [length]="dataLength"
                     [pageSize]="pageSize"
                     [pageSizeOptions]="pageSizeOptions"
                     (page)="onPageEvent($event)">
      </mat-paginator>
  `,
  styles: [`
      tr.mat-header-row {
        height: 2rem;
      }

      ::ng-deep .mat-sort-header-button {
        justify-content: start!important;
        text-transform: none;
      }

      th.mat-header-cell:last-of-type {
        padding-left: 1.25rem;
      }

      .mat-header-cell {
        font-size: 14px;
        color: #31345B;
        margin-top: 1rem;
        padding-left: 0.5rem;
      }

      td.mat-cell {
        padding-top: 3px!important;
        padding-left: 0.5rem;
      }

      tr.meter-row:not(.meter-expanded-row):hover {
          background: #f5f5f5;
      }

      tr.meter-row:not(.meter-expanded-row):active {
          background: #efefef;
      }

      .meter-row td {
          border-bottom-width: 0;
      }

      mat-checkbox {
          position: relative;
          bottom: 1px;
      }

      .meter-detail {
          overflow: hidden;
          display: flex;
      }

      .meter-symbol {
          font-weight: bold;
          font-size: 40px;
          line-height: normal;
      }

      .meter-description {
          padding: 16px;
      }

      .meter-description-attribution {
          opacity: 0.5;
      }

      dl {
          margin-left: 10%;
      }

      dt {
          font-weight: bold;
      }
  `]
})
export class MeterTableComponent implements OnInit {
  displayedColumns: string[] = ['expand', 'meter_id', 'fan_id', 'meter_state', 'fan_state', 'registered', 'authenticated', 'last_seen'];

  @Input() pageIndex = 0;
  @Input() pageSize = 0;
  @Input() dataLength = 0;
  @Input() dataSource: Meter[] = [];
  @Input() pageSizeOptions: number[] = [];
  @Input() showPaginator = true;
  @Input() showEditButton = true;
  @Input() showDetailButton = true;
  @Input() showDeleteButton = true;
  @Input() selectableMeters = true;
  @Input() pending = false;
  @Output() delete = new EventEmitter<Meter>();
  @Output() edit = new EventEmitter<Meter>();
  @Output() showDetail = new EventEmitter<Meter>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<Sort>();
  @Output() selectionChanged = new EventEmitter<{ meter: Meter, checked: boolean }>();

  constructor() {
  }

  @Input() set showActions(b: boolean) {
    if (b) {
      this.displayedColumns.push('actions');
    }
  }

  ngOnInit() {
  }

  onPageEvent(pageEvent: PageEvent) {
    console.log('page event', pageEvent);
    this.page.emit(pageEvent);
  }

  onShowDetail(meter: Meter, $event: MouseEvent) {
    this.showDetail.emit(meter);
  }

  onDelete(meter: Meter, $event: MouseEvent) {
    this.delete.emit(meter);
  }

  onEdit(meter: Meter, $event: MouseEvent) {
    this.edit.emit(meter);
  }

  onCheckRow(meter: Meter, ev: MatCheckboxChange) {
    this.selectionChanged.emit({meter: meter, checked: ev.checked});
  }

  sortData(sort: Sort) {
    this.sort.emit(sort);
  }
}
