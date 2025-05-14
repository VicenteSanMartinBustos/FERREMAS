import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (
      token &&
      (userData?.rol === 'administrador' || userData?.rol === 'vendedor')
    ) {
      return true;
    } else {
      this.router.navigate(['/error']);
      return false;
    }
  }
}
