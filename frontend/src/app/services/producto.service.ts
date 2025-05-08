import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../producto.interface'; // Asegúrate de que la ruta sea correcta

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api/productos/';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  crearProducto(producto: FormData) {
    return this.http.post(this.apiUrl, producto); // sin headers de content-type
  }
  
  
  actualizarProducto(id: number, producto: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, producto);
  }
  

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  
}
