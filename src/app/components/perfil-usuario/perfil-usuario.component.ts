import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { UsuarioInfoDTO } from '../../dtos/usuario/usuario-info-dto';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UpdateUsuarioDTO } from '../../dtos/usuario/update-usuario-dto';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-perfil-usuario.component',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule, NgOptimizedImage],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {

  account?: UsuarioInfoDTO;
  userInforForm!: FormGroup;
  isEditing: boolean = false;
  isPasswordVisible: boolean = false;
  userImageUrl: string | null = null;
  selectedImageFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.obtenerInformacionUsuario();
    // Cargar imagen del usuario si está disponible en el objeto account o tokenService
    const imgFromToken = this.tokenService.getUserImageUrl ? this.tokenService.getUserImageUrl() : null;
    if (imgFromToken) {
      this.userImageUrl = imgFromToken;
    }
  }
  /**
   * Maneja la selección de una nueva imagen de usuario
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      // Previsualización inmediata
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedImageFile);

      // Subir la imagen y actualizar usuario SOLO cuando la URL esté disponible
      this.storageService.uploadFile(this.selectedImageFile).subscribe({
        next: (data) => {
          this.userImageUrl = data.message;
          if (this.account && this.userImageUrl) {
            this.usuarioService.updateUsuario({
              id: this.account.id,
              nombre: this.account.nombre,
              apellido: this.account.apellido,
              imageUrl: this.userImageUrl
            }).subscribe({
              next: (data) => {
                Swal.fire({
                  title: 'Éxito',
                  text: data.message,
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
              },
              error: (error) => {
                Swal.fire({
                  title: 'Error',
                  text: error.error.message || 'No se pudo actualizar la imagen',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
              }
            });
          }
        },
        error: (error) => {
          Swal.close();
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al subir la imagen:', error);
        }
      });
    }
  }

  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private createForm() {
    this.userInforForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios
      ]
      ],
      apellido: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios
      ]
      ],
      rol: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: '', disabled: true }, [Validators.required]],
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        ]
      ],
    });
  }

  numberLengthValidator(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (value.toString().length < minLength || value.toString().length > maxLength) {
        return { numberLength: true };
      }
      return null;
    };
  }

  enableEditing() {
    this.isEditing = true;
    this.userInforForm.get('nombre')?.enable();
    this.userInforForm.get('apellido')?.enable();
    this.userInforForm.get('password')?.enable();
  }

  public deleteAccount() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed && this.account) {
          this.usuarioService.deleteUsuario(this.account.id).subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Cuenta eliminada',
                text: data.message || 'La cuenta se ha eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              setTimeout(() => {
                this.tokenService.logout();
                this.router.navigate(['/auth/login']);
              }, 1000);
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error.error.message || 'No se pudo eliminar la cuenta',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          });
        }
      });
  }

  public disableEditing() {
    this.isEditing = false;
    this.userInforForm.get('nombre')?.disable();
    this.userInforForm.get('apellido')?.disable();
    this.userInforForm.get('password')?.reset();
    this.userInforForm.get('password')?.disable();
    this.loadAccountData();
  }

  saveChanges() {
    if (this.userInforForm.invalid) {
      Object.keys(this.userInforForm.controls).forEach(field => {
        const control = this.userInforForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    if (!this.account) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha encontrado la cuenta',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if(!this.userImageUrl ){
      Swal.fire({
        title: 'Error',
        text: 'No se ha encontrado la imagen para la cuenta',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const formValues = this.userInforForm.getRawValue();

    const cuentaActualizar: UpdateUsuarioDTO = {
      id: this.account.id,
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      imageUrl: this.userImageUrl
    };

    
    this.usuarioService.updateUsuario(cuentaActualizar).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Datos Actualizados',
          text: data.message || 'La cuenta se ha actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.disableEditing();
        this.obtenerInformacionUsuario();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.reply || 'No se pudieron actualizar los datos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  public loadAccountData() {
    if (this.account) {
      this.userInforForm.patchValue({
        email: this.account.email,
        nombre: this.account.nombre,
        apellido: this.account.apellido,
        rol: this.account.rol,
        estado: this.account.estado
      });
    }

    this.userImageUrl = this.tokenService.getUserImageUrl();
  }

  public obtenerInformacionUsuario() {
      const email = this.tokenService.getEmail();
      const rol = this.tokenService.getRol();
      this.usuarioService.getUsuarioById(this.tokenService.getIDCuenta()).subscribe({
        next: (data) => {
          this.account = data.message;
          this.loadAccountData();
        },
        error: (error) => {
          Swal.close();
          Swal.fire({
            title: 'Error',
            text: error.error.message || 'No se pudo obtener la información de la cuenta',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  // Updated error message methods to match form control names
  getNameErrorMessage(): string {
    const nameControl = this.userInforForm.get('nombre');

    if (nameControl?.hasError('required')) {
      return 'El nombre es obligatorio';
    }
    if (nameControl?.hasError('maxlength')) {
      return `El nombre no debe exceder los ${nameControl.getError('maxlength').requiredLength} caracteres`;
    }
    if (nameControl?.hasError('pattern')) {
      return 'El nombre solo puede contener letras y espacios';
    }

    return 'Por favor ingrese un nombre válido';
  }

  getApellidoErrorMessage(): string {
    const apellidoControl = this.userInforForm.get('apellido');

    if (apellidoControl?.hasError('required')) {
      return 'El apellido es obligatorio';
    }
    if (apellidoControl?.hasError('minlength')) {
      return `El apellido debe tener al menos ${apellidoControl.getError('minlength').requiredLength} caracteres`;
    }
    if (apellidoControl?.hasError('maxlength')) {
      return `El apellido no debe exceder los ${apellidoControl.getError('maxlength').requiredLength} caracteres`;
    }
    if (apellidoControl?.hasError('pattern')) {
      return 'El apellido solo puede contener letras y espacios';
    }
    return 'Por favor ingrese un apellido válido';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.userInforForm.get('password');

    if (passwordControl?.hasError('minlength')) {
      return `La contraseña debe tener al menos ${passwordControl.getError('minlength').requiredLength} caracteres`;
    }

    if (passwordControl?.hasError('maxlength')) {
      return `La contraseña no debe exceder los ${passwordControl.getError('maxlength').requiredLength} caracteres`;
    }

    if (passwordControl?.hasError('pattern')) {
      // Mensajes detallados para cada requisito
      const value = passwordControl.value || '';
      if (!/[A-Z]/.test(value)) {
        return 'La contraseña debe contener al menos una letra mayúscula';
      }
      if (!/[a-z]/.test(value)) {
        return 'La contraseña debe contener al menos una letra minúscula';
      }
      if (!/\d/.test(value)) {
        return 'La contraseña debe contener al menos un número';
      }
      if (!/[\W_]/.test(value)) {
        return 'La contraseña debe contener al menos un carácter especial';
      }
      return 'La contraseña no cumple con los requisitos de seguridad';
    }
    return 'Por favor ingrese una contraseña válida';
  }

  // Updated to match form control names
  shouldShowError(controlName: string): boolean {
    const control = this.userInforForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
