import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../carrito.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: ItemCarrito[] = [];
  totalCantidad = 0;
  total = 0;
  mostrarResumen = false;
  mostrarMenuCuenta = false;
  tipoCambio = 1;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(data => {
      this.items = data;
      this.totalCantidad = data.reduce((sum, item) => sum + item.cantidad, 0);
      this.total = data.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    });

    fetch('http://localhost:8000/api/dolar/')
      .then(res => res.json())
      .then(data => {
        this.tipoCambio = data.valor;
      })
      .catch(err => console.error('Error al obtener tipo de cambio:', err));
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irAlInicio() {
    this.router.navigate(['../']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  mostrarMenuCuentaHandler() {
    this.mostrarMenuCuenta = true;
  }

  ocultarMenuCuentaHandler() {
    this.mostrarMenuCuenta = false;
  }

  mostrarResumenCarritoHandler() {
    this.mostrarResumen = true;
  }

  ocultarResumenCarritoHandler() {
    this.mostrarResumen = false;
  }
}
