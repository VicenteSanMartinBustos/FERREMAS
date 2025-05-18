import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrito } from '../carrito.interface';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoItems: ItemCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  public carrito$: Observable<ItemCarrito[]> = this.carritoSubject.asObservable();
  
  private metodoRetiroSource = new BehaviorSubject<string>('retiro_tienda');
  public metodoRetiro$: Observable<string> = this.metodoRetiroSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDesdeStorage();
    }
  }

  agregar(item: ItemCarrito): void {
    const itemExistente = this.carritoItems.find(i => i.id === item.id);

    if (itemExistente) {
      itemExistente.cantidad += item.cantidad;
    } else {
      this.carritoItems.push({ ...item });
    }

    this.actualizarCarrito();
    this.guardarEnStorage();
  }

  eliminar(id: number): void {
    this.carritoItems = this.carritoItems.filter(item => item.id !== id);
    this.actualizarCarrito();
    this.guardarEnStorage();
  }

  vaciarCarrito(): void {
    this.carritoItems = [];
    this.actualizarCarrito();
    this.guardarEnStorage();
  }

  actualizarCantidad(id: number, cantidad: number): void {
    const item = this.carritoItems.find(i => i.id === id);

    if (item) {
      item.cantidad = cantidad;
      this.actualizarCarrito();
      this.guardarEnStorage();
    }
  }

  obtenerTotalItems(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.cantidad, 0);
  }

  obtenerTotalPrecio(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  getItem(id: number): ItemCarrito | undefined {
    return this.carritoItems.find(item => item.id === id);
  }

  setMetodoRetiro(metodo: string): void {
    this.metodoRetiroSource.next(metodo);
    this.guardarEnStorage();
  }

  getMetodoRetiro(): string {
    return this.metodoRetiroSource.value;
  }

  getCarritoActual(): ItemCarrito[] {
    return [...this.carritoItems];
  }

  private actualizarCarrito(): void {
    this.carritoSubject.next([...this.carritoItems]);
  }

  private guardarEnStorage(): void {
    const carritoData = {
      items: this.carritoItems,
      metodoRetiro: this.metodoRetiroSource.value
    };
    localStorage.setItem('carrito', JSON.stringify(carritoData));
  }

  private cargarDesdeStorage(): void {
    const data = localStorage.getItem('carrito');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        this.carritoItems = parsedData.items || [];
        this.metodoRetiroSource.next(parsedData.metodoRetiro || 'retiro_tienda');
        this.actualizarCarrito();
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
        localStorage.removeItem('carrito');
      }
    }
  }
}