import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { local } from 'd3';
import { AuthServiceService } from 'src/app/_services/auth-service/auth-service.service';
import { CustomValidators } from 'src/app/_validators/custom-validators.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup; 
  constructor(private router: Router, private authService: AuthServiceService) {
    this.signupForm = new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), CustomValidators.onlyString]),
      email: new FormControl<string | null>(null, [Validators.required, CustomValidators.emailValidation]),
      password: new FormControl<string | null>(null, [Validators.required, CustomValidators.oneUpperCase, CustomValidators.oneLowerCase, CustomValidators.oneDigit, CustomValidators.oneSpecialCharacter, CustomValidators.minimumLength, CustomValidators.noWhiteSpace]),
      });
   }

  ngOnInit(): void {

  }
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  registerUser(): void {
    if(this.signupForm.invalid) {
      return;
    }
    this.authService.userSignup(this.signupForm.value).subscribe({
      next: (data: any) => {
        if(sessionStorage.getItem('token')) {
          sessionStorage.removeItem('token');
        }
        sessionStorage.setItem('token', data.token);
        this.router.navigate(['/auth/login']);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log('User registration successful');
      }
    })
  }

}