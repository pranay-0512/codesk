import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent, title: 'Login'},
      { path: 'signup', component: SignupComponent, title: 'Sign Up'},
      { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password'}
    ])
  ]
})
export class AuthModule { }
