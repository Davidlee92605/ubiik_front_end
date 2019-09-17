import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent, Sort} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {UserInfo} from '@ringo/auth/models';
import {LoadProfileRow} from '@ringo/load-profile/models/load-profile';

@Component({
  selector: 'rng-account-table',
  template: `
      <div class="wrapper">
          <rng-pending [pending]="form.disabled">
              <table mat-table [dataSource]="dataSource" class="mat-elevation-z8" matSort (matSortChange)="sortData($event)">

                  <ng-container matColumnDef="name">
                      <mat-header-cell *matHeaderCellDef i18n="@@Name">Name</mat-header-cell>
                      <mat-cell *matCellDef="let row">{{row.name}}</mat-cell>
                  </ng-container>

                  <ng-container matColumnDef="email">
                      <mat-header-cell *matHeaderCellDef i18n="@@Email">Email</mat-header-cell>
                      <mat-cell *matCellDef="let row">{{row.email}}</mat-cell>
                  </ng-container>

                  <ng-container matColumnDef="role">
                      <mat-header-cell *matHeaderCellDef i18n="@@Role">Role</mat-header-cell>
                      <mat-cell *matCellDef="let row">{{row.role}}</mat-cell>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                      <mat-header-cell *matHeaderCellDef i18n="@@Actions">Actions</mat-header-cell>
                      <mat-cell *matCellDef="let row">
                          <button mat-icon-button [disabled]="row.email == 'root'" (click)="onDelete(row.id)"
                                  i18n-title="@@Delete account" title="Delete account">
                              <fa-icon icon="trash"></fa-icon>
                          </button>
                          <button mat-icon-button [disabled]="row.email == 'root'" (click)="onEdit(row)"
                                  i18n-title="@@Edit account" title="Edit account">
                              <fa-icon icon="pen"></fa-icon>
                          </button>
                          <!--          <button *ngIf="row.role === 'manager'" mat-icon-button [routerLink]="['/user-meter', row.email]"
                                            i18n-title="@@Edit meter associations" title="Edit meter associations">
                                      <i class="fas fa-clipboard-list"></i>
                                    </button>-->
                      </mat-cell>
                  </ng-container>

                  <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

              </table>

              <mat-paginator [disabled]="form.pending"
                             [pageIndex]="pageIndex"
                             [length]="loadProfileTotalRows"
                             [pageSize]="pageSize"
                             [pageSizeOptions]="pageSizeOptions"
                             (page)="onPageEvent($event)">
              </mat-paginator>
          </rng-pending>
      </div>
  `,
  styles: [``]
})
export class AccountTableComponent implements OnInit {
  displayedColumns = ['name', 'email', 'role', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | undefined;

  form = new FormGroup({
    search: new FormControl(null),
  });

  @Input() pageSizeOptions: number[] = [];
  @Input() pageIndex = 0;
  @Input() pageSize = 0;
  @Input() loadProfileTotalRows = 0;
  @Input() dataSource: LoadProfileRow[] = [];
  @Output() page = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<Sort>();
  @Output() deleteAccount = new EventEmitter<number>();
  @Output() editAccount = new EventEmitter<UserInfo>();

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

  onDelete(id: number) {
    this.deleteAccount.emit(id);
  }

  onEdit(account: UserInfo) {
    this.editAccount.emit(account);
  }
}
