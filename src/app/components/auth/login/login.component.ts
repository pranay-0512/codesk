import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginModel, LoginResponseModel } from 'src/app/_models/auth/login.model';
import { AuthServiceService } from 'src/app/_services/auth-service/auth-service.service';
import { LoaderService } from 'src/app/_services/loader/loader.service';
import { CustomValidators } from 'src/app/_validators/custom-validators.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  constructor(private router: Router, private authService: AuthServiceService, private loader: LoaderService, private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>(null, [Validators.required, CustomValidators.emailValidation]),
      password: new FormControl<string | null>(null, [Validators.required, CustomValidators.oneUpperCase, CustomValidators.oneLowerCase, CustomValidators.oneDigit, CustomValidators.oneSpecialCharacter, CustomValidators.minimumLength, CustomValidators.noWhiteSpace]),
    });
  }
  ngOnInit(): void {
    this.toastr.success('Welcome to the login page', 'Welcome');
  }
  goToRegister(): void {
    this.router.navigate(['/auth/signup']);
  }
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
  loginUser(): void {
    if(this.loginForm.invalid) {
      return;
    }
    const loginData: LoginModel = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.authService.userLogin(loginData).subscribe({
      next: (data: LoginResponseModel) => {
        this.loader.showLoader();
        if(sessionStorage.getItem('token')) {
          sessionStorage.removeItem('token');
        }
        sessionStorage.setItem('token', data.tokens?.access.token || '');

      },
      error: (error: HttpErrorResponse) => {
        this.loader.hideLoader();
        this.toastr.error(error.error.message, 'Error');
        console.log(error);
      },
      complete: () => {
        setTimeout(() => {
          this.loader.hideLoader();
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    })
  }

}