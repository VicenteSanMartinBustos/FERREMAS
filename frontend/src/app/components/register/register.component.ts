import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!this.username || !this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios';
      this.message = '';
      return;
    }

    if (!passwordRegex.test(this.password)) {
      this.error =
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.';
      this.message = '';
      return;
    }

    this.http
      .post('http://localhost:8000/api/usuarios/registro/', {
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.message = 'Registro exitoso. Ahora puedes iniciar sesión.';
          this.error = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = 'Ocurrió un error al registrar. Intenta con otro nombre de usuario.';
          this.message = '';
        },
      });
  }
}
