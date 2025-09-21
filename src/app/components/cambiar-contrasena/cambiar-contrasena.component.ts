import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangePasswordDTO } from '../../dtos/auth/change-password-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-contrasena.component',
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent {
  imagen = 'https://ywxctrqpfxgdwfcfccbj.supabase.co/storage/v1/object/public/mundoComputo-bucket/logo.png';
  codeSent = false;
  passwordForm: FormGroup;
  loading = false;
  errorMsg = '';
  countdown: number = 0;
  countdownDisplay: string = '';
  countdownInterval: any = null;
  email: string | null = null;

    constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.email = this.route.snapshot.queryParamMap.get('email');

    this.passwordForm = this.fb.group({
      email: [{ value: this.email || '', disabled: !!this.email }, [Validators.required, Validators.email]],
  newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      code: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  async sendCode() {
      const email = this.passwordForm.get('email')?.value;
      if (!email) {
        this.errorMsg = 'Ingresa un correo válido para recibir el código.';
        return;
      }
      this.loading = true;
      this.authService.sendVerificationCode(email).subscribe({
        next: () => {
          this.codeSent = true;
          this.errorMsg = '';
          this.loading = false;
          this.startCountdown(15 * 60); // 15 minutos en segundos
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message
          });
          this.loading = false;
        }
      });
    }

  changePassword() {
    if (this.passwordForm.invalid) return;
    const changePasswordDTO = this.passwordForm.value as ChangePasswordDTO;
    this.authService.changePassword(changePasswordDTO).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Contraseña cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        });
      }
    });
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    this.updateCountdownDisplay();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.updateCountdownDisplay();
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownDisplay = 'El código ha expirado.';
      }
    }, 1000);
  }

  updateCountdownDisplay() {
    const min = Math.floor(this.countdown / 60);
    const sec = this.countdown % 60;
    this.countdownDisplay = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
