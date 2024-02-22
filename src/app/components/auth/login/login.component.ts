import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/_validators/custom-validators.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>(null, [Validators.required, CustomValidators.emailValidation]),
      password: new FormControl<string | null>(null, [Validators.required, CustomValidators.oneUpperCase, CustomValidators.oneLowerCase, CustomValidators.oneDigit, CustomValidators.oneSpecialCharacter, CustomValidators.minimumLength, CustomValidators.noWhiteSpace]),
    });
  }
  ngOnInit(): void {

  }
  loginUser(): void {
    console.log(this.loginForm);
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }
    else {
      this.router.navigate(['/dashboard']);
    }
  }

}