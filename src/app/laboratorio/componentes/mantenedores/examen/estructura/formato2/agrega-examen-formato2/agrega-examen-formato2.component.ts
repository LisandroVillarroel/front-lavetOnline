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
  selector: 'app-agrega-examen-formato2',
  templateUrl: './agrega-examen-formato2.component.html',
  styleUrls: ['./agrega-examen-formato2.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaExamenFormatro2Component implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaExamenFormatro2Component>);

  private servicioService = inject(ExamenService);

  datoExamen!: IExamen;
  visibleCampo = signal<boolean>(true);
  visibleEstructura = signal<boolean>(true);
  constructor() {}

  tipoEstructura = new FormControl('', [Validators.required]);
  nombreExamen = new FormControl('', [Validators.required]);
  nombreTituloDescripcion = new FormControl('', [Validators.required]);
  nombreTituloResultado = new FormControl('', [Validators.required]);

  agregaExamen = signal<FormGroup>(
    new FormGroup({
      tipoEstructura: this.tipoEstructura,
      nombreExamen: this.nombreExamen,
      nombreTituloDescripcion: this.nombreTituloDescripcion,
      nombreTituloResultado: this.nombreTituloResultado,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'tipoEstructura') {
      return this.tipoEstructura.hasError('required')
        ? 'Debes Seleccionar Tipo Estructura'
        : '';
    }
    if (campo === 'nombreExamen') {
      return this.nombreExamen.hasError('required')
        ? 'Debes ingresar Nombre Exámen'
        : '';
    }
    if (campo === 'nombreTituloDescripcion') {
      return this.nombreTituloDescripcion.hasError('required')
        ? 'Debes ingresar Nombre Título Descripción'
        : '';
    }
    if (campo === 'nombreTituloResultado') {
      return this.nombreTituloResultado.hasError('required')
        ? 'Debes ingresar Nombre Titulo Resultado'
        : '';
    }
    return '';
  }

  ngOnInit() {}

  seleccionaTipoEstructura(p: any) {
    this.agregaExamen()
      .get('nombreExamen')!
      .setValidators([Validators.nullValidator]);

    this.agregaExamen()
      .get('nombreTituloDescripcion')!
      .setValidators([Validators.nullValidator]);

    this.agregaExamen()
      .get('nombreTituloResultado')!
      .setValidators([Validators.nullValidator]);

    this.agregaExamen().get('nombreExamen')!.setValue('');

    this.agregaExamen().get('nombreTituloDescripcion')!.setValue('');

    this.agregaExamen().get('nombreTituloResultado')!.setValue('');

    if (p == 'Campo') {
      this.visibleCampo.set(false);
      this.visibleEstructura.set(true);
      this.agregaExamen()
        .get('nombreExamen')!
        .setValidators([Validators.required]);
    } else {
      this.visibleCampo.set(true);
      this.visibleEstructura.set(false);
      this.agregaExamen()
        .get('nombreTituloDescripcion')!
        .setValidators([Validators.required]);

      this.agregaExamen()
        .get('nombreTituloResultado')!
        .setValidators([Validators.required]);
    }

    this.agregaExamen().get('nombreExamen')!.updateValueAndValidity();
    this.agregaExamen()
      .get('nombreTituloDescripcion')!
      .updateValueAndValidity();
    this.agregaExamen().get('nombreTituloResultado')!.updateValueAndValidity();
    return;
  }

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
