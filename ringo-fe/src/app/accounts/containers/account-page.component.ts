import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, PageEvent, Sort} from '@angular/material';
import {AccountDialogComponent} from '@ringo/accounts/dialogs/account-dialog.component';
import {UserInfo} from '@ringo/auth/models';
import {select, Store} from '@ngrx/store';
import * as fromAccounts from '@ringo/accounts/reducers';
import {AccountApiActions, AccountPageActions} from '@ringo/accounts/actions';
import {takeUntilDestroyed} from '@ringo/shared';
import {Actions, ofType} from '@ngrx/effects';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {ConfirmActionDialogComponent} from '@ringo/core/components/confirm-action-dialog.component';

@Component({
  selector: 'rng-account-page',
  template: `
    <div class="wrapper">
        <div class="top">
          <h1 i18n="@@Accounts">Accounts</h1>
          <div class="button-row">
              <button mat-flat-button class="outline" (click)="createDialog()" i18n="@@Create account">Create account</button>
          </div>
        </div>
        <div class="table">
          <rng-account-table [pending]="pending$ | async"
                             [dataSource]="accountData$ | async"
                             [loadProfileTotalRows]="accountTotalRows$ | async"
                             [pageSizeOptions]="pageSizeOptions"
                             (deleteAccount)="onDeleteAccount($event)"
                             (editAccount)="editDialog($event)"
                             (page)="onPage($event)"
                             (sort)="onSort($event)"></rng-account-table>
        </div>
    </div>
  `,
  styles: [`
    .wrapper {
        display: grid;
        grid-template-rows: auto auto;
        padding: 2rem;
        grid-gap: 1.5rem;
    }

    .top {
        display: flex;
        justify-content: space-between;
    }

    h1 {
        align-self: center;
        font-size: 1rem;
    }
    
    .table {
        background: white;
        box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
        padding: 1rem;
        border-radius: 0.75rem;
    ;
    }
    
    button {
        width: auto;
    }
  `]
})
export class AccountPageComponent implements OnInit, OnDestroy {
  private accountDlg: MatDialogRef<AccountDialogComponent, any> | null = null;
  private error$ = this.store.pipe(select(fromAccounts.selectError));
  pending$ = this.store.pipe(select(fromAccounts.selectPending));
  accountData$ = this.store.pipe(select(fromAccounts.selectAccounts));
  accountTotalRows$ = this.store.pipe(select(fromAccounts.selectAccountsTotalRows));
  pageSizeOptions = PageSizeOptions;

  constructor(
    private store: Store<fromAccounts.State>,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    this.actions$
      .pipe(
        ofType(
          AccountApiActions.createAccountSuccess,
          AccountApiActions.editAccountSuccess,
        ),
        takeUntilDestroyed(this)
      )
      .subscribe(() => this.accountDlg ? this.accountDlg.close() : null);
  }

  ngOnInit() {
    // manually push these values to the dialog if it's open
    this.error$
      .pipe(
        takeUntilDestroyed(this),
      )
      .subscribe((error) => {
        if (this.accountDlg) {
          this.accountDlg.componentInstance.error = error;
        }
      });

    this.pending$
      .pipe(
        takeUntilDestroyed(this),
      )
      .subscribe((pending) => {
        if (this.accountDlg) {
          this.accountDlg.componentInstance.pending = pending;
        }
      });

    // initialise account data
    this.onPage({length: 0, pageIndex: 0, pageSize: this.pageSizeOptions[0], previousPageIndex: 0});
  }

  ngOnDestroy(): void {
  }

  createDialog() {
    this.accountDlg = this.dialog.open(AccountDialogComponent, {data: {cb: this.onCreateAccount.bind(this)}});
    this.accountDlg
      .afterClosed()
      .subscribe(() => this.accountDlg = null);
  }

  editDialog(account: UserInfo) {
    this.accountDlg = this.dialog.open(AccountDialogComponent, {
      data: {
        cb: this.onUpdateAccount.bind(this),
        data: account
      }
    });
    this.accountDlg
      .afterClosed()
      .subscribe(() => this.accountDlg = null);
  }

  onCreateAccount(account: UserInfo) {
    this.store.dispatch(AccountPageActions.createAccount({account}));
  }

  onUpdateAccount(account: UserInfo) {
    this.store.dispatch(AccountPageActions.updateAccount({account}));
  }

  onDeleteAccount(accountId: number) {
    this.dialog.open<ConfirmActionDialogComponent>(ConfirmActionDialogComponent, {data:
        {
          title: 'Delete Account',
          message: 'Are you sure you want to delete this account?'
        }
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          console.log('account deleted');
          this.store.dispatch(AccountPageActions.deleteAccount({accountId}));
        }
      });
  }

  onPage(pageEvent: PageEvent) {
    this.store.dispatch(AccountPageActions.pageEvent({pageEvent}));
  }

  onSort(sort: Sort) {
    this.store.dispatch(AccountPageActions.sortEvent({sort}));
  }
}
