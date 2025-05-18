import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ItemCarrito } from '../../carrito.interface';

declare const paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PagoComponent implements OnInit, OnDestroy {
  subtotal = 0;
  costoEnvio = 0;
  total = 0;
  metodoRetiro = 'retiro_tienda';
  private subscriptions: Subscription = new Subscription();

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.subtotal = this.carritoService.obtenerTotalPrecio();
    this.metodoRetiro = this.carritoService.getMetodoRetiro();
    this.calcularTotales();

    this.subscriptions.add(
      this.carritoService.metodoRetiro$.subscribe(metodo => {
        this.metodoRetiro = metodo;
        this.calcularTotales();
      })
    );

    this.loadPaypalScript().then(() => {
      this.renderPayPalButton();
    }).catch(error => {
      console.error('Error loading PayPal:', error);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  calcularTotales(): void {
    this.subtotal = this.carritoService.obtenerTotalPrecio();
    this.costoEnvio = this.metodoRetiro === 'domicilio' && this.subtotal < 49990 ? 3000 : 0;
    this.total = this.subtotal + this.costoEnvio;
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof paypal !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?AdUHcJ79l61aDnHoyjAe7x5_ZYnkCt1Z_CUScYLAEaW_Z5SV-D0Ck809ZqB28Fu0H85aGN3d7Jg4FFK2&currency=USD';
      script.onload = () => resolve();
      script.onerror = (error) => reject(new Error('PayPal script failed to load: ' + error));
      document.body.appendChild(script);
    });
  }

  private renderPayPalButton(): void {
    if (typeof paypal === 'undefined') {
      console.error('PayPal SDK not loaded');
      return;
    }

    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'paypal',
        height: 48
      },
      createOrder: (data: any, actions: any) => {
        const subtotalUSD = this.subtotal / 1000;
        const envioUSD = this.costoEnvio / 1000;
        const totalUSD = this.total / 1000;

        return actions.order.create({
          purchase_units: [{
            amount: {
              value: totalUSD.toFixed(2),
              currency_code: 'USD',
              breakdown: {
                item_total: {
                  value: subtotalUSD.toFixed(2),
                  currency_code: 'USD'
                },
                shipping: {
                  value: envioUSD.toFixed(2),
                  currency_code: 'USD'
                }
              }
            },
            items: this.getPaypalItems()
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert(`Pago completado por ${details.payer.name.given_name}`);
          this.carritoService.vaciarCarrito();
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Ocurrió un error durante el pago. Por favor intente nuevamente.');
      },
      onCancel: (data: any) => {
        console.log('Pago cancelado por el usuario');
      }
    }).render('#paypal-button-container');
  }

  private getPaypalItems(): any[] {
    const items = this.carritoService.getCarritoActual();
    return items.map((item: ItemCarrito) => ({
      name: item.nombre.substring(0, 127),
      unit_amount: {
        value: (item.precio / 1000).toFixed(2),
        currency_code: 'USD'
      },
      quantity: item.cantidad.toString(),
      sku: item.id.toString()
    }));
  }
}