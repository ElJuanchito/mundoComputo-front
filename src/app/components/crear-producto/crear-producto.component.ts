import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { CommonModule } from '@angular/common';
import { CreateProductoDTO } from '../../dtos/producto/create-producto-dto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CategoriaInfoDTO } from '../../dtos/categoria/categoria-info-dto';

@Component({
  selector: 'app-crear-producto.component',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})

export class CrearProductoComponent {   
    productForm: FormGroup;
    categorias: CategoriaInfoDTO[] = [];

    constructor(private fb: FormBuilder, private inventarioService: InventarioService, private router: Router) {

        this.productForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            precio: ['', [Validators.required, Validators.min(0)]],
            stock: ['', [Validators.required, Validators.min(0)]],
            stockMinimo: ['', [Validators.required, Validators.min(0)]],
            categoriaId: ['', Validators.required]
        });

        this.getCategorias();
    }

    createProducto() {
        console.log("Entro")
        if (this.productForm.invalid) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, complete todos los campos correctamente.',
                footer: 'Formulario inválido'
            });
            return;
        }
        
        const createProductoDTO = this.productForm.value as CreateProductoDTO;
        console.log(createProductoDTO);

        this.inventarioService.createProducto(createProductoDTO).subscribe({
            next: data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data.message,
                    footer: 'Producto creado correctamente'
                });
                this.router.navigate(['/inventario/gestion-inventario']);
            },
            error: error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error.message,
                    footer: 'No se pudo crear el producto'
                });
            },
        });
    }

    getCategorias(){
        this.inventarioService.getAllCategorias().subscribe({
            next: data => {
                this.categorias = data.message;
            },
            error: error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error.message,
                    footer: 'No se pudo obtener la lista de categorias'
                });
            },
        });
    }

    cancel() {
        this.router.navigate(['/inventario/gestion-inventario']);
    }
}