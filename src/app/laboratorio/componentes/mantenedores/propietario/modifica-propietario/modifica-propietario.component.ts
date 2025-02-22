import { Component, OnInit, Inject, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { formatRut, RutFormat, validateRut } from '@fdograph/rut-utilities';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { IPropietario } from '@laboratorio/modelos/propietario-modelo';
import { PropietarioService } from '@laboratorio/servicios/propietario.service';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatTreeModule,
  MatCheckboxModule,
  MatSelectModule,
];

@Component({
  selector: 'app-modifica-propietario',
  templateUrl: './modifica-propietario.component.html',
  styleUrls: ['./modifica-propietario.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaPropietarioComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaPropietarioComponent>);
  readonly data = inject<IPropietario>(MAT_DIALOG_DATA);

  private propietarioService = inject(PropietarioService);
  _dato!: IPropietario;

  constructor() {


  }
  rutPropietario = new FormControl(this.data.rutPropietario, [Validators.required]);
  nombres = new FormControl(this.data.nombres, [Validators.required]);
  apellidoPaterno = new FormControl(this.data.apellidoPaterno, [Validators.required]);
  apellidoMaterno = new FormControl(this.data.apellidoMaterno, [Validators.required]);
  direccion = new FormControl(this.data.direccion, [Validators.required]);
  telefono = new FormControl(this.data.telefono, [Validators.required]);
  email = new FormControl(this.data.email, [Validators.required]);


  modificaPropietario = signal<FormGroup>(new FormGroup({
    rutPropietario: this.rutPropietario,
    nombres: this.nombres,
    apellidoPaterno: this.apellidoPaterno,
    apellidoMaterno: this.apellidoMaterno,
    direccion: this.direccion,
    telefono: this.telefono,
    email: this.email,
    // address: this.addressFormControl
  }));

  /*
  getErrorMessage(campo) {
    if (campo === 'rutPropietario'){
      return this.rutPropietario.hasError('required') ? 'Debes ingresar Rut' :
    this.rutPropietario.hasError('rutInvalido') ? 'Rut Inválido' : '';
  }
    if (campo === 'nombres'){
      return this.nombres.hasError('required') ? 'Debes ingresar Nombres'  : '';
  }
    if (campo === 'apellidoPaterno'){
      return this.apellidoPaterno.hasError('required') ? 'Debes ingresar Apellido Paterno' : '';
  }
    if (campo === 'apellidoMaterno'){
    return this.apellidoMaterno.hasError('required') ? 'Debes ingresar Apellido Materno' : '';
  }
    if (campo === 'direccion'){
      return this.direccion.hasError('required') ? 'Debes ingresar Dirección' : '';
  }
    if (campo === 'telefono'){
    return this.telefono.hasError('required') ? 'Debes ingresar Teléfono' : '';
  }
    if (campo === 'email'){
    return this.email.hasError('required') ? 'Debes ingresar Email' : '';
  }

    return '';
  }

*/
  getErrorMessage() {
    return this.rutPropietario.hasError('required') ? 'Debes ingresar Rut' :
      this.rutPropietario.hasError('rutInvalido') ? 'Rut Inválido' :
        this.nombres.hasError('required') ? 'Debes ingresar Nombres' :
          this.apellidoPaterno.hasError('required') ? 'Debes ingresar Apellido Paternoi' :
            this.apellidoMaterno.hasError('required') ? 'Debes ingresar Apellido Materno' :
              this.direccion.hasError('required') ? 'Debes ingresar Dirección' :
                this.telefono.hasError('required') ? 'Debes ingresar Teléfono' :
                  this.email.hasError('required') ? 'Debes ingresar Email' :
                    '';
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
      this.modificaPropietario().get('rutPropietario')!.setValue(formatRut(rut, RutFormat.DOTS_DASH));
    }
  }

  ngOnInit() {
  }

  enviar() {
    this._dato = {
      _id: this.data._id,
      rutPropietario: this.modificaPropietario().get('rutPropietario')!.value.toUpperCase(),
      nombres: this.modificaPropietario().get('nombres')!.value,
      apellidoPaterno: this.modificaPropietario().get('apellidoPaterno')!.value,
      apellidoMaterno: this.modificaPropietario().get('apellidoMaterno')!.value,
      region: 'sin region',
      comuna: 'sin comuna',
      direccion: this.modificaPropietario().get('direccion')!.value,
      telefono: this.modificaPropietario().get('telefono')!.value,
      email: this.modificaPropietario().get('email')!.value,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!
    };

    this.propietarioService.putDataPropietario(this._dato)
      .subscribe({
        next: (res) => {
          // tslint:disable-next-line: no-string-literal
          if (res.codigo === 200) {
            Swal.fire(
              'Ya se agrego con Exito',
              'Click en Boton!',
              'success'
            ),
              this.dialogRef.close(1);
          } else {
            Swal.fire(
              res.mensaje,
              'Click en Boton!',
              'error'
            );
            this.dialogRef.close(1);

          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

}
