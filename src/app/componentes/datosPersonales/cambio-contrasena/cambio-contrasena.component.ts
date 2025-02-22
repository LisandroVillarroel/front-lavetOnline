import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IUsuarioContrasena } from '@modelos/usuario-modelo';
import { UsuarioService } from '@servicios/usuario.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatDividerModule,
  MatButtonModule,
];

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CambioContrasenaComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');

  datoUsuario!: IUsuarioContrasena;
  existeContrasenaActual = signal(true);
  mensajeErrorContrasenaActual = '';

  constructor() { }

  validarQueSeanIguales: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('contrasena');
    const confirmarPassword = control.get('contrasena2');

    return password?.value === confirmarPassword?.value
      ? null
      : { noSonIguales: true };
  };

  contrasenaActual = new FormControl('', [Validators.required]);
  contrasena = new FormControl('', [Validators.required]);
  contrasena2 = new FormControl('', [Validators.required]);

  // modificaContrasena: FormGroup = new FormGroup(
  modificaContrasena = signal<FormGroup>(
    new FormGroup(
      {
        contrasenaActual: this.contrasenaActual,
        contrasena: this.contrasena,
        contrasena2: this.contrasena2,
        // address: this.addressFormControl
      },
      { validators: [this.validarQueSeanIguales] }
    )
  );

  checarSiSonIguales(): boolean {
    if (
      this.modificaContrasena().hasError('noSonIguales') &&
      this.modificaContrasena().get('contrasena')?.dirty &&
      this.modificaContrasena().get('contrasena2')?.dirty
    ) {
      return true;
    }
    return false;
  }

  getErrorMessage(campo: string) {
    if (campo === 'contrasenaActual') {
      return this.contrasenaActual.hasError('required')
        ? 'Debes ingresar Contraseña Actual'
        : '';
    }
    if (campo === 'contrasena') {
      return this.contrasena.hasError('required')
        ? 'Debes ingresar Contraseña'
        : '';
    }
    if (campo === 'contrasena2') {
      return this.contrasena2.hasError('required')
        ? 'Debes ingresar Segúnda Contraseña'
        : '';
    }

    return '';
  }

  ngOnInit(): void { }

  enviar() {
    this.datoUsuario = {
      _id: this.localStorage?.usuarioLogin._id,
      contrasenaActual:
        this.modificaContrasena().get('contrasenaActual')!.value,
      contrasena: this.modificaContrasena().get('contrasena')!.value,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id,
    };

    this.usuarioService
      .putDataUsuarioContrasena(this.datoUsuario)
      .subscribe((dato) => {
        console.log('respuesta:', dato);
        if (dato.codigo === 200) {
          this.existeContrasenaActual.set(true);
          this.mensajeErrorContrasenaActual = '';
          Swal.fire('Se Actualizó con Éxito', '', 'success'); // ,
        } else {
          if (dato.codigo != 500) {
            this.mensajeErrorContrasenaActual = dato.mensaje;
            this.existeContrasenaActual.set(false);
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      });
  }
}
