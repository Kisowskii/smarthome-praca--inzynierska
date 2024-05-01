import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { User } from './user.model';
import { Login } from './login.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private user: string;
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private medPath: any = '/';
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.autoAuthUser();
  }
  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getMedPath() {
    return this.medPath;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  login(login: string, password: string) {
    const user: Login = {
      login: login,
      password: password,
    };

    this.http.post<{ token: string; id: string; role: string }>('http://192.168.1.103:3000/api/login', user).subscribe((response) => {
      const { token, id, role } = response;
      this.token = token;
      this.user = role; // Store the role in the AuthService
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userRole', role); // Save role to local storage
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 1800000); // 30 minutes
      localStorage.setItem('expiration', expirationDate.toISOString());
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/menu']);
        this.setAuthTimer(1800000); // Set timer for 30 minutes
      }
    });
  }

  autoAuthUser() {
    const authToken = localStorage.getItem('authToken');
    const expirationDate = localStorage.getItem('expiration');
    if (!authToken || !expirationDate) {
      return;
    }
    const now = new Date();
    const expiresIn = new Date(expirationDate).getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authToken;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn);
    } else {
      this.logout(); // Wyloguj, jeśli token wygasł
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    localStorage.removeItem('authToken'); // Usuń token
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration'); // Usuwanie daty wygaśnięcia
    this.router.navigate(['/']);
  }

  createUser(login: string, password: string, role: string): Observable<any> {
    const user = { login, password, role };
    return this.http.post<{ message: string }>('http://192.168.0.16:3000/api/ng ', user);
  }

  private setAuthTimer(duration: number) {
    setTimeout(() => {
      this.logout();
    }, duration);
  }
}
