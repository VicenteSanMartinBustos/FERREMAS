import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!this.username || !this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios';
      this.message = '';
      return;
    }

    if (!passwordRegex.test(this.password)) {
      this.error = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.';
      this.message = '';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    this.http.post('http://localhost:8000/api/usuarios/registro/', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.message = '¡Registro exitoso! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar. Intenta con otro nombre de usuario o correo.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}