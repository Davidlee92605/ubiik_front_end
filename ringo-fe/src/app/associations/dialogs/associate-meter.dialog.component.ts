import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Store, select} from '@ngrx/store';
import * as fromAssociations from '@ringo/associations/reducers';
import {AssociationsApiActions, AssociationsPageActions} from '@ringo/associations/actions';
import {MAT_DIALOG_DATA, MatDialogRef, PageEvent} from '@angular/material';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {Meter} from '@ringo/meters/models';
import {Actions, ofType} from '@ngrx/effects';
import {takeUntilDestroyed} from '@ringo/shared';

@Component({
  selector: 'rng-associate-meter.dialog',
  template: `
      <form [formGroup]="form" (submit)="onSearch(form.value)">
          <mat-form-field>
              <input matInput  formControlName="search" type="text" placeholder="Filter Meter IDs" i18n-placeholder="@@Filter Meter IDs">
              <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
      </form>
    <mat-selection-list (selectionChange)="selectionChange(selectMeters)" [(ngModel)]="selectMeters">
        <mat-list-option [value]='meter' *ngFor="let meter of meterSearchResults$ | async">
            {{meter.meterId}}
        </mat-list-option>
    </mat-selection-list>
    <mat-paginator [disabled]="form.pending"
                   [pageIndex]="pageIndex"
                   [length]="meterSearchResultsSize$ | async"
                   [pageSize]="pageSize"
                   [pageSizeOptions]="pageSizeOptions"
                   (page)="onPage($event)">
    </mat-paginator>
    <mat-dialog-actions>
        <button mat-flat-button class="cancel" (click)="close()">Cancel</button>
        <button mat-flat-button class="red" (click)="associateMeters()">Associate</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
        width: 100%;
    }
  `]
})
export class AssociateMeterDialogComponent implements OnInit, OnDestroy {
  meterSearchResults$ = this.store.pipe(select(fromAssociations.selectMeterSearchResults));
  meterSearchResultsSize$ = this.store.pipe(select(fromAssociations.selectMeterSearchResultsSize));
  pageSizeOptions = PageSizeOptions;
  selectMeters: Meter[] = [];

  @Input() pageIndex = 0;
  @Input() pageSize = 0;

  @Output() page = new EventEmitter<PageEvent>();

  form = new FormGroup({
    search: new FormControl(null),
  });

  constructor(
    private store: Store<fromAssociations.State>,
    private dialog: MatDialogRef<AssociateMeterDialogComponent>,
    private actions$: Actions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialog.disableClose = true;
    this.actions$
      .pipe(
        ofType(AssociationsApiActions.associateMetersSuccess),
        takeUntilDestroyed(this)
      )
      .subscribe(() => this.close());
  }

  ngOnInit() {
    this.onPage({length: 0, pageIndex: 0, pageSize: this.pageSizeOptions[0], previousPageIndex: 0});
    console.log(this.data.selectedUser[0].user);
  }

  ngOnDestroy(): void {
  }

  onPage(dialogPageEvent: PageEvent) {
    this.store.dispatch(AssociationsPageActions.dialogPageEvent({dialogPageEvent}));
  }

  onSearch(query: string) {
    this.store.dispatch(AssociationsPageActions.searchMeters({query}));
  }

  selectionChange(meters: Meter[]) {
    this.store.dispatch(AssociationsPageActions.selectMetersDialog({meters}));
  }

  close() {
    this.store.dispatch(AssociationsPageActions.closeDialog());
    this.dialog.close();
  }

  associateMeters() {
    this.store.dispatch(AssociationsPageActions.associateMeters({meters: this.selectMeters, user: this.data.selectedUser[0].user}));
  }
}
