import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { CreateUsuarioDTO } from '../../dtos/usuario/create-usuario-dto';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioInfoDTO } from '../../dtos/usuario/usuario-info-dto';
import { UpdateUsuarioDTO } from '../../dtos/usuario/update-usuario-dto';
import { S } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-crear-usuario.component',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})

export class CrearUsuarioComponent {
  userForm: FormGroup;
  roles: [];
  usuario?: UsuarioInfoDTO;
  updateOnly: boolean = false;
  codigoUsuario: number = 0;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private adminService: AdminService, private router: Router) {
    this.roles = [];

    this.route.params.subscribe((params) => {
      this.codigoUsuario = params['id'];
      if (this.codigoUsuario) {
        console.log("Hola");
        this.updateOnly = true;
        this.getUsuario();
      }
    });

    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      rol: ['', Validators.required]
    });

    adminService.getRoles().subscribe({
      next: data => {
        this.roles = data.message as [];
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
          footer: 'No se pudo obtener la lista de roles'
        });
      },
    });
  }

  createUsuario() {
    if (this.updateOnly) {
      this.updateUsuario();
      console.log("Actualizando usuario... 1");
      return;
    }

    if (this.userForm.invalid) return;

    const createUsuarioDTO = this.userForm.value as CreateUsuarioDTO;
    console.log(createUsuarioDTO);

    this.adminService.createUsuario(createUsuarioDTO).subscribe({
      next: data => {
        Swal.fire("Exito!", "Se ha creado un nuevo usuario.", "success");
        this.router.navigate(['/admin/gestion-usuarios']);
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        });
      },
    });
  }

  getUsuario() {
    this.adminService.getUsuarioById(this.codigoUsuario).subscribe({
      next: data => {
        this.usuario = data.message;
        this.loadUsuarioData();
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        });
      },
    });
  }

  goToGestionUsuarios() {
    this.router.navigate(['/admin/gestion-usuarios']);
  }

  private loadUsuarioData() {
    if (!this.usuario) return;

    this.userForm.patchValue({
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido
    });
  }

  updateUsuario() {
    if (
      !this.userForm.get('nombre')?.valid ||
      !this.userForm.get('apellido')?.valid ||
      !this.usuario
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos.'
      });
      return;
    }

    const updatedUsuario: UpdateUsuarioDTO = {
      id: this.usuario.id,
      nombre: this.userForm.value.nombre,
      apellido: this.userForm.value.apellido
    };

    this.adminService.updateUsuario(updatedUsuario).subscribe({
      next: data => {
        Swal.fire("Exito!", "Se ha actualizado el usuario.", "success");
        this.router.navigate(['/admin/gestion-usuarios']);
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        });
      },
    });
  }
}
