import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  setUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('user_data');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
