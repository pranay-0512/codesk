import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from 'src/app/_models/auth/login.model';
import { SignupModel } from 'src/app/_models/auth/signup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  userLogin(data: LoginModel): Observable<any> {
    return this.http.post('http://localhost:3000/v1/auth/login', data);
  }

  userSignup(data: SignupModel): Observable<any> {
    return this.http.post('http://localhost:3000/v1/auth/signup', data);
  }

  userLogout(): Observable<any> {
    return this.http.get('http://localhost:3000/v1/auth/logout');
  }

}
