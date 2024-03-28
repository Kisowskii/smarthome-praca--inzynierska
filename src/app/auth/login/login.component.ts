import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="creating-container">
      <form #loginForm="ngForm" (submit)="login(loginForm)">
        <h1>Logowanie</h1>
        <mat-form-field appearance="fill">
          <mat-label>Twój login</mat-label>
          <input matInput type="text" name="login" ngModel required minlength="3" #loginInput="ngModel" />
          <mat-error *ngIf="loginInput.invalid">Proszę podać login</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Twoje hasło</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" name="password" ngModel required minlength="3" #passwordInput="ngModel" />
          <button mat-icon-button matSuffix (click)="toggleHide()" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">
            <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="passwordInput.invalid">Proszę podać hasło</mat-error>
        </mat-form-field>

        <button mat-raised-button color="accent" type="submit">Zaloguj się</button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;
  message: string;
  hide = true;
  constructor(public authService: AuthService, public router: Router) {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.login, form.value.password);
  }
  toggleHide() {
    this.hide = !this.hide;
  }
}
