import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  template: `
    <div class="creating-container">
      <button mat-icon-button (click)="goBack()" class="back-button">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <form #signupForm="ngForm" (submit)="signup(signupForm)">
        <h1>Tworzenie nowego konta</h1>
        <mat-form-field appearance="fill">
          <mat-label>Login użytkownika</mat-label>
          <input
            matInput
            type="text"
            name="login"
            ngModel
            required
            minlength="3"
            placeholder="Login"
            #loginInput="ngModel"
          />
          <mat-error *ngIf="loginInput.invalid">Proszę podać login</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Hasło użytkownika</mat-label>
          <input
            matInput
            type="password"
            name="password"
            ngModel
            required
            minlength="3"
            placeholder="Hasło"
            #passwordInput="ngModel"
          />
          <mat-error *ngIf="passwordInput.invalid">Proszę podać hasło</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Twoja rola</mat-label>
          <mat-select name="role" ngModel required #roleInput="ngModel">
            <mat-option value="admin">admin</mat-option>
            <mat-option value="user">user</mat-option>
          </mat-select>
          <mat-error *ngIf="roleInput.invalid">Proszę wybrać rolę</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          Zarejestruj się
        </button>
      </form>
    </div>
`,
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router 
  ) {}
  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.login, form.value.password, form.value.role)
      .subscribe({
        next: () => {
          this.snackBar.open('Użytkownik dodany pomyślnie', 'Zamknij', { duration: 3000, panelClass: ['custom-snackbar'] });
          // Dodatkowa logika, np. przekierowanie
        },
        error: (error) => {
          // Tutaj obsługujemy błąd
          if (error.status === 409) {
            this.snackBar.open('Użytkownik o takim loginie już istnieje.', 'Zamknij', { duration: 3000, panelClass: ['custom-snackbar'] },);
          } else {
            this.snackBar.open('Wystąpił błąd podczas dodawania użytkownika.', 'Zamknij', { duration: 3000, panelClass: ['custom-snackbar'] });
          }
        }
      });
  }
  goBack() {
    this.router.navigate(['/menu']);
  }
  ngOnInit(): void {}
}
