import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-crud',
  templateUrl: './usuario-crud.component.html',
  styleUrls: ['./usuario-crud.component.css'],
  imports: [FormsModule, CommonModule]
})
export class UsuarioCrudComponent implements OnInit {
  mostrar = false;
  usuarios: any[] = [];
  editandoUsuario: any = null;
  usuarioAEliminar: any = null;
  nuevoUsuario: any = { username: '', email: '', rol: '' };
  mostrarFormularioNuevo: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData?.rol === 'administrador') {
      this.mostrar = true;
      this.cargarUsuarios();
    } else {
      this.router.navigate(['/error']);
    }
  }

  cargarUsuarios(): void {
    const token = localStorage.getItem('access_token');  // Obtener el token
    if (token) {
      this.http.get<any[]>('http://localhost:8000/api/usuarios/', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
        }
      });
    } else {
      console.error('No hay token de acceso');
    }
  }

  crearNuevoUsuario(): void {
    this.mostrarFormularioNuevo = true;
  }

  cancelarNuevoUsuario(): void {
    this.mostrarFormularioNuevo = false;
    this.nuevoUsuario = { username: '', email: '', rol: '' };
  }

  guardarUsuario(): void {
    const token = localStorage.getItem('access_token');
    this.http.post('http://localhost:8000/api/usuarios/', this.nuevoUsuario, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.nuevoUsuario = { username: '', email: '', rol: '' };
        this.mostrarFormularioNuevo = false;
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
      }
    });
  }

  openEditModal(usuario: any): void {
    this.editandoUsuario = { ...usuario };
  }

  closeModal(): void {
    this.editandoUsuario = null;
    this.usuarioAEliminar = null;
  }

  openDeleteModal(id: number): void {
    this.usuarioAEliminar = id;
  }

  actualizarUsuario(): void {
    const token = localStorage.getItem('access_token');
    this.http.put(`http://localhost:8000/api/usuarios/${this.editandoUsuario.id}/`, this.editandoUsuario, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    });
  }

  eliminar(id: number): void {
    const token = localStorage.getItem('access_token');
    this.http.delete(`http://localhost:8000/api/usuarios/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    });
  }
}
