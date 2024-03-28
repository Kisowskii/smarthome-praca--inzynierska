import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { User } from './user.model';
import { Login } from './login.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private user: string;
  private admins: User[] = [];
  private adminsUpdated = new Subject<User[]>();
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private medPath: any = '/';
  constructor(private http: HttpClient, private router: Router) {}
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

      this.user = '/admins';
      this.http
        .post<{ token: string; id: string }>(
          'http://localhost:3000/api/users/admins/login',
          user
        )
        .subscribe((response) => {
          console.log(response);
          const token = response.token;
          const id = response.id;
          this.token = token;
          if (token) {
            this.medPath = '/admins/' + id;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/admins', id]);
          }
        });
    }

  logout() {
    this.token = null;
    this.medPath = '/';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  createUser(name: string, lastname: string, login: string, password: string, role:string) {
    const user: User = {
      id: null,
      login: login,
      password: password,
      role: role,
    };

   
      this.http
        .post<{ message: string }>(
          'http://localhost:3000/api/users/admins',
          user
        )
        .subscribe(() => {
          this.admins.push(user);
          this.adminsUpdated.next([...this.admins]);
        });
    }}
