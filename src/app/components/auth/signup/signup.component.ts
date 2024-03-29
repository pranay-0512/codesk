import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/_validators/custom-validators.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup; 
  constructor(private router: Router) {
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
    console.log(this.signupForm);
  }

}