import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginDTO } from '../../dtos/auth/login-dto';
import { TokenDTO } from '../../dtos/auth/token-dto';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  codeSent = false;
  errorMsg = '';
  step = 1;

  constructor(private fb: FormBuilder, private authService: AuthService, private tokenService: TokenService) {
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
