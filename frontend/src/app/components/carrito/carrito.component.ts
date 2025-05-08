import { Component, OnInit } from '@angular/core';
import { CarritoService} from '../../services/carrito.service';
import { ItemCarrito } from '../../carrito.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: ItemCarrito[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(data => {
      this.items = data;
      console.log('Items en el carrito:', this.items);
    });
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  eliminarProducto(id: number) {
    this.carritoService.eliminar(id);
  }
  
  
}
