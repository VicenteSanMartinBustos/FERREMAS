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

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(data => {
      this.items = data;
      this.totalCantidad = data.reduce((sum, item) => sum + item.cantidad, 0);
      this.total = data.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    });
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

  // Métodos para el menú de cuenta
mostrarMenuCuentaHandler() {
  this.mostrarMenuCuenta = true;
}

ocultarMenuCuentaHandler() {
  this.mostrarMenuCuenta = false;
}

// Métodos para el carrito
mostrarResumenCarritoHandler() {
  this.mostrarResumen = true;
}

ocultarResumenCarritoHandler() {
  this.mostrarResumen = false;
}
}
