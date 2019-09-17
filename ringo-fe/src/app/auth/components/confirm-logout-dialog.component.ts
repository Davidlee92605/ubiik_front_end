import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rng-confirm-logout-dialog',
  template: `
    <h2 mat-dialog-title>Logout</h2>
    <mat-dialog-content>Are you sure you want to logout?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-flat-button class="cancel" [mat-dialog-close]="false">Cancel</button>
      <button mat-flat-button class="outline" [mat-dialog-close]="true">OK</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      text-align: center;
    }

    mat-dialog-content {
      text-align: center;
      margin-bottom: 1rem;
    }
  `]
})
export class ConfirmLogoutDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
