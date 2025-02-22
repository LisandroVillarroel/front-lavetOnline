import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';

import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { PropietarioService } from '@laboratorio/servicios/propietario.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IPropietario } from '@laboratorio/modelos/propietario-modelo';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-agrega',
  templateUrl: './agrega-propietario.component.html',
  styleUrls: ['./agrega-propietario.component.scss'],
  imports: [MATERIAL_MODELO],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AgregaPropietarioComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaPropietarioComponent>);

  private propietarioService = inject(PropietarioService);

  datoPropietario!: IPropietario;

  constructor() { }

  rutPropietario = new FormControl('', [Validators.required, this.validaRut]);
  nombres = new FormControl('', [Validators.required]);
  apellidoPaterno = new FormControl('', [Validators.required]);
  apellidoMaterno = new FormControl('', [Validators.required]);
  direccion = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);

  agrega = signal<FormGroup>(new FormGroup({
    rutPropietario: this.rutPropietario,
    nombres: this.nombres,
    apellidoPaterno: this.apellidoPaterno,
    apellidoMaterno: this.apellidoMaterno,
    direccion: this.direccion,
    telefono: this.telefono,
    email: this.email,
  }));

  getErrorMessage(campo: string) {
    if (campo === 'rutPropietario') {
      return this.rutPropietario.hasError('required') ? 'Debes ingresar Rut' :
        this.rutPropietario.hasError('rutInvalido') ? 'Rut Inválido' : '';
    }
    if (campo === 'nombres') {
      return this.nombres.hasError('required') ? 'Debes ingresar Nombres' : '';
    }
    if (campo === 'apellidoPaterno') {
      return this.apellidoPaterno.hasError('required') ? 'Debes ingresar Apellido Paterno' : '';
    }
    if (campo === 'apellidoMaterno') {
      return this.apellidoMaterno.hasError('required') ? 'Debes ingresar Apellido Materno' : '';
    }
    if (campo === 'direccion') {
      return this.direccion.hasError('required') ? 'Debes ingresar Dirección' : '';
    }
    if (campo === 'telefono') {
      return this.telefono.hasError('required') ? 'Debes ingresar Teléfono' : '';
    }
    if (campo === 'email') {
      return this.email.hasError('required') ? 'Debes ingresar Email' : '';
    }

    return '';
  }

  validaRut(control: FormControl): { [s: string]: boolean } {
    console.log('uno', control.value);
    // let out1_rut = this.rutService.getRutChile(0, '12514508-6');
    if (validateRut(control.value) === false) {
      return { rutInvalido: true };
    }
    return null as any;
  }

  onBlurRut(event: any) {
    const rut = event.target.value;

    if (validateRut(rut) === true) {
      this.agrega().get('rutPropietario')!.setValue(formatRut(rut, RutFormat.DOTS_DASH));
    }
  }

  ngOnInit() {
  }

  enviar() {
    this.datoPropietario = {
      rutPropietario: this.agrega().get('rutPropietario')!.value.toUpperCase(),
      nombres: this.agrega().get('nombres')!.value,
      apellidoPaterno: this.agrega().get('apellidoPaterno')!.value,
      apellidoMaterno: this.agrega().get('apellidoMaterno')!.value,
      region: 'Sin Region',
      comuna: 'Sin Comuna',
      direccion: this.agrega().get('direccion')!.value,
      telefono: this.agrega().get('telefono')!.value,
      email: this.agrega().get('email')!.value,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!
    };

    this.propietarioService.postDataPropietario(this.datoPropietario)
      .subscribe({
        next: (dato) => {
          console.log('respuesta:', dato.codigo);
          if (dato.codigo === 200) {
            Swal.fire(
              'Ya se agrego con Exito',
              'Click en Boton!',
              'success'
            ); // ,
            this.dialogRef.close(1);
          } else {
            Swal.fire(
              dato.mensaje,
              'Click en Boton!',
              'error'
            );
            this.dialogRef.close(1);
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

