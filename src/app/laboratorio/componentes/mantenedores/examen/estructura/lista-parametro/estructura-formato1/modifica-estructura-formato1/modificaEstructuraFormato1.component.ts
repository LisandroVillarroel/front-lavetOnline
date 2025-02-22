import { ChangeDetectionStrategy, Component, ElementRef, inject, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';;
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamenEstructura } from '@laboratorio/interfaces/examenEstructura-interface';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';
import { UnidadMedidaService } from '@laboratorio/servicios/unidad-medida.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule
];

@Component({
  selector: 'app-modificaEstructuraFormato1',
  templateUrl: './modificaEstructuraFormato1.component.html',
  styleUrls: ['./modificaEstructuraFormato1.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModificaEstructuraFormato1Component implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaEstructuraFormato1Component>);
  readonly data = inject<IExamenEstructura>(MAT_DIALOG_DATA);

  @ViewChild('htmlData') htmlData!: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  private unidadMedidaService = inject(UnidadMedidaService);

  public datoUnidadMedida = signal<IUnidadMedida[]>([]);
  usuario!: string;
  datoFicha!: IFicha;
  datoFichaRespuesta!: IFicha;
  /*datoExamen!: IExamen[];*/

  //IResultadoFormato1: IResultadoFormato1[]=this.data.resultado;

  examenEstructura: IExamenEstructura = this.data;

  constructor(

  ) {
    //   this.datoFicha=data;
    console.log('data:', this.data)
  }

  ordenEstructura = new FormControl(this.data.resultado[this.data.indice!].ordenEstructura, [Validators.required]);
  descripcion = new FormControl(this.data.resultado[this.data.indice!].descripcion, [Validators.required]);
  unidadMedida = new FormControl(this.data.resultado[this.data.indice!].unidadMedida, [Validators.required]);
  //resultado = new FormControl('', [Validators.required]);
  //referencia = new FormControl('', [Validators.required]);
  logica = new FormControl(this.data.resultado[this.data.indice!].logica, [Validators.required]);
  desde = new FormControl(this.data.resultado[this.data.indice!].desde, [Validators.required]);
  hasta = new FormControl(this.data.resultado[this.data.indice!].hasta, [Validators.required]);

  modificaFormato1 = signal<FormGroup>(
    new FormGroup({
      ordenEstructura: this.ordenEstructura,
      descripcion: this.descripcion,
      unidadMedida: this.unidadMedida,
      //  resultado: this.resultado,
      //  referencia: this.referencia,
      logica: this.logica,
      desde: this.desde,
      hasta: this.hasta,
    }));

  getErrorMessage(campo: string) {

    if (campo === 'ordenEstructura') {
      return this.descripcion.hasError('required') ? 'Debes Ingresar OrdenEstructura' : '';
    }

    if (campo === 'descripcion') {
      return this.descripcion.hasError('required') ? 'Debes Ingresar Descripción' : '';
    }

    if (campo === 'unidadMedida') {
      return this.unidadMedida.hasError('required') ? 'Debes Ingresar Unidad Medida' : '';
    }

    /*   if (campo === 'resultado') {
         return this.resultado.hasError('required') ? 'Debes Ingresar Resultado' : '';
       }

       if (campo === 'referencia') {
         return this.referencia.hasError('required') ? 'Debes Ingresar Referencia' : '';
       }
   */
    if (campo === 'logica') {
      return this.logica.hasError('required') ? 'Debes Ingresar Logica' : '';
    }

    if (campo === 'desde') {
      return this.desde.hasError('required') ? 'Debes Ingresar Desde' : '';
    }

    if (campo === 'hasta') {
      return this.hasta.hasError('required') ? 'Debes Ingresar Hasta' : '';
    }

    return '';
  }

  ngOnInit() {
    this.cargaUnidadMedida()
    this.seleccionaLogica(this.data.resultado[this.data.indice!].logica)
  }

  seleccionaLogica(p: any) {
    console.log('prueba logica:', p)
    if (p != '-') {
      this.modificaFormato1().controls['hasta'].setValidators([]);
    }
    else {
      this.modificaFormato1().controls['hasta'].setValidators([Validators.required]);
    }
    this.modificaFormato1().controls['hasta'].updateValueAndValidity();
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

  retorna0NaN(valor: any) {
    if (isNaN(valor))
      return 0;
    else
      return valor;
  }

  async validaOrden(valor: number) {
    console.log('valor de orden', valor)
    console.log('this.data.resultado:', this.data.resultado);
    if (valor == this.data.resultado[this.data.indice!].ordenEstructura) return 0
    if (this.data.resultado == undefined) return 0

    const resultado = this.data.resultado.find((estructuraFormato1) => estructuraFormato1.ordenEstructura == valor);
    console.log('resultado:', resultado)
    if (resultado == undefined) return 0
    if (resultado.ordenEstructura != valor) return 0
    Swal.fire('ERROR ORDEN ', 'El número de orden ya existe', 'error');
    this.modificaFormato1().get('ordenEstructura')?.setValue(this.data.resultado[this.data.indice!].ordenEstructura)
    return 1
  }

  async enviar() {
    if (await this.validaOrden(this.modificaFormato1().get('ordenEstructura')!.value) === 1) return

    let referencia = ''
    if (this.modificaFormato1().get('logica')!.value == '-') {
      referencia = this.modificaFormato1().get('desde')!.value + ' - ' + this.modificaFormato1().get('hasta')!.value
    } else {
      referencia = this.modificaFormato1().get('logica')!.value + ' ' + this.modificaFormato1().get('desde')!.value
    }

    console.log('this.examenEstructura.resultado:', this.examenEstructura.resultado)

    this.examenEstructura.resultado[this.data.indice!] = {
      ordenEstructura: this.modificaFormato1().get('ordenEstructura')!.value,
      descripcion: this.modificaFormato1().get('descripcion')!.value,
      unidadMedida: this.modificaFormato1().get('unidadMedida')!.value,
      resultado: '',
      referencia: referencia,
      logica: this.modificaFormato1().get('logica')!.value,
      desde: this.modificaFormato1().get('desde')!.value,
      hasta: this.modificaFormato1().get('hasta')!.value,
      flagNegrilla: false
    };

    this.dialogRef.close(this.examenEstructura);

  }

}
