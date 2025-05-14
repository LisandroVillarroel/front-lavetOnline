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
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import {
  IEstructuraDetalleFormato2,
  IListaResultadoFormato2,
} from '@laboratorio/modelos/examenes/examenFormato2';
import { UnidadMedidaService } from '@laboratorio/servicios/unidad-medida.service';

import Swal from 'sweetalert2';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatChipsModule,
  MatIconModule,
];

@Component({
  selector: 'app-agrega-estructura-detalle',
  templateUrl: './agrega-estructura-detalle.component.html',
  styleUrls: ['./agrega-estructura-detalle.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaEstructuraDetalleComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaEstructuraDetalleComponent>);

  private unidadMedidaService = inject(UnidadMedidaService);

  resultadoEstructuraDetalleFormato2: IEstructuraDetalleFormato2 | undefined;

  public datoUnidadMedida = signal<IUnidadMedida[]>([]);
  visibleEstructuraNumero = signal<boolean>(true);
  visibleEstructuraLista = signal<boolean>(true);
  /****************Ship */
  listaCampo = signal<any>([]);
  readonly listaCampoShip = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);

  removeReactiveKeyword(keyword: string) {
    this.listaCampo.update((keywords) => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.listaCampo.update((keywords) => [...keywords, value]);
      this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  /*********************** */
  constructor() {}

  nombreDescripcion = new FormControl('', [Validators.required]);
  tipoCampoResultado = new FormControl('', [Validators.required]);
  cantidadDecimales = new FormControl('');
  unidadMedida = new FormControl('', [Validators.required]);

  agregaEstructuraDetalle = signal<FormGroup>(
    new FormGroup({
      nombreDescripcion: this.nombreDescripcion,
      tipoCampoResultado: this.tipoCampoResultado,
      cantidadDecimales: this.cantidadDecimales,
      unidadMedida: this.unidadMedida,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombreDescripcion') {
      return this.nombreDescripcion.hasError('required')
        ? 'Debes Ingresar Nombre Descripción'
        : '';
    }
    if (campo === 'tipoCampoResultado') {
      return this.tipoCampoResultado.hasError('required')
        ? 'Debes Seleccionar Tipo Campo Resultado'
        : '';
    }
    if (campo === 'unidadMedida') {
      return this.unidadMedida.hasError('required')
        ? 'Debes Seleccionar Unidad de Medida'
        : '';
    }

    return '';
  }

  ngOnInit() {
    this.cargaUnidadMedida();
  }

  cargaUnidadMedida() {
    this.unidadMedidaService
      .getDataUnidadMedidaTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res: any) => {
          this.datoUnidadMedida.set(res.data);
        },
        // console.log('yo:', res as PerfilI[]),

        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  seleccionaTipoEstructura(p: any) {
    if (p == 'Numero') {
      this.visibleEstructuraLista.set(true); //No muestra
      this.visibleEstructuraNumero.set(false); //Muestra
      this.agregaEstructuraDetalle()
        .get('cantidadDecimales')!
        .setValidators([Validators.required]);
      this.listaCampo.set([]);
    } else {
      if (p == 'Lista') {
        this.visibleEstructuraLista.set(false); //Muestra
        this.visibleEstructuraNumero.set(true); //No Muestra
        this.agregaEstructuraDetalle()
          .get('cantidadDecimales')!
          .setValidators([Validators.nullValidator]);
        this.agregaEstructuraDetalle().get('cantidadDecimales')!.setValue('');
      } else {
        this.visibleEstructuraLista.set(true); //No muestra
        this.visibleEstructuraNumero.set(true); //No Muestra
        this.agregaEstructuraDetalle()
          .get('cantidadDecimales')!
          .setValidators([Validators.nullValidator]);
        this.agregaEstructuraDetalle().get('cantidadDecimales')!.setValue('');
        this.listaCampo.set([]);
      }
    }

    this.agregaEstructuraDetalle()
      .get('cantidadDecimales')!
      .updateValueAndValidity();

    return;
  }

  enviar() {
    console.log('envia:', this.listaCampo());
    let listaResultado_: IListaResultadoFormato2[] = [];

    for (let a = 0; a < this.listaCampo().length; a++) {
      console.log('this.listaCampo()[a]:', this.listaCampo()[a]);
      listaResultado_[a] = { nombreLista: this.listaCampo()[a] };
    }
    this.resultadoEstructuraDetalleFormato2 = {
      nombreDescripcion:
        this.agregaEstructuraDetalle().get('nombreDescripcion')!.value,
      tipoCampoResultado:
        this.agregaEstructuraDetalle().get('tipoCampoResultado')!.value,
      cantidadDecimales:
        this.agregaEstructuraDetalle().get('cantidadDecimales')!.value,
      unidadMedida: this.agregaEstructuraDetalle().get('unidadMedida')!.value,
      listaResultado: listaResultado_,
      flagNegrilla: false,
      formula: '',
      formulaInterna: '',
    };
    console.log(
      'resultadoEstructuraDetalleFormato2:',
      this.resultadoEstructuraDetalleFormato2
    );

    this.dialogRef.close(this.resultadoEstructuraDetalleFormato2);
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
