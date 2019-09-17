import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rng-sidenav',
  template: `
    <nav>
      <div class="title">
        <h3>Power Meter</h3>
        <h4>Management System</h4>
      </div>
      <mat-nav-list>
        <ng-content></ng-content>
      </mat-nav-list>
    </nav>
  `,
  styles: [
    `
      nav {
        width: 100%;
        background-color: #EDEDED;
      }

      .title {
        margin: 8%;
        font-size: 1rem;
      }

      h3 {
        font-weight: normal;
      }

      h4{
        font-weight: lighter;
      }
    `,
  ],
})
export class SidenavComponent {
  @Input() open = false;
  @Output() closeMenu = new EventEmitter();
}
