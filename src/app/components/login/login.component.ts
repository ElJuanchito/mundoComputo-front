import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginDTO } from '../../dtos/auth/login-dto';
import { TokenDTO } from '../../dtos/auth/token-dto';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  codeSent = false;
  errorMsg = '';
  step = 1;
  countdown: number = 0;
  countdownDisplay: string = '';
  countdownInterval: any = null;
  imagen = 'https://ywxctrqpfxgdwfcfccbj.supabase.co/storage/v1/object/public/mundoComputo-bucket/logo.png';

  constructor(private fb: FormBuilder, private authService: AuthService, private tokenService: TokenService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      code: ['', Validators.required]
    });
  }

  sendCode() {
    const email = this.loginForm.get('email')?.value;
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
          text: error.error.reply
        });
        this.loading = false;
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

  login() {
    if (this.loginForm.invalid) return;
    this.loading = true;

    const loginDTO = this.loginForm.value as LoginDTO;

    this.authService.login(loginDTO).subscribe({
      next: (res) => {
        const TokenDTO = res.message as TokenDTO;
        this.tokenService.login(TokenDTO.token);
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inicio de sesión exitoso.'
        });

        this.router.navigate(['/admin/gestion-usuarios']);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.reply
        });
        this.loading = false;
      }
    });
  }
}
