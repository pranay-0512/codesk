import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login back to your account' } },
  { path: 'signup', component: SignupComponent, data: { title: 'Register your account' } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'Forgot your password?' } },

  // otherwise redirect to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
