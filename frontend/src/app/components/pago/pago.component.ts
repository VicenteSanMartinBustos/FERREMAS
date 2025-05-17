import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

declare const paypal: any; // Changed from 'declare var' to 'declare const'

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PagoComponent implements OnInit {
  total = 10000; // Total de ejemplo

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPaypalScript().then(() => {
      this.renderPayPalButton();
    });
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof paypal !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AdUHcJ79l61aDnHoyjAe7x5_ZYnkCt1Z_CUScYLAEaW_Z5SV-D0Ck809ZqB28Fu0H85aGN3d7Jg4FFK2'; // Replace with your actual client ID
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('PayPal script failed to load'));
      document.body.appendChild(script);
    });
  }

  renderPayPalButton() {
    if (typeof paypal === 'undefined') {
      console.error('PayPal SDK not loaded');
      return;
    }

    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: (this.total / 1000).toFixed(2),
              currency_code: 'USD'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Pago completado por ' + details.payer.name.given_name);
          // You might want to add navigation or other logic here
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Ocurrió un error durante el pago. Por favor intente nuevamente.');
      }
    }).render('#paypal-button-container');
  }
}