import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
  productos: any[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData?.rol === 'administrador' || userData?.rol === 'vendedor') {
      this.cargarProductos();
    } else {
      this.router.navigate(['/error']); // Redirigir si no tiene permiso
    }
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: data => {
        this.productos = data;
      },
      error: err => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(id).subscribe(() => {
          this.productos = this.productos.filter((p) => p.id !== id);
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        });
      }
    });
  }

  verProducto(producto: any) {
    Swal.fire({
      title: producto.nombre,
      html: `
        <p><strong>Descripción:</strong> ${producto.descripcion}</p>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Stock:</strong> ${producto.stock}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }
}
