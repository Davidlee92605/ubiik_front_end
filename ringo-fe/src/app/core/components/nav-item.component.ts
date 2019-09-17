import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rng-nav-item',
  template: `
      <a mat-list-item [routerLink]="routerLink" (click)="navigate.emit()">
        <fa-icon mat-list-icon [icon]="icon"></fa-icon>
        <span mat-line><ng-content></ng-content></span>
      </a>
  `,
  styles: [
    `
      .secondary {
        color: rgba(0, 0, 0, 0.54);
      }

      .mat-list-item {
        color: #31345B;
      }

      fa-icon {
        position: relative;
        bottom: 0.3rem;
      }
    `,
  ],
})
export class NavItemComponent {
  @Input() icon = '';
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';
  @Output() navigate = new EventEmitter();
}
