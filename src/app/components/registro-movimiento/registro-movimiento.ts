import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventarioDTO } from '../../dtos/producto/inventario-dto';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-registro-movimiento',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-movimiento.html',
  styleUrl: './registro-movimiento.css'
})
export class RegistroMovimiento {
  movimientoForm: FormGroup;
  tipos: string[] = ['ENTRADA', 'SALIDA', 'AJUSTE'];
  tipo: string = 'ENTRADA';
  productoId: number | null = null;

  constructor(private inventarioService: InventarioService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.movimientoForm = this.fb.group({
      productoId: [{ value: '', disabled: true }, Validators.required],
      usuarioId: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      descripcion: ['', Validators.required],
      tipo: ['ENTRADA', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productoId = +params['id'];
      this.movimientoForm.patchValue({ productoId: this.productoId });
    });
  }

  registrarMovimiento() {
    if (this.movimientoForm.invalid) return;
    const { tipo, ...rest } = this.movimientoForm.getRawValue();
    const dto: InventarioDTO = {
      ...rest,
      productoId: this.productoId!
    };
    this.tipo = this.movimientoForm.get('tipo')?.value;
    if(this.tipo === 'ENTRADA') {
      this.inventarioService.registrarEntradaInventario(dto).subscribe({
        next: data => {
          alert('Entrada registrada exitosamente');
          this.movimientoForm.reset();
        },
        error: error => {
          alert('Error al registrar la entrada: ' + error.error.message);
        }
      });
    }
    if(this.tipo === 'SALIDA') {
      this.inventarioService.registrarSalidaInventario(dto).subscribe({
        next: data => {
          alert('Salida registrada exitosamente');
          this.movimientoForm.reset();
        },
        error: error => {
          alert('Error al registrar la salida: ' + error.error.message);
        }
      });
    }
    if(this.tipo === 'AJUSTE') {
      this.inventarioService.registrarAjusteInventario(dto).subscribe({
        next: data => {
          alert('Ajuste registrado exitosamente');
          this.movimientoForm.reset();
        },
        error: error => {
          alert('Error al registrar el ajuste: ' + error.error.message);
        }
      });
    }
    // Aquí deberías llamar al servicio correspondiente según el tipo de movimiento
    console.log('Movimiento a registrar:', dto);
  }
}
