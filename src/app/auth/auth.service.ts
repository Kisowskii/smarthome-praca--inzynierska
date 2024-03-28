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
  constructor(private http: HttpClient, private router: Router) {
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

      this.http
        .post<{ token: string; id: string }>(
          'https://api.apismarthome-wisowski-konrad.com/api/login',
          user
        )
        .subscribe((response) => {
          const token = response.token;
          // const id = response.id;
          this.token = token;
          localStorage.setItem('authToken', token);
          if (token) {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/menu']);
          }
        });
    }

    autoAuthUser() {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        return;
      }
      this.token = authToken;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      // Możesz tutaj również ustawić timer wygaśnięcia tokenu, jeśli jest dostępny
    }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    localStorage.removeItem('authToken'); // Usuń token
    this.router.navigate(['/']);
  }

  createUser(login: string, password: string, role: string): Observable<any> {
    const user = { login, password, role };
    return this.http.post<{ message: string }>('https://api.apismarthome-wisowski-konrad.com/api/users/add', user);
  }
  }
