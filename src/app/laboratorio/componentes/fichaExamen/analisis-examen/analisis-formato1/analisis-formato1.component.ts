import { CommonModule, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EditorModule } from 'primeng/editor';
import { loginInterface } from '@autentica/interface/loginInterface';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import {
  IFormato1,
  IResultadoFinalFormato1,
  IResultadoFormato1,
} from '@laboratorio/modelos/examenes/examenFormato1';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { FichaService } from '@laboratorio/servicios/ficha.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';
import { FichaCabeceraComponent } from '../ficha-cabecera/ficha-cabecera.component';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatExpansionModule,
];

@Component({
  selector: 'app-analisis-formato1',
  templateUrl: './analisis-formato1.component.html',
  styleUrls: ['./analisis-formato1.component.scss'],
  imports: [
    MATERIAL_MODELO,
    ReactiveFormsModule,
    CommonModule,
    FichaCabeceraComponent,
    JsonPipe,
    EditorModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalisisFormato1Component implements OnInit {
  private readonly _storage = inject(StorageService);
  private readonly localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AnalisisFormato1Component>);
  public data = inject<IFicha>(MAT_DIALOG_DATA);

  @ViewChild('htmlData') htmlData!: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  private clienteService = inject(ClienteService);
  private fichaService = inject(FichaService);
  private examenService = inject(ExamenService);

  usuario!: string;
  datoFicha!: IFicha;

  IFormato1!: IResultadoFinalFormato1;
  datoResultadoFormato1 = signal<IResultadoFormato1[]>([]);
  datoClienteEmpresa!: ICliente;
  emailRecepcionExamenCliente = '';

  constructor() {}

  observaciones = new FormControl('', [Validators.required]);

  ingresaFormato1 = signal<FormGroup>(
    new FormGroup({
      observaciones: this.observaciones,
    })
  );

  getErrorMessage(campo: string) {
    /*
        if (campo === 'srAlbumina'){
          return this.srAlbumina.hasError('required') ? 'Debes Ingresar Albúmina' : '';
        }

        if (campo === 'srBilirrubinaTotal'){
          return this.srBilirrubinaTotal.hasError('required') ? 'Debes Ingresar Bilirrubina Total' : '';
        }

        if (campo === 'srBilirrubinaIndirecta'){
          return this.srBilirrubinaIndirecta.hasError('required') ? 'Debes Ingresar Bilirrubina Indirecta' : '';
        }

        if (campo === 'srBilirrubinaDirecta'){
          return this.srBilirrubinaDirecta.hasError('required') ? 'Debes Ingresar Bilirrubina Directa' : '';
        }

        if (campo === 'srCalcio'){
          return this.srCalcio.hasError('required') ? 'Debes Ingresar Calcio' : '';
        }

        if (campo === 'srColesterol'){
          return this.srColesterol.hasError('required') ? 'Debes Ingresar Colesterol' : '';
        }

        if (campo === 'srCreatinina'){
          return this.srCreatinina.hasError('required') ? 'Debes Ingresar Creatinina' : '';
        }

        if (campo === 'srFosfatasaAlcalina'){
          return this.srFosfatasaAlcalina.hasError('required') ? 'Debes Ingresar Fosfatasa Alcalina' : '';
        }

        if (campo === 'srFosforo'){
          return this.srFosforo.hasError('required') ? 'Debes Ingresar Fósforo' : '';
        }

        if (campo === 'srGGT'){
          return this.srGGT.hasError('required') ? 'Debes Ingresar GGT' : '';
        }

        if (campo === 'srGlobulinas'){
          return this.srGlobulinas.hasError('required') ? 'Debes Ingresar Globulinas' : '';
        }

        if (campo === 'srGPT'){
          return this.srGPT.hasError('required') ? 'Debes Ingresar GPT (ALT)' : '';
        }

        if (campo === 'srGOT'){
          return this.srGOT.hasError('required') ? 'Debes Ingresar GOT (AST)' : '';
        }

        if (campo === 'srGlucosa'){
          return this.srGlucosa.hasError('required') ? 'Debes Ingresar Glucosa' : '';
        }

        if (campo === 'srUrea'){
          return this.srUrea.hasError('required') ? 'Debes Ingresar Urea' : '';
        }

        if (campo === 'srNitrogenoUreicoS'){
          return this.srNitrogenoUreicoS.hasError('required') ? 'Debes Ingresar Nitrógeno Ureico S.' : '';
        }

        if (campo === 'srProteinasTotales'){
          return this.srProteinasTotales.hasError('required') ? 'Debes Ingresar Proteínas Totales' : '';
        }

        if (campo === 'srObservaciones'){
          return this.srObservaciones.hasError('required') ? 'Debes Ingresar observaciones' : '';
        }
*/
    return '';
  }

  ngOnInit() {
    this.getEstructuraExamen();

    //  this.getExamen();
    if (
      this.data.fichaC.validador!.nombreFirma == 'sinFirma.jpg' ||
      this.data.fichaC.validador!.nombreFirma == '' ||
      this.data.fichaC.validador!.nombreFirma == undefined
    ) {
      Swal.fire('El Examen no cuenta con Firma Validador', '', 'error');
      this.dialogRef.close(1);
    }
    this.getCliente();
  }

  getEstructuraExamen() {
    this.examenService
      .getDataExamenEstructura(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
        this.data.fichaC.examen?.codigoInterno!,
        this.data.fichaC.especie?.idEspecie!
      )
      .subscribe({
        next: (res) => {
          this.datoResultadoFormato1.set(res.data.resultadoEspecie.resultado);
          this.creaCampos();
        },

        error: (error) => {
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  creaCampos() {
    for (const campo of this.datoResultadoFormato1()) {
      this.ingresaFormato1().addControl(
        'input_' + campo._id,
        new FormControl('', [Validators.required])
      );
      if (campo.formulaInterna != '' && campo.formulaInterna != undefined) {
        this.ingresaFormato1()
          .get('input_' + campo._id)!
          .disable();
      }
    }
  }

  extraeCampoFormula(
    idCampo: string,
    estraeCampoFormula: string,
    desde: string,
    hasta: string,
    logica: string
  ) {
    let valorFormulaFinal = estraeCampoFormula;
    let valor = 0;
    for (let i = 0; i <= estraeCampoFormula.length; i++) {
      if (estraeCampoFormula[i] == '&') {
        for (let a = i; a <= estraeCampoFormula.length; a++) {
          if (estraeCampoFormula[a] == '@') {
            //Extrae el Id (nombre Campo)
            //rescata valor del input
            valor = this.retorna0NaN(
              parseFloat(
                this.ingresaFormato1().get(
                  'input_' + estraeCampoFormula.slice(i + 1, a)
                )!.value
              )
            );
            // reemplaza el valor por el nombre del campo
            valorFormulaFinal = valorFormulaFinal.replace(
              estraeCampoFormula.slice(i, a + 1),
              valor.toString()
            );

            i = a;
            break;
          }
        }
      }
    }
    const valorCalculado = parseFloat(
      Function(`"use strict";return ${valorFormulaFinal}`)().toFixed(2)
    ); //permite realizar el calculo
    this.ingresaFormato1()
      .get('input_' + idCampo)!
      .setValue(valorCalculado);
    this.logica(valorCalculado, idCampo, desde, hasta, logica);
  }

  valorplaceholder(valorFormulaInterna: string) {
    let valorPlaceholder = 'Ingreso Valor';
    if (valorFormulaInterna != '' && valorFormulaInterna != undefined)
      valorPlaceholder = 'Valor Formula';
    return valorPlaceholder;
  }
  logica(valor: any, id: string, desde: string, hasta: string, logica: string) {
    console.log('valor:', valor);
    console.log('id:', id);
    console.log('desde:', desde);
    console.log('hasta:', hasta);
    console.log('logica:', logica);

    valor = this.retorna0NaN(parseFloat(valor));
    desde = this.retorna0NaN(parseFloat(desde));
    hasta = this.retorna0NaN(parseFloat(hasta));

    console.log('valor2:', valor);
    console.log('desde2:', desde);
    console.log('hasta2:', hasta);

    let variableflag = true;
    switch (logica) {
      case '-':
        console.log('paso -');
        if (valor >= desde && valor <= hasta) variableflag = false;
        break;
      case '<':
        console.log('paso <');
        if (valor < desde) variableflag = false;
        break;
      case '>':
        console.log('paso >');
        if (valor > desde) variableflag = false;
        break;
    }
    console.log('variableflag:', variableflag);
    // Permite cambiar un valor de la matriz flagNegrilla y resultado buscando por el _Id
    this.datoResultadoFormato1.update((preResultado) =>
      preResultado.map((resultado) =>
        resultado._id === id
          ? { ...resultado, flagNegrilla: variableflag, resultado: valor }
          : resultado
      )
    );
  }

  async campoLogica(
    evento: any,
    id: string,
    desde: string,
    hasta: string,
    logica: string
  ) {
    let valor = evento.target.value;
    const camposConFormula = await this.datoResultadoFormato1().filter(
      (valor) =>
        valor.formulaInterna != '' &&
        valor.formulaInterna != undefined &&
        valor.formulaInterna.indexOf(id) > 0
    );

    for (const camposConFormula_ of camposConFormula) {
      this.extraeCampoFormula(
        camposConFormula_._id!,
        camposConFormula_.formulaInterna,
        camposConFormula_.desde!,
        camposConFormula_.hasta!,
        camposConFormula_.logica
      ); //Envia formula para calculo
    }
    this.logica(valor, id, desde, hasta, logica);
  }

  async getCliente() {
    this.clienteService
      .getDataClienteActual(this.data.fichaC.cliente!.idCliente!)
      .subscribe({
        next: (res) => {
          this.datoClienteEmpresa = res['data'][0] as ICliente;
          this.data.fichaC.cliente!.correoRecepcionCliente =
            this.datoClienteEmpresa.emailRecepcionExamenCliente;
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  retorna0NaN(valor: any) {
    if (isNaN(valor)) return 0;
    else return valor;
  }

  async enviar() {
    console.log('this.datoResultadoFormato1', this.datoResultadoFormato1());
    /*
    this.IResultadoFormato1 = [
      {
        parametro: 'Albúmina',
        resultado: this.ingresaFormato1()
          .get('srAlbumina')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '2,6 - 3,3',
        felinos: '2,1 - 3,3',
        flagNegrilla: this.srAlbuminaFlag,
      },
      {
        parametro: 'Bilirrubina Total',
        resultado: this.ingresaFormato1()
          .get('srBilirrubinaTotal')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '0,1 - 0,7',
        felinos: '0,1 - 0,7',
        flagNegrilla: this.srBilirrubinaTotalFlag,
      },
      {
        parametro: 'Bilirrubina Indirecta',
        resultado: this.ingresaFormato1()
          .get('srBilirrubinaIndirecta')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '0,1 - 0,49',
        felinos: '0,1 - 0,49',
        flagNegrilla: this.srBilirrubinaIndirectaFlag,
      },
      {
        parametro: 'Bilirrubina Directa',
        resultado: this.ingresaFormato1()
          .get('srBilirrubinaDirecta')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '0 - 0,3',
        felinos: '0 - 0,3',
        flagNegrilla: this.srBilirrubinaDirectaFlag,
      },
      {
        parametro: 'Calcio',
        resultado: this.ingresaFormato1()
          .get('srCalcio')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '9 - 12',
        felinos: '9 - 12',
        flagNegrilla: this.srCalcioFlag,
      },
      {
        parametro: 'Colesterol',
        resultado: this.ingresaFormato1()
          .get('srColesterol')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '105 - 300',
        felinos: '70 - 200',
        flagNegrilla: this.srColesterolFlag,
      },
      {
        parametro: 'Creatinina',
        resultado: this.ingresaFormato1()
          .get('srCreatinina')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '0,5 - 1,5',
        felinos: '0,8 - 1,8',
        flagNegrilla: this.srCreatininaFlag,
      },
      {
        parametro: 'Fosfatasa Alcalina',
        resultado: this.ingresaFormato1()
          .get('srFosfatasaAlcalina')!
          .value.toString()
          .replace('.', ','),
        unidad: 'U/l',
        caninos: '< 160',
        felinos: '< 85',
        flagNegrilla: this.srFosfatasaAlcalinaFlag,
      },
      {
        parametro: 'Fósforo',
        resultado: this.ingresaFormato1()
          .get('srFosforo')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '2,6 - 6,2',
        felinos: '4,5 - 8,1',
        flagNegrilla: this.srFosforoFlag,
      },
      {
        parametro: 'GGT',
        resultado: this.ingresaFormato1()
          .get('srGGT')!
          .value.toString()
          .replace('.', ','),
        unidad: 'U/l',
        caninos: '< 10',
        felinos: '< 6,5',
        flagNegrilla: this.srGGTFlag,
      },
      {
        parametro: 'Globulinas',
        resultado: this.ingresaFormato1()
          .get('srGlobulinas')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '2,6 - 4,4',
        felinos: '2,6 - 5,1',
        flagNegrilla: this.srGlobulinasFlag,
      },
      {
        parametro: 'GPT (ALT)',
        resultado: this.ingresaFormato1()
          .get('srGPT')!
          .value.toString()
          .replace('.', ','),
        unidad: 'U/l',
        caninos: '< 68',
        felinos: '< 68',
        flagNegrilla: this.srGPTFlag,
      },
      {
        parametro: 'GOT (AST)',
        resultado: this.ingresaFormato1()
          .get('srGOT')!
          .value.toString()
          .replace('.', ','),
        unidad: 'U/l',
        caninos: '< 55',
        felinos: '< 55',
        flagNegrilla: this.srGOTFlag,
      },
      {
        parametro: 'Glucosa',
        resultado: this.ingresaFormato1()
          .get('srGlucosa')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '65 - 118',
        felinos: '70 - 110',
        flagNegrilla: this.srGlucosaFlag,
      },
      {
        parametro: 'Urea',
        resultado: this.ingresaFormato1()
          .get('srUrea')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '21,5 - 64,5',
        felinos: '38,7 - 71',
        flagNegrilla: this.srUreaFlag,
      },
      {
        parametro: 'Nitrógeno Ureico S.',
        resultado: this.ingresaFormato1()
          .get('srNitrogenoUreicoS')!
          .value.toString()
          .replace('.', ','),
        unidad: 'mg/dl',
        caninos: '10 - 30',
        felinos: '18 - 33',
        flagNegrilla: this.srNitrogenoUreicoSFlag,
      },
      {
        parametro: 'Proteínas Totales',
        resultado: this.ingresaFormato1()
          .get('srProteinasTotales')!
          .value.toString()
          .replace('.', ','),
        unidad: 'gr/dl',
        caninos: '5,5 - 7,5',
        felinos: '5,4 - 7,8',
        flagNegrilla: this.srProteinasTotalesFlag,
      },
    ];
*/
    this.IFormato1 = {
      resultado: this.datoResultadoFormato1(),
      subTitulo: '',
      observaciones: this.ingresaFormato1().get('observaciones')!.value,
    };

    this.datoFicha = {
      _id: this.data._id,
      fichaC: this.data.fichaC,
      empresa: this.data.empresa,
      formatoResultado: {
        //    examen: this.data.fichaC.examen,
        formato1: this.IFormato1,
      },

      datoArchivo: {
        nombreArchivo: '',
        archivo64: '',
      },
      seguimientoEstado: {
        usuarioIngresado_crea_id:
          this.data.seguimientoEstado.usuarioIngresado_crea_id,
        usuarioIngresado_modifica_id:
          this.data.seguimientoEstado.usuarioIngresado_modifica_id,
        fechaHora_ingresado_crea:
          this.data.seguimientoEstado.fechaHora_ingresado_crea,
        fechaHora_ingresado_modifica:
          this.data.seguimientoEstado.fechaHora_ingresado_modifica,
        usuarioRecepcionado_crea_id:
          this.data.seguimientoEstado.usuarioRecepcionado_crea_id,
        fechaHora_recepcionado_crea:
          this.data.seguimientoEstado.fechaHora_recepcionado_crea,
        usuarioRecepcionado_modifica_id:
          this.data.seguimientoEstado.usuarioRecepcionado_modifica_id,
        fechaHora_recepcionado_modifica:
          this.data.seguimientoEstado.fechaHora_recepcionado_modifica,
        usuarioAnalizado_id: this.localStorage?.usuarioLogin._id!,
        fechaHora_analizado: this.data.seguimientoEstado.fechaHora_analizado,
        usuarioEnviado_id: this.data.seguimientoEstado.usuarioEnviado_id,
        fechaHora_enviado: this.data.seguimientoEstado.fechaHora_enviado,
      },
      estadoFicha: 'Analizado',
    };

    console.log('agrega 1:', this.datoFicha);

    this.fichaService.putDataFichaAnaliza(this.datoFicha).subscribe({
      next: (dato) => {
        console.log('respuesta:', dato);
        if (dato.codigo === 200) {
          Swal.fire('Se Ingresó con éxito', '', 'success');
          this.dialogRef.close(1);
        } else {
          console.log('error:', dato);
          Swal.fire(dato.mensaje, 'ERROR DE SISTEMA', 'error');
          this.dialogRef.close(1);
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire('', 'ERROR DE SISTEMA', 'error');
      },
    });
  }

  KeyDown(e: any) {
    const typedValue = e.keyCode;
    if (typedValue == 190) {
      e.preventDefault();
      // If the value is not a number, we skip the min/max comparison
      return;
    }
  }
  /*
  ngAfterViewChecked() {
    let editor = CKEDITOR.config;
    editor.enterMode = CKEDITOR.ENTER_BR;
    // editor.fillEmptyBlocks
    //editor.forceEnterMode
    //editor.ignoreEmptyParagraph
    editor.height = '100';
    editor.language = 'es';
    editor.toolbarGroups = [
      { name: 'document', groups: ['mode', 'document', 'doctools'] },
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      {
        name: 'editing',
        groups: ['find', 'selection', 'spellchecker', 'editing'],
      },
      { name: 'forms', groups: ['forms'] },
      '/',
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'],
      },
      { name: 'links', groups: ['links'] },
      { name: 'insert', groups: ['insert'] },
      '/',
      { name: 'styles', groups: ['styles'] },
      { name: 'colors', groups: ['colors'] },
      { name: 'tools', groups: ['tools'] },
      { name: 'others', groups: ['others'] },
      { name: 'about', groups: ['about'] },
    ];

    editor.removeButtons =
      'Source,Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteFromWord,PasteText,Redo,Undo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Superscript,Subscript,RemoveFormat,CopyFormatting,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,BidiRtl,BidiLtr,Language,Anchor,Unlink,Link,Image,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,Font,FontSize,BGColor,TextColor,Maximize,ShowBlocks,About';
  }
  */
}
