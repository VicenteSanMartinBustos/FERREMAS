import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../carrito.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: ItemCarrito[] = [];
  totalCantidad = 0;
  total = 0;
  mostrarResumen = false;
  mostrarMenuCuenta = false;
  carritoFijo = false;
  tipoCambio = 1;
  userName = '';
  userEmail = '';

  // Iconos
  faUserCircle = faUserCircle;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private userService: UserService
  ) {}

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

    this.userService.user$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userEmail = user.email;
      } else {
        this.userName = '';
        this.userEmail = '';
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  toggleCarritoFijo() {
    this.carritoFijo = !this.carritoFijo;
    this.mostrarResumen = this.carritoFijo;
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
    this.carritoFijo = false;
  }

  irAlInicio() {
    this.router.navigate(['/']);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userService.clearUser();
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
    if (!this.carritoFijo) {
      this.mostrarResumen = false;
    }
  }
}
