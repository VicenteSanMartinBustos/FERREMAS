import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


interface LoginResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/usuarios/'; 

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro/`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  obtenerPerfil(): Observable<any> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      console.warn('Token no encontrado');
      return new Observable();  // Evita seguir si no hay token
    }
  
    return this.http.get('http://localhost:8000/api/usuarios/perfil/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // auth.service.ts (o donde ya estés manejando el usuario)
get esAdmin(): boolean {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return userData?.rol === 'administrador';
}


 
} 