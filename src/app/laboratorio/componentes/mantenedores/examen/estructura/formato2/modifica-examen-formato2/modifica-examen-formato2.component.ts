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
import { IResultadoFormato2 } from '@laboratorio/modelos/examenes/examenFormato2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
];

@Component({
  selector: 'app-modifica-examen-formato2',
  templateUrl: './modifica-examen-formato2.component.html',
  styleUrls: ['./modifica-examen-formato2.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaExamenFormatro2Component implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly datoExamen = inject<IResultadoFormato2>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ModificaExamenFormatro2Component>);

  resultadoExamenFormato2: IResultadoFormato2 | undefined;

  visibleCampo = signal<boolean>(true);
  visibleEstructura = signal<boolean>(true);
  constructor() {}

  tipoEstructura = new FormControl(this.datoExamen.tipoEstructura, [
    Validators.required,
  ]);
  nombreExamen = new FormControl(this.datoExamen.nombreExamen, [
    Validators.required,
  ]);
  nombreTituloDescripcion = new FormControl(
    this.datoExamen.nombreTituloDescripcion
  );
  nombreTituloResultado = new FormControl(
    this.datoExamen.nombreTituloResultado
  );

  modificaExamen = signal<FormGroup>(
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
    /*  this.modificaExamen()
      .get('nombreTituloDescripcion')!
      .setValidators([Validators.nullValidator]);

    this.modificaExamen()
      .get('nombreTituloResultado')!
      .setValidators([Validators.nullValidator]);
*/
    this.modificaExamen().get('nombreTituloDescripcion')!.setValue('');

    this.modificaExamen().get('nombreTituloResultado')!.setValue('');

    if (p == 'Campo') {
      this.visibleCampo.set(false);
      this.visibleEstructura.set(true);
    } else {
      this.visibleCampo.set(true);
      this.visibleEstructura.set(false);
    }
    /*
    this.modificaExamen()
      .get('nombreTituloDescripcion')!
      .updateValueAndValidity();
    this.modificaExamen()
      .get('nombreTituloResultado')!
      .updateValueAndValidity();
      */
    return;
  }

  enviar() {
    let resultadoNombreExamen_ = '';
    let nombreTituloDescripcion_ = '';
    let nombreTituloResultado_ = '';

    if (this.modificaExamen().get('tipoEstructura')!.value == 'Estructura') {
      nombreTituloDescripcion_ = this.modificaExamen().get(
        'nombreTituloDescripcion'
      )!.value;
      nombreTituloResultado_ = this.modificaExamen().get(
        'nombreTituloResultado'
      )!.value;
    }
    this.resultadoExamenFormato2 = {
      _id: this.datoExamen._id,
      nombreExamen: this.modificaExamen().get('nombreExamen')!.value,
      resultadoNombreExamen: resultadoNombreExamen_,
      tipoEstructura: this.modificaExamen().get('tipoEstructura')!.value,
      nombreTituloDescripcion: nombreTituloDescripcion_,
      nombreTituloResultado: nombreTituloResultado_,
      estructuraDetalle: [],
    };

    this.dialogRef.close(this.resultadoExamenFormato2);
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
