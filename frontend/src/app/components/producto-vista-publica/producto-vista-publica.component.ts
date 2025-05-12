import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { TipoCambioService } from '../../services/tipo-cambio.service';
import { Producto } from '../../producto.interface';
import { ItemCarrito } from '../../carrito.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-producto-vista-publica',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './producto-vista-publica.component.html',
  styleUrls: ['./producto-vista-publica.component.css']
})
export class ProductoVistaPublicaComponent implements OnInit {
  productos: Producto[] = [];
  productosDestacados: Producto[] = [];
  cantidades: { [id: number]: number } = {};
  tipoCambio: number | null = null;
  loadingTipoCambio = true;
  errorTipoCambio = false;
  loadingProductos = true;
  errorProductos = false;
  currentSlide = 0;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private tipoCambioService: TipoCambioService
  ) {}

  ngOnInit(): void {
    this.obtenerTipoCambio();
    this.cargarProductos();
  }

  obtenerTipoCambio(): void {
    this.loadingTipoCambio = true;
    this.errorTipoCambio = false;
    
    this.tipoCambioService.obtenerTipoCambio().subscribe({
      next: (data: any) => {
        if (data && typeof data.usd_to_clp === 'number') {
          this.tipoCambio = data.usd_to_clp;
        } else {
          throw new Error('Estructura de respuesta inválida');
        }
        this.loadingTipoCambio = false;
      },
      error: (err) => {
        console.error('Error al obtener tipo de cambio:', err);
        this.errorTipoCambio = true;
        this.loadingTipoCambio = false;
      }
    });
  }

  cargarProductos(): void {
    this.loadingProductos = true;
    this.errorProductos = false;
    
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        data.forEach(p => this.cantidades[p.id] = 1);
        this.seleccionarProductosDestacados();
        this.loadingProductos = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorProductos = true;
        this.loadingProductos = false;
      }
    });
  }

  seleccionarProductosDestacados(): void {
    this.productosDestacados = [...this.productos]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.productosDestacados.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.productosDestacados.length) % this.productosDestacados.length;
  }

  agregarAlCarrito(producto: Producto): void {
    const cantidad = this.cantidades[producto.id] || 1;
    const cantidadEnCarrito = this.getCantidadEnCarrito(producto.id);
    const stockDisponible = producto.stock - cantidadEnCarrito;
  
    if (stockDisponible <= 0) {
      alert('Este producto está agotado');
      return;
    }
  
    if (cantidad > stockDisponible) {
      alert(`Solo puedes agregar ${stockDisponible} unidades. Ya tienes ${cantidadEnCarrito} en el carrito.`);
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
    this.cantidades[producto.id] = 1;
  
    // Se eliminó el alert() que mostraba el mensaje de confirmación
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

  clpToUsd(precioClp: number): string {
    if (!this.tipoCambio) return '-';
    const precioUsd = precioClp / this.tipoCambio;
    return '$' + precioUsd.toFixed(2);
  }

  getCantidadEnCarrito(id: number): number {
    const item = this.carritoService.getItem(id);
    return item ? item.cantidad : 0;
  }
}