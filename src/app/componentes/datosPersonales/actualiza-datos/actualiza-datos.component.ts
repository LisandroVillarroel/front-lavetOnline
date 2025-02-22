import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { loginInterface } from '@autentica/interface/loginInterface';
import { formatRut, RutFormat, validateRut } from '@fdograph/rut-utilities';
import { IUsuario } from '@modelos/usuario-modelo';
import { UsuarioService } from '@servicios/usuario.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';
import { SpinnerService } from '@shared/spinner/spinner.service';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-actualiza-datos',
  templateUrl: './actualiza-datos.component.html',
  styleUrls: ['./actualiza-datos.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActualizaDatosComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private usuarioService = inject(UsuarioService);

  datoUsuario!: IUsuario;

  imagen = './assets/imagenes/';

  imagen64: any;
  archivo: {
    nombre: string;
    nombreArchivo: string;
    base64textString: string;
    ruta: string;
  } = {
      nombre: '',
      nombreArchivo: '',
      base64textString: '',
      ruta: '',
    };
  constructor() { }

  rutUsuario = new FormControl('', [Validators.required, this.validaRut]);

  nombres = new FormControl('', [Validators.required]);
  apellidoPaterno = new FormControl('', [Validators.required]);
  apellidoMaterno = new FormControl('', [Validators.required]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  telefono = new FormControl('', [Validators.required]);
  direccion = new FormControl('', [Validators.required]);

  modificaUsuario = signal<FormGroup>(
    new FormGroup({
      rutUsuario: this.rutUsuario,
      nombres: this.nombres,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,

      // address: this.addressFormControl
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'rutUsuario') {
      return this.rutUsuario.hasError('required')
        ? 'Debes ingresar Rut'
        : this.rutUsuario.hasError('rutInvalido')
          ? 'Rut Inválido'
          : '';
    }
    if (campo === 'nombres') {
      return this.nombres.hasError('required') ? 'Debes ingresar Nombres' : '';
    }
    if (campo === 'apellidoPaterno') {
      return this.apellidoPaterno.hasError('required')
        ? 'Debes ingresar Apellido Paterno'
        : '';
    }
    if (campo === 'apellidoMaterno') {
      return this.apellidoMaterno.hasError('required')
        ? 'Debes ingresar Apellido Materno'
        : '';
    }
    if (campo === 'direccion') {
      return this.direccion.hasError('required')
        ? 'Debes ingresar Dirección'
        : '';
    }
    if (campo === 'telefono') {
      return this.telefono.hasError('required')
        ? 'Debes ingresar Teléfono'
        : '';
    }
    if (campo === 'email') {
      return this.email.hasError('required') ? 'Debes ingresar Email' : '';
    }
    return '';
  }

  async ngOnInit() {
    await this.getListUsuario();
    this.spinnerService.esconder();
  }

  getListUsuario(): void {
    console.log('pasa ficha 2');
    this.usuarioService
      .getDataUsuarioId(this.localStorage?.usuarioLogin._id!)
      .subscribe({
        next: (res) => {
          console.log('usuario: ', res.data);
          this.modificaUsuario()
            .get('rutUsuario')!
            .setValue(res.data[0].rutUsuario);
          this.modificaUsuario().get('nombres')!.setValue(res.data[0].nombres);
          this.modificaUsuario()
            .get('apellidoPaterno')!
            .setValue(res.data[0].apellidoPaterno);
          this.modificaUsuario()
            .get('apellidoMaterno')!
            .setValue(res.data[0].apellidoMaterno);
          this.modificaUsuario().get('email')!.setValue(res.data[0].email);
          this.modificaUsuario()
            .get('telefono')!
            .setValue(res.data[0].telefono);
          this.modificaUsuario()
            .get('direccion')!
            .setValue(res.data[0].direccion);
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  enviar() {
    this.spinnerService.mostrar();
    this.datoUsuario = {
      _id: this.localStorage?.usuarioLogin._id,
      rutUsuario: this.modificaUsuario().get('rutUsuario')!.value.toUpperCase(),
      nombres: this.modificaUsuario().get('nombres')!.value,
      apellidoPaterno: this.modificaUsuario().get('apellidoPaterno')!.value,
      apellidoMaterno: this.modificaUsuario().get('apellidoMaterno')!.value,
      telefono: this.modificaUsuario().get('telefono')!.value,
      email: this.modificaUsuario().get('email')!.value,
      direccion: this.modificaUsuario().get('direccion')!.value,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    this.usuarioService
      .putDataUsuario(this.datoUsuario)
      .subscribe((dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se Actualizó con Éxito', '', 'success'); // ,
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Usuario:', dato);
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      });
  }

  // Error handling

  validaRut(control: FormControl): { [s: string]: boolean } {
    // let out1_rut = this.rutService.getRutChile(0, '12514508-6');
    if (validateRut(control.value) === false) {
      return { rutInvalido: true };
    }
    return null as any;
  }

  onBlurRutUsuario(event: any) {
    const rut = event.target.value;

    if (validateRut(rut) === true) {
      this.modificaUsuario()
        .get('rutUsuario')!
        .setValue(formatRut(rut, RutFormat.DOTS_DASH));
    }
  }
}
