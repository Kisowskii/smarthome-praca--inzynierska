import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(public authService: AuthService) {}
  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(
      form.value.login,
      form.value.password,
      form.value.name,
      form.value.lastname
    );
    form.resetForm();
  }
  ngOnInit(): void {}
}
