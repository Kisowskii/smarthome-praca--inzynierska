import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="creating-container">
      <form #loginForm="ngForm" (submit)="login(loginForm)">
        <h1 class="text-dark">Logowanie</h1>
        <mat-form-field appearance="fill">
          <mat-label class="text-dark">Twój login</mat-label>
          <input class="light-background" matInput type="text" name="login" ngModel required minlength="3" #loginInput="ngModel" />
          <mat-error class="text-dark" *ngIf="loginInput.invalid">Proszę podać login</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label class="text-dark">Twoje hasło</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" name="password" ngModel required minlength="3" #passwordInput="ngModel" />
          <button class="light-background" mat-icon-button matSuffix (click)="toggleHide()" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">
            <mat-icon class="light-background">{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error class="text-dark" *ngIf="passwordInput.invalid">Proszę podać hasło</mat-error>
        </mat-form-field>

        <button mat-raised-button color="accent" type="submit" class="dark-fill-button">Zaloguj się</button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;
  message: string;
  hide = true;
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

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
