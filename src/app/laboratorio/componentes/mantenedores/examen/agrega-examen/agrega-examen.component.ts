import {
  Component,
  OnInit,
  Inject,
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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { IExamen } from '@laboratorio/modelos/examen-modelo';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
];

@Component({
  selector: 'app-agrega-examen',
  templateUrl: './agrega-examen.component.html',
  styleUrls: ['./agrega-examen.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaExamenComponent>);

  private servicioService = inject(ExamenService);

  datoExamen!: IExamen;

  datoInternoExterno = signal([
    { nombre: 'Interno', id: 'Interno' },
    { nombre: 'Externo', id: 'Externo' },
  ]);

  datoCategoria = signal([
    { nombre: 'Hematología', id: 'Hematología' },
    { nombre: 'Bioquímica', id: 'Bioquímica' },
    { nombre: 'Hormonas', id: 'Hormonas' },
    { nombre: 'Orina', id: 'Orina' },
    { nombre: 'Coprológicos', id: 'Coprológicos' },
    { nombre: 'Anatomía Patológica', id: 'Anatomía Patológica' },
    { nombre: 'Microbiológica', id: 'Microbiológica' },
    { nombre: 'Piel y Pelos', id: 'Piel y Pelos' },
    { nombre: 'Fluidos Orgánicos', id: 'Fluidos Orgánicos' },
    {
      nombre: 'Determinaciones Serológicas',
      id: 'Determinaciones Serológicas',
    },
    { nombre: 'Determinación Pcr', id: 'Determinación Pcr' },
  ]);

  constructor() {}

  codigoExamen = new FormControl('', [Validators.required]);
  nombre = new FormControl('', [Validators.required]);
  sigla = new FormControl('', [Validators.required]);
  precio = new FormControl('', [Validators.required]);
  tiempoPreparacion = new FormControl('', [Validators.required]);
  codigoInterno = new FormControl('', [Validators.required]);
  numeroFormatoInterno = new FormControl('', [Validators.required]);
  internoExterno = new FormControl('', [Validators.required]);
  categoria = new FormControl('', [Validators.required]);
  tipoExamen = new FormControl('', [Validators.required]);
  tituloExamen = new FormControl('', [Validators.required]);

  agregaExamen = signal<FormGroup>(
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

  getErrorMessage(campo: string) {
    if (campo === 'codigoExamen') {
      return this.codigoExamen.hasError('required')
        ? 'Debes ingresar Código EXAMEN'
        : '';
    }
    if (campo === 'codigoInterno') {
      return this.codigoInterno.hasError('required')
        ? 'Debes ingresar Codigo Interno'
        : '';
    }
    if (campo === 'numeroFormatoInterno') {
      return this.numeroFormatoInterno.hasError('required')
        ? 'Debes ingresar Codigo Formato'
        : '';
    }
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
        ? 'Debes ingresar Tiempo de Preparación'
        : '';
    }
    if (campo === 'internoExterno') {
      return this.internoExterno.hasError('required')
        ? 'Debes ingresar Interno Externo'
        : '';
    }
    if (campo === 'categoria') {
      return this.categoria.hasError('required')
        ? 'Debes ingresar Categoria'
        : '';
    }
    if (campo === 'tituloExamen') {
      return this.tituloExamen.hasError('required')
        ? 'Debes ingresar Título EXAMEN'
        : '';
    }

    return '';
  }

  ngOnInit() {}

  enviar() {
    this.datoExamen = {
      codigoExamen: this.agregaExamen().get('codigoExamen')!.value,
      codigoInterno: this.agregaExamen().get('codigoInterno')!.value,
      numeroFormatoInterno: this.agregaExamen().get('numeroFormatoInterno')!
        .value,
      nombre: this.agregaExamen().get('nombre')!.value,
      sigla: this.agregaExamen().get('sigla')!.value,
      precio: this.agregaExamen().get('precio')!.value,
      tiempoPreparacion: this.agregaExamen().get('tiempoPreparacion')!.value,
      internoExterno: this.agregaExamen().get('internoExterno')!.value,
      categoria: this.agregaExamen().get('categoria')!.value,
      tipoExamen: this.agregaExamen().get('tipoExamen')!.value,
      tituloExamen: this.agregaExamen().get('tituloExamen')!.value,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };

    this.servicioService.postDataExamen(this.datoExamen).subscribe((dato) => {
      console.log('respuesta:', dato);
      console.log('respuesta:', dato.mensaje);
      if (dato.codigo === 200) {
        Swal.fire('Se agregó con Éxito', 'Click en Boton!', 'success'); // ,
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
  /*
  onUploadFinished(file: FileHolder) {
    console.log('paso1:', file);
    console.log('muestra base64: ', file.src)
    this.imagen64= file.src;
    this.archivo.base64textString=file.src;
    this.archivo.nombreArchivo=file.file.name;
    this.archivo.ruta=this.currentUsuario.usuarioDato.empresa.rutEmpresa;
  }

  onRemoved(file: FileHolder) {
    console.log('paso2: ', file);
    this.imagen64= '';
    this.archivo.base64textString='';
    this.archivo.nombreArchivo='';
    this.archivo.ruta='';
  }
*/
  onUploadStateChanged(state: boolean) {
    console.log('paso3: ', state);
  }
}
