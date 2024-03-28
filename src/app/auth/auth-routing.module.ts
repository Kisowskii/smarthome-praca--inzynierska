import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'signup',
    component: SignupComponent,
    children: [
      { path: 'user', component: SignupComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
