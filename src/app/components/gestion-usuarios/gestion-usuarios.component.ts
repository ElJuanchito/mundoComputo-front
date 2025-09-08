import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { UsuarioInfoDTO } from '../../dtos/usuario/usuario-info-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {

  usuarios: UsuarioInfoDTO[] = [];
  selectedUsuario: UsuarioInfoDTO | null = null;

  constructor(private adminService: AdminService, private router: Router) {
    this.usuarios = [];

    adminService.getAllUsuarios().subscribe({
          next: data => {
            this.usuarios = data.message as UsuarioInfoDTO[];
          },
          error: error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error.message,
              footer: 'No se pudo obtener la lista de usuarios'
            });
          },
        });
   }

  createUsuario() {
    this.router.navigate(['/admin/crear-usuario']);
  }

  selectUsuario(usuario: UsuarioInfoDTO) {
    this.selectedUsuario = usuario;
    console.log(this.selectedUsuario);
  }

  deleteUsuario() {
    if (this.selectedUsuario) {
      this.adminService.deleteUsuario(this.selectedUsuario.id).subscribe({
        next: data => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: data.message,
            footer: 'Usuario eliminado correctamente'
          });
          this.usuarios = this.usuarios.filter(u => u.id !== this.selectedUsuario?.id);
          this.selectedUsuario = null;
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            footer: 'No se pudo eliminar el usuario'
          });
        },
      });
    }
  }

  goToUpdateUsuario() {
    if (this.selectedUsuario) {
      this.router.navigate(['/admin/actualizar-usuario', this.selectedUsuario.id]);
    }
  }
}