import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rng-lost-password-link-sent',
  template: `
    <img src="../../../assets/ringo-logo.jpg" alt="logo">
    <div class="title">
      <h2>Power Meter <span>Management System</span></h2>
    </div>
    <div class="card-content done-msg">
      <p class="lock-img"><fa-icon icon="envelope"></fa-icon></p>
      <p i18n="@@Password Sent To Your Email">
        Password<br> Sent To Your Email
      </p>
      <p class="back-link">
        <button type="button" class="red" routerLink="/login" i18n="@@Back to login">Back to login</button>
      </p>
    </div>
  `,
  styles: [`
    .done-msg {
      padding-bottom: 2rem;
    }

    .lock-img {
      text-align: center;
      font-size: 3rem;
    }
    
    p {
      font-size: 18px;
      text-align: center;
      margin-bottom: 1rem;
    }

    .card-content {
      margin: 80px auto auto auto;
      left: 0;
      right: 0;
      position: absolute;
      width: 370px;
      height: 290px;
    }
  `]
})
export class LostPasswordLinkSentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
