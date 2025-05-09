import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  private apiUrl = 'http://localhost:8000/api/tipo_cambio/'; // URL completa temporalmente para pruebas

  constructor(private http: HttpClient) {}

  obtenerTipoCambio(): Observable<{usd_to_clp: number}> {
    return this.http.get(this.apiUrl, { responseType: 'text' }) // Primero recibe como texto
      .pipe(
        catchError(this.handleError),
        map(response => {
          try {
            // Intenta parsear manualmente
            return JSON.parse(response);
          } catch (e) {
            console.error('Error parsing JSON:', response);
            throw new Error('Respuesta no es JSON válido');
          }
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Error al obtener tipo de cambio'));
  }
}