import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../carrito.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faCreditCard, faTrashAlt, faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: ItemCarrito[] = [];
  
  // Iconos
  faShoppingCart = faShoppingCart;
  faCreditCard = faCreditCard;
  faTrashAlt = faTrashAlt;
  faMinus = faMinus;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(data => {
      this.items = data;
    });
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  calcularEnvio() {
    return this.total > 50000 ? 'Gratis' : '$3.000';
  }

  incrementarCantidad(item: ItemCarrito) {
  if (item.cantidad < item.stockDisponible) {
    this.carritoService.actualizarCantidad(item.id, item.cantidad + 1);
  }
}

  decrementarCantidad(item: ItemCarrito) {
    if (item.cantidad > 1) {
      this.carritoService.actualizarCantidad(item.id, item.cantidad - 1);
    }
  }

  eliminarProducto(id: number) {
    this.carritoService.eliminar(id);
  }

  procederAlPago() {
    if (this.items.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}