import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { CreateUsuarioDTO } from '../../dtos/usuario/create-usuario-dto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {

    this.roles = [];

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
}
