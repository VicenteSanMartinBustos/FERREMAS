import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;
  rememberMe = false;

  // Iconos
  faUser = faUser;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faExclamationCircle = faExclamationCircle;

  constructor(private http: HttpClient, private router: Router) {}

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

    this.http
      .post('http://localhost:8000/api/usuarios/login/', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          if (this.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) {
            this.error = 'Credenciales incorrectas';
          } else {
            this.error = 'Error al conectar con el servidor. Intenta nuevamente.';
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}