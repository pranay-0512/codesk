import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: '', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  // otherwise redirect to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
