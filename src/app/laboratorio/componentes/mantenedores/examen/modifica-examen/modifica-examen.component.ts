import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
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
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { ExamenService } from '@laboratorio/servicios/examen.service';

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
  selector: 'app-modifica-examen',
  templateUrl: './modifica-examen.component.html',
  styleUrls: ['./modifica-examen.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaExamenComponent>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  private servicioService = inject(ExamenService);

  datoExamen!: IExamen;
  show = signal<boolean>(false);

  constructor() {
    //  this.datoPar = data;
    //  console.log('dato update: ', data);
    // this.id = data.id;
    // this.rutEmpresa: data.rutEmpresa;
    // this.razonSocialPar = data.razonSocial;
    // nombreFantasia: string;
    // direccion: string;
    // usuario: string;
  }
  codigoExamen = new FormControl(this.data.codigoExamen);
  nombre = new FormControl(this.data.nombre, [Validators.required]);
  sigla = new FormControl(this.data.sigla, [Validators.required]);
  precio = new FormControl(this.data.precio, [Validators.required]);
  tiempoPreparacion = new FormControl(this.data.tiempoPreparacion, [
    Validators.required,
  ]);
  codigoInterno = new FormControl(this.data.codigoInterno, [
    Validators.required,
  ]);
  numeroFormatoInterno = new FormControl(this.data.numeroFormatoInterno);
  internoExterno = new FormControl(this.data.internoExterno);
  categoria = new FormControl(this.data.categoria);
  tipoExamen = new FormControl(this.data.tipoExamen);
  tituloExamen = new FormControl(this.data.tituloExamen);

  modifica = signal<FormGroup>(
    new FormGroup({
      codigoExamen: this.codigoExamen,
      nombre: this.nombre,
      sigla: this.sigla,
      precio: this.precio,
      tiempoPreparacion: this.tiempoPreparacion,
      codigoInterno: this.codigoInterno,
      numeroFormatoInterno: this.numeroFormatoInterno,
      internoExterno: this.internoExterno,
      categoria: this.categoria,
      tipoExamen: this.tipoExamen,
      tituloExamen: this.tituloExamen,
    })
  );

  getErrorMessage(campo: any) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }
    if (campo === 'sigla') {
      return this.sigla.hasError('required') ? 'Debes ingresar Sigla' : '';
    }
    if (campo === 'precio') {
      return this.precio.hasError('required') ? 'Debes ingresar Precio' : '';
    }
    if (campo === 'tiempoPreparacion') {
      return this.tiempoPreparacion.hasError('required')
        ? 'Debes ingresar Tiempo Preparación'
        : '';
    }
    if (campo === 'tituloExamen') {
      return this.tituloExamen.hasError('required')
        ? 'Debes ingresar Título EXAMEN'
        : '';
    }
    return '';
  }

  ngOnInit() {
    if (
      this.localStorage?.usuarioLogin.empresaConectada.tipoEmpresa?.toUpperCase() ==
      'Laboratorio'.toUpperCase()
    ) {
      this.show.set(true);
    }
  }

  enviar() {
    this.datoExamen = {
      _id: this.data._id,
      codigoExamen: this.modifica().get('codigoExamen')!.value,
      nombre: this.modifica().get('nombre')!.value,
      sigla: this.modifica().get('sigla')!.value,
      precio: this.modifica().get('precio')!.value,
      tiempoPreparacion: this.modifica().get('tiempoPreparacion')!.value,
      codigoInterno: this.modifica().get('codigoInterno')!.value,
      numeroFormatoInterno: this.modifica().get('numeroFormatoInterno')!.value,
      internoExterno: this.modifica().get('internoExterno')!.value,
      categoria: this.modifica().get('categoria')!.value,
      tipoExamen: this.modifica().get('tipoExamen')!.value,
      tituloExamen: this.modifica().get('tituloExamen')!.value.toUpperCase(),
      empresa_Id: this.data.empresa_Id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    this.servicioService.putDataExamen(this.datoExamen).subscribe((dato) => {
      console.log('respuesta:', dato);
      console.log('respuesta:', dato.mensaje);
      if (dato.codigo === 200) {
        Swal.fire('Se agregó con Éxito', '', 'success');
        this.dialogRef.close(1);
      } else {
        if (dato.codigo != 500) {
          Swal.fire(dato.mensaje, '', 'error');
        } else {
          console.log('Error EXAMEN:', dato);
          Swal.fire('', 'ERROR SISTEMA', 'error');
        }
      }
    });
  }

  onUploadStateChanged(state: boolean) {
    console.log('paso3: ', state);
  }

  comparaSeleccionaTipoExamen(v1: any, v2: any): boolean {
    console.log('v1:', v1);
    console.log('v2:', v2);
    return v1 === v2;
  }
}
