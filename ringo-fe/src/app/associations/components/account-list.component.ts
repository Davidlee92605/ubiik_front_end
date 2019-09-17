import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatListOption, MatPaginator, MatSelectionList, PageEvent} from '@angular/material';
import {Manager} from '@ringo/associations/models/associations';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'rng-account-list',
  template: `
    <h1>Select Account</h1>
    <mat-selection-list (selectionChange)="applySelection(selectedUser)" [(ngModel)]="selectedUser">
        <mat-list-option [value]="user" *ngFor="let user of dataSource">
            <mat-icon matListIcon>person</mat-icon>
            <h2>{{user.user.name}}</h2>
            <p>{{user.user.email}}</p>
        </mat-list-option>
    </mat-selection-list>
    <mat-paginator [disabled]="form.pending"
                   [pageIndex]="pageIndex"
                   [length]="loadProfileTotalRows"
                   [pageSize]="pageSize"
                   [pageSizeOptions]="pageSizeOptions"
                   (page)="onPageEvent($event)">
    </mat-paginator>
  `,
  styles: [`
    h1 {
        font-size: 1rem!important;
        font-weight: 600;
        text-align: left;
        margin: 1rem;
    }
    h2 {
        color: #31345B;
    }
    p {
        font-size: 0.75rem!important;
        color: #999999;
    }
  `]
})
export class AccountListComponent implements OnInit {
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  constructor() { }
  form = new FormGroup({
    search: new FormControl(null),
  });
  selectedUser: Manager[] = [];

  @ViewChild(MatSelectionList, {static: true}) selectionList: MatSelectionList | undefined;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | undefined;

  @Input() pageSizeOptions: number[] = [];
  @Input() pageIndex = 0;
  @Input() pageSize = 0;
  @Input() loadProfileTotalRows = 0;
  @Input() dataSource: Manager[] = [];

  @Output() page = new EventEmitter<PageEvent>();
  @Output() selectUser = new EventEmitter<Manager[]>();
  @Output() deselectUser = new EventEmitter();

  ngOnInit() {
    // @ts-ignore
    this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  onPageEvent(pageEvent: PageEvent) {
    this.page.emit(pageEvent);
  }

  applySelection(user: Manager[]) {
    if (user.length !== 0) {
      this.selectUser.emit(this.selectedUser);
    } else {
      this.deselectUser.emit();
    }
  }
}
