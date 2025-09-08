import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { CommonModule } from '@angular/common';
import { CreateCategoriaDTO } from '../../dtos/categoria/create-categoria-dto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-categoria.component',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './crear-categoria.component.html',
  styleUrl: './crear-categoria.component.css'
})
export class CrearCategoriaComponent {
    categoryForm: FormGroup;
    constructor(private fb: FormBuilder, private inventarioService: InventarioService, private router: Router) {

      this.categoryForm = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required]
      });
    }

    createCategoria() {
      if (this.categoryForm.invalid) return;

      const createCategoriaDTO = this.categoryForm.value as CreateCategoriaDTO;
      console.log(createCategoriaDTO);

      this.inventarioService.createCategoria(createCategoriaDTO).subscribe({
        next: data => {
          Swal.fire("Exito!", "Se ha creado una nueva categoria.", "success");
          this.router.navigate(['/admin/gestion-categorias']);
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            footer: 'No se pudo crear la categoria'
          });
        },
      });
    }
}
