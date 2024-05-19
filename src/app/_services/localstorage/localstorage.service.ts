import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private storageSubject = new Subject<{ key: string, value: any }>();

  storageChange$ = this.storageSubject.asObservable();

  constructor() {
    window.addEventListener('storage', this.onStorageEvent.bind(this));
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
    this.storageSubject.next({ key, value });
  }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageSubject.next({ key, value: null });
  }

  private onStorageEvent(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      this.storageSubject.next({ key: event.key!, value: event.newValue });
    }
  }
}
