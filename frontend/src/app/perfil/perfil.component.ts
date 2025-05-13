import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil: any = null;
  cargando = true;
  error = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.obtenerPerfil().subscribe({
      next: (data) => {
        this.perfil = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}


