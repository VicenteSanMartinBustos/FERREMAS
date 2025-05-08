import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrito } from '../carrito.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoItems: ItemCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  public carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  agregar(item: ItemCarrito): void {
    const itemExistente = this.carritoItems.find(i => i.id === item.id);
    
    if (itemExistente) {
      itemExistente.cantidad += item.cantidad;
    } else {
      this.carritoItems.push({...item});
    }
    
    this.actualizarCarrito();
  }

  eliminar(id: number): void {
    this.carritoItems = this.carritoItems.filter(item => item.id !== id);
    this.actualizarCarrito();
  }

  vaciarCarrito(): void {
    this.carritoItems = [];
    this.actualizarCarrito();
  }

  private actualizarCarrito(): void {
    this.carritoSubject.next([...this.carritoItems]);
  }

  obtenerTotalItems(): number {
    return this.carritoItems.reduce((sum: number, item: ItemCarrito) => sum + item.cantidad, 0);
  }

  obtenerTotalPrecio(): number {
    return this.carritoItems.reduce((sum: number, item: ItemCarrito) => sum + (item.precio * item.cantidad), 0);
  }
}