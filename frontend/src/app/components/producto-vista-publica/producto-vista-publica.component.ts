// En producto-vista-publica.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../producto.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ItemCarrito } from '../../carrito.interface';

@Component({
  selector: 'app-producto-vista-publica',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './producto-vista-publica.component.html',
  styleUrls: ['./producto-vista-publica.component.css']
})
export class ProductoVistaPublicaComponent implements OnInit {
  productos: Producto[] = [];
  cantidades: { [id: number]: number } = {};

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        // Inicializar cantidades
        data.forEach(p => this.cantidades[p.id] = 1);
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  agregarAlCarrito(producto: Producto): void {
    const cantidad = this.cantidades[producto.id] || 1;
  
    if (producto.stock <= 0) {
      alert('Este producto está agotado');
      return;
    }
  
    if (cantidad > producto.stock) {
      alert(`Solo quedan ${producto.stock} unidades disponibles`);
      return;
    }
  
    const item: ItemCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      imagen: producto.imagen ?? undefined,
      stockDisponible: producto.stock
    };
  
    this.carritoService.agregar(item);
  
    // 🔽 Actualiza el stock local
    producto.stock -= cantidad;
  
    // Reinicia cantidad
    this.cantidades[producto.id] = 1;
  }
  

  validarCantidad(producto: Producto): void {
    if (!this.cantidades[producto.id] || this.cantidades[producto.id] < 1) {
      this.cantidades[producto.id] = 1;
    } else if (this.cantidades[producto.id] > producto.stock) {
      alert(`Solo quedan ${producto.stock} unidades disponibles`);
      this.cantidades[producto.id] = producto.stock;
    }
  }

  incrementarCantidad(producto: Producto): void {
    if (!this.cantidades[producto.id]) {
      this.cantidades[producto.id] = 1;
    } else if (this.cantidades[producto.id] < producto.stock) {
      this.cantidades[producto.id]++;
    }
  }

  decrementarCantidad(producto: Producto): void {
    if (this.cantidades[producto.id] && this.cantidades[producto.id] > 1) {
      this.cantidades[producto.id]--;
    }
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-ES');
  }
}