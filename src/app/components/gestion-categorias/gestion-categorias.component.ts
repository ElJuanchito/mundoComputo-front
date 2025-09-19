import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
import { CategoriaInfoDTO } from '../../dtos/categoria/categoria-info-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-categorias',
  templateUrl: './gestion-categorias.component.html',
  styleUrls: ['./gestion-categorias.component.css']
})
export class GestionCategoriasComponent {
    categorias: CategoriaInfoDTO[] = [];
    selectedCategoria: CategoriaInfoDTO | null = null;
    
    constructor(private inventarioService: InventarioService, private router: Router) {
      this.categorias = [];

        inventarioService.getAllCategorias().subscribe({
            next: data => {
                this.categorias = data.message as CategoriaInfoDTO[];
            },
            error: error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error.message,
                    footer: 'No se pudo obtener la lista de categorías'
                });
            },
        });
    }

    createCategoria() {
        this.router.navigate(['/admin/crear-categoria']);
    }

    selectCategoria(categoria: CategoriaInfoDTO) {
        this.selectedCategoria = categoria;
        console.log(this.selectedCategoria);
    }

    updateCategoria() {
        if (this.selectedCategoria) {
            this.router.navigate(['/admin/editar-categoria', this.selectedCategoria.id]);
        }
    }
    
    deleteCategoria() {         
        if (this.selectedCategoria) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: `Vas a eliminar la categoría "${this.selectedCategoria.nombre}". Esta acción no se puede deshacer.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.inventarioService.deleteCategoria(this.selectedCategoria!.id).subscribe({
                        next: data => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Categoría eliminada',
                                text: data.message,
                                timer: 2000,
                                showConfirmButton: false
                            });
                            this.categorias = this.categorias.filter(c => c.id !== this.selectedCategoria!.id);
                            this.selectedCategoria = null;
                        },
                        error: error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: error.error.message,
                                footer: 'No se pudo eliminar la categoría'
                            });
                        }
                    });
                }
            });
        }
    }
}
