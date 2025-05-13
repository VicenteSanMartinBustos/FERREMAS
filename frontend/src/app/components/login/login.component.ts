import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  // Iconos
  faUser = faUser;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faExclamationCircle = faExclamationCircle;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  login() {
    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post('http://localhost:8000/api/usuarios/login/', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);

        this.http.get('http://localhost:8000/api/usuarios/perfil/', {
          headers: { Authorization: `Bearer ${res.access}` }
        }).subscribe({
          next: (perfil: any) => {
            const user = {
              name: perfil.username,
              email: perfil.email
            };
            this.userService.setUser(user);
            this.router.navigate(['/']);
          },
          error: () => {
            this.error = 'Error al obtener perfil del usuario';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      }
    });
  }
}
