import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatCheckboxChange, MatDialog, PageEvent, Sort} from '@angular/material';
import {Meter} from '@ringo/meters/models';
import {Manager} from '@ringo/associations/models/associations';
import {AssociationsPageActions} from '@ringo/associations/actions';
import {AssociateMeterDialogComponent} from '@ringo/associations/dialogs/associate-meter.dialog.component';
import {Store} from '@ngrx/store';
import * as fromAssociations from '@ringo/associations/reducers';
import {UserInfo} from '@ringo/auth/models';

@Component({
  selector: 'rng-meter-associations',
  template: `
    <div class="header">
      <h2>Associated Meters</h2>
        <div class="buttons">
          <button mat-flat-button class="outline" [disabled]="!isSelected" (click)="onAssociateMeter()">
              <fa-icon icon="plus"></fa-icon>
              Associate
          </button>
          <button mat-flat-button class="outline" [disabled]="!meterIsSelected" (click)="onDeleteMultiple()">
              <fa-icon icon="minus"></fa-icon>
              Dissociate
          </button>
        </div>
    </div>
    <table mat-table [dataSource]="meters" matSort (matSortChange)="sortData($event)">

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
                <button *ngIf="showDeleteButton" mat-icon-button (click)="onDelete(element)">
                    <fa-icon icon="trash"></fa-icon>
                </button>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let element; columns: displayedColumns;"
            class="meter-row">
        </tr>

    </table>
    <mat-paginator *ngIf="showPaginator"
                   [pageIndex]="pageIndex"
                   [length]="dataLength"
                   [pageSize]="pageSize"
                   [pageSizeOptions]="pageSizeOptions"
                   (page)="onPageEvent($event)">
    </mat-paginator>  `,
  styles: [`
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

    fa-icon {
        position: relative;
        bottom: 1px;
        margin-right: 2px;
    }

    mat-checkbox {
        position: relative;
        bottom: 1.5px;
    }

    button {
        width: auto;
        text-transform: none;
        font-weight: bolder;
        margin-left: 1rem;
    }

    .mat-icon-button {
        width: 40px;
    }

    h2 {
        color: #31345B;
        margin: 1rem;
        font-weight: 600;
        font-size: 1rem;
    }

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
export class MeterAssociationsComponent implements OnInit {
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
  @Input() pageSizeOptions: number[] = [];
  @Input() pageIndex = 0;
  @Input() pageSize = 0;
  @Input() meters: Meter[] | null = [];
  @Input() dataLength = 0;
  @Input() isSelected = false;
  @Input() meterIsSelected = false;
  @Input() selectedUser: Manager[] = [];
  @Input() selectedMeters: Meter[] = [];

  @Output() page = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<Sort>();
  @Output() delete = new EventEmitter<{meters: Meter[], user: UserInfo}>();
  @Output() selectionChanged = new EventEmitter<{meter: Meter, checked: boolean}>();

  selectableMeters = true;
  showDeleteButton = true;
  showPaginator = true;
  displayedColumns: string[] = ['expand', 'meter_id', 'fan_id', 'meter_state', 'fan_state', 'registered', 'authenticated', 'last_seen', 'actions'];

  form = new FormControl;
  constructor(
    private store: Store<fromAssociations.State>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onPageEvent(pageEvent: PageEvent) {
    this.page.emit(pageEvent);
  }

  sortData(sort: Sort) {
    this.sort.emit(sort);
    console.log(sort);
  }

  onAssociateMeter() {
    this.store.dispatch(AssociationsPageActions.openDialog());
    this.dialog.open(AssociateMeterDialogComponent, {
      data: {
        selectedUser: this.selectedUser
      }
    });  }

  onDelete(meter: Meter) {
    const meters: Meter[] = [];
    meters.push(meter);
    this.delete.emit({meters: meters, user: this.selectedUser[0].user});
  }

  onDeleteMultiple() {
    this.delete.emit({meters: this.selectedMeters, user: this.selectedUser[0].user});
  }

  onCheckRow(meter: Meter, event: MatCheckboxChange) {
    this.selectionChanged.emit({meter: meter, checked: event.checked});
  }
}
