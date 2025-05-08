import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent implements OnInit {
  form: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: [''],
      descripcion: [''],
      precio: [''],
      stock: [''],
    });
  }

    imagenSeleccionada: File | null = null;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
         }
  }


  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.productoService.getProducto(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  guardar() {
    const formData = new FormData();
    formData.append('nombre', this.form.value.nombre);
    formData.append('descripcion', this.form.value.descripcion);
    formData.append('precio', this.form.value.precio);
    formData.append('stock', this.form.value.stock);
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada); // esta es la imagen cargada
    }
  
    if (this.id) {
      this.productoService.actualizarProducto(this.id, formData)
        .subscribe(() => this.router.navigate(['/productos']));
    } else {
      this.productoService.crearProducto(formData)
        .subscribe({
          next: () => this.router.navigate(['/productos']),
          error: err => console.error('Error al crear producto:', err.error)
        });
    }
  }
  
  
  

  volver() {
    this.router.navigate(['/productos']);
  }

  

  
}
