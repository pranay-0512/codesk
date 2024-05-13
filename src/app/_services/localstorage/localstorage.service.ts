import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private storageSubject = new BehaviorSubject<any>(null);
  public storage$ = this.storageSubject.asObservable();
  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
    this.storageSubject.next(value);
  }

  getItem(key: string): any {
    return localStorage.getItem(key)
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageSubject.next(null);
  }
}
