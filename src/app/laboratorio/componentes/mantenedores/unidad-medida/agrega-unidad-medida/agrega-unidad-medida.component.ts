import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';
import { UnidadMedidaService } from '@laboratorio/servicios/unidad-medida.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-agrega-unidad-medida',
  templateUrl: './agrega-unidad-medida.component.html',
  styleUrls: ['./agrega-unidad-medida.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgregaUnidadMedidaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaUnidadMedidaComponent>);

  private unidadMedidaService = inject(UnidadMedidaService);

  datoUnidadMedida!: IUnidadMedida;

  constructor() { }

  nombre = new FormControl('', [Validators.required]);

  agregaUnidadMedida = signal<FormGroup>(new FormGroup({
    nombre: this.nombre,
  })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    return '';
  }

  ngOnInit() {
    this.spinnerService.esconder();
  }

  enviar() {
    this.spinnerService.mostrar();
    this.datoUnidadMedida = {
      nombre: this.agregaUnidadMedida().get('nombre')!.value,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };

    this.unidadMedidaService.postDataUnidadMedida(this.datoUnidadMedida).subscribe({
      next: (dato) => {
        console.log('respuesta:', dato);
        console.log('respuesta:', dato.mensaje);
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', '', 'success'); // ,
          this.dialogRef.close(1);
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      },
      error: (error) => {
        this.spinnerService.esconder();
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }
}
