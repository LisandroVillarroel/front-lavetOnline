import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { EspecieService } from '@laboratorio/servicios/especie.service';
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
    selector: 'app-agrega-especie',
    templateUrl: './agrega-especie.component.html',
    styleUrls: ['./agrega-especie.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgregaEspecieComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaEspecieComponent>);

  private especieService = inject(EspecieService);

  datoEspecie!: IEspecie;

  constructor() { }

  nombre = new FormControl('', [Validators.required]);

  agregaEspecie = signal<FormGroup>(new FormGroup({
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
    this.datoEspecie = {
      nombre: this.agregaEspecie().get('nombre')!.value,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };

    this.especieService.postDataEspecie(this.datoEspecie).subscribe({
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
            console.log('Error Especie:', dato);
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
