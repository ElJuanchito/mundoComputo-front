import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
import { ProductoInfoDTO } from '../../dtos/producto/producto-info-dto';
import Swal from 'sweetalert2';
import { CategoriaInfoDTO } from '../../dtos/categoria/categoria-info-dto';

@Component({
  selector: 'app-gestion-inventario',
  imports: [],
  templateUrl: './gestion-inventario.component.html',
  styleUrls: ['./gestion-inventario.component.css']
})
export class GestionInventarioComponent {
    inventario: ProductoInfoDTO[] = [];
    categorias: CategoriaInfoDTO[] = [];
    selectedProducto: ProductoInfoDTO | null = null;

    constructor(private inventarioService: InventarioService, private router: Router) {
        this.inventario = [];

        inventarioService.getAllProductos().subscribe({
            next: data => {
                this.inventario = data.message as ProductoInfoDTO[];
            },
            error: error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error.message,
                    footer: 'No se pudo obtener la lista de productos'
                });
            },
        });
    }

    createProducto() {
        this.router.navigate(['/admin/crear-producto']);
    }

    selectProducto(producto: ProductoInfoDTO) {
        this.selectedProducto = producto;
        console.log(this.selectedProducto);
    } 
    
    updateProducto() {
        if (this.selectedProducto) {
            this.router.navigate(['/admin/editar-producto', this.selectedProducto.id]);
        }
    }

    getNombreCategoria(categoriaId: number): string {
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
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Desconocida';

    }
}
