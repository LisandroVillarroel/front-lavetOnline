import { CommonModule } from '@angular/common';
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
import { loginInterface } from '@autentica/interface/loginInterface';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import {
  IFormato1,
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
  datoExamenFormato1!: IFormato1;

  IFormato1!: IFormato1;
  IResultadoFormato1!: IResultadoFormato1[];
  datoResultadoFormato1 = signal<IResultadoFormato1[]>([]);
  datoClienteEmpresa!: ICliente;
  emailRecepcionExamenCliente = '';

  srAlbuminaFlag = false;
  srBilirrubinaTotalFlag = false;
  srBilirrubinaIndirectaFlag = false;
  srBilirrubinaDirectaFlag = false;
  srCalcioFlag = false;
  srColesterolFlag = false;
  srCreatininaFlag = false;
  srFosfatasaAlcalinaFlag = false;
  srFosforoFlag = false;
  srGGTFlag = false;
  srGlobulinasFlag = false;
  srGPTFlag = false;
  srGOTFlag = false;
  srGlucosaFlag = false;
  srUreaFlag = false;
  srNitrogenoUreicoSFlag = false;
  srProteinasTotalesFlag = false;

  constructor() {}

  srAlbumina = new FormControl('', [Validators.required]);
  srBilirrubinaTotal = new FormControl('', [Validators.required]);
  srBilirrubinaIndirecta = new FormControl('', [Validators.required]);
  srBilirrubinaDirecta = new FormControl('', [Validators.required]);
  srCalcio = new FormControl('', [Validators.required]);
  srColesterol = new FormControl('', [Validators.required]);
  srCreatinina = new FormControl('', [Validators.required]);
  srFosfatasaAlcalina = new FormControl('', [Validators.required]);
  srFosforo = new FormControl('', [Validators.required]);
  srGGT = new FormControl('', [Validators.required]);
  srGlobulinas = new FormControl('', [Validators.required]);
  srGPT = new FormControl('', [Validators.required]);
  srGOT = new FormControl('', [Validators.required]);
  srGlucosa = new FormControl('', [Validators.required]);
  srUrea = new FormControl('', [Validators.required]);
  srNitrogenoUreicoS = new FormControl('', [Validators.required]);
  srProteinasTotales = new FormControl('', [Validators.required]);
  observaciones = new FormControl('', [Validators.required]);

  ingresaFormato1: FormGroup = new FormGroup({
    srAlbumina: this.srAlbumina,
    srBilirrubinaTotal: this.srBilirrubinaTotal,
    srBilirrubinaIndirecta: this.srBilirrubinaIndirecta,
    srBilirrubinaDirecta: this.srBilirrubinaDirecta,
    srCalcio: this.srCalcio,
    srColesterol: this.srColesterol,
    srCreatinina: this.srCreatinina,
    srFosfatasaAlcalina: this.srFosfatasaAlcalina,
    srFosforo: this.srFosforo,
    srGGT: this.srGGT,
    srGlobulinas: this.srGlobulinas,
    srGPT: this.srGPT,
    srGOT: this.srGOT,
    srGlucosa: this.srGlucosa,
    srUrea: this.srUrea,
    srNitrogenoUreicoS: this.srNitrogenoUreicoS,
    srProteinasTotales: this.srProteinasTotales,
    observaciones: this.observaciones,
  });

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
    this.ingresaFormato1.get('srBilirrubinaIndirecta')!.disable();
    this.ingresaFormato1.get('srGlobulinas')!.disable();
    this.ingresaFormato1.get('srNitrogenoUreicoS')!.disable();
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
          console.log('examen especie:', res);
          this.datoResultadoFormato1.set(res.data.resultadoEspecie.resultado);
        },

        error: (error) => {
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  srAlbuminaFormula() {
    this.srGlobulinasFormula();

    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      if (
        this.ingresaFormato1.get('srAlbumina')!.value < 2.6 ||
        this.ingresaFormato1.get('srAlbumina')!.value > 3.3
      ) {
        this.srAlbuminaFlag = true;
      } else {
        this.srAlbuminaFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srAlbumina')!.value < 2.1 ||
        this.ingresaFormato1.get('srAlbumina')!.value > 3.3
      ) {
        this.srAlbuminaFlag = true;
      } else {
        this.srAlbuminaFlag = false;
      }
    }

    //  this.sumaTotal();
  }

  srBilirrubinaTotalFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srBilirrubinaTotal:',
        this.ingresaFormato1.get('srBilirrubinaTotal')!.value
      );
      if (
        this.ingresaFormato1.get('srBilirrubinaTotal')!.value < 0.1 ||
        this.ingresaFormato1.get('srBilirrubinaTotal')!.value > 0.7
      ) {
        this.srBilirrubinaTotalFlag = true;
      } else {
        this.srBilirrubinaTotalFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srBilirrubinaTotal')!.value < 0.1 ||
        this.ingresaFormato1.get('srBilirrubinaTotal')!.value > 0.7
      ) {
        this.srBilirrubinaTotalFlag = true;
      } else {
        this.srBilirrubinaTotalFlag = false;
      }
    }
    this.srBilirrubinaIndirectaFormula();
  }

  srBilirrubinaIndirectaFormula() {
    let total = (
      this.retorna0NaN(
        parseFloat(this.ingresaFormato1.get('srBilirrubinaTotal')!.value)
      ) -
      this.retorna0NaN(
        parseFloat(this.ingresaFormato1.get('srBilirrubinaDirecta')!.value)
      )
    ).toFixed(2); //Redonmdea a 2 decimales

    this.ingresaFormato1.get('srBilirrubinaIndirecta')!.setValue(total);

    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srBilirrubinaIndirecta:',
        this.ingresaFormato1.get('srBilirrubinaIndirecta')!.value
      );
      if (
        this.ingresaFormato1.get('srBilirrubinaIndirecta')!.value < 0.1 ||
        this.ingresaFormato1.get('srBilirrubinaIndirecta')!.value > 0.49
      ) {
        this.srBilirrubinaIndirectaFlag = true;
      } else {
        this.srBilirrubinaIndirectaFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srBilirrubinaIndirecta')!.value < 0.1 ||
        this.ingresaFormato1.get('srBilirrubinaIndirecta')!.value > 0.49
      ) {
        this.srBilirrubinaIndirectaFlag = true;
      } else {
        this.srBilirrubinaIndirectaFlag = false;
      }
    }
    //   this.sumaTotal();
  }

  srBilirrubinaDirectaFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srBilirrubinaDirecta:',
        this.ingresaFormato1.get('srBilirrubinaDirecta')!.value
      );
      if (
        this.ingresaFormato1.get('srBilirrubinaDirecta')!.value < 0 ||
        this.ingresaFormato1.get('srBilirrubinaDirecta')!.value > 0.3
      ) {
        this.srBilirrubinaDirectaFlag = true;
      } else {
        this.srBilirrubinaDirectaFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srBilirrubinaDirecta')!.value < 0 ||
        this.ingresaFormato1.get('srBilirrubinaDirecta')!.value > 0.3
      ) {
        this.srBilirrubinaDirectaFlag = true;
      } else {
        this.srBilirrubinaDirectaFlag = false;
      }
    }
    this.srBilirrubinaIndirectaFormula();
  }

  srCalcioFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srCalcio:',
        this.ingresaFormato1.get('srCalcio')!.value
      );
      if (
        this.ingresaFormato1.get('srCalcio')!.value < 9 ||
        this.ingresaFormato1.get('srCalcio')!.value > 12
      ) {
        this.srCalcioFlag = true;
      } else {
        this.srCalcioFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srCalcio')!.value < 9 ||
        this.ingresaFormato1.get('srCalcio')!.value > 12
      ) {
        this.srCalcioFlag = true;
      } else {
        this.srCalcioFlag = false;
      }
    }
    // this.sumaTotal();
  }

  srColesterolFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srColesterol:',
        this.ingresaFormato1.get('srColesterol')!.value
      );
      if (
        this.ingresaFormato1.get('srColesterol')!.value < 105 ||
        this.ingresaFormato1.get('srColesterol')!.value > 300
      ) {
        this.srColesterolFlag = true;
      } else {
        this.srColesterolFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srColesterol')!.value < 70 ||
        this.ingresaFormato1.get('srColesterol')!.value > 200
      ) {
        this.srColesterolFlag = true;
      } else {
        this.srColesterolFlag = false;
      }
    }
    // this.sumaTotal();
  }

  srCreatininaFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srCreatinina:',
        this.ingresaFormato1.get('srCreatinina')!.value
      );
      if (
        this.ingresaFormato1.get('srCreatinina')!.value < 0.5 ||
        this.ingresaFormato1.get('srCreatinina')!.value > 1.5
      ) {
        this.srCreatininaFlag = true;
      } else {
        this.srCreatininaFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srCreatinina')!.value < 0.8 ||
        this.ingresaFormato1.get('srCreatinina')!.value > 1.8
      ) {
        this.srCreatininaFlag = true;
      } else {
        this.srCreatininaFlag = false;
      }
    }
    //  this.sumaTotal();
  }

  srFosfatasaAlcalinaFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srFosfatasaAlcalina:',
        this.ingresaFormato1.get('srFosfatasaAlcalina')!.value
      );
      if (this.ingresaFormato1.get('srFosfatasaAlcalina')!.value >= 160) {
        this.srFosfatasaAlcalinaFlag = true;
      } else {
        this.srFosfatasaAlcalinaFlag = false;
      }
    } else {
      if (this.ingresaFormato1.get('srFosfatasaAlcalina')!.value >= 85) {
        this.srFosfatasaAlcalinaFlag = true;
      } else {
        this.srFosfatasaAlcalinaFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srFosforoFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srFosforo:',
        this.ingresaFormato1.get('srFosforo')!.value
      );
      if (
        this.ingresaFormato1.get('srFosforo')!.value < 2.6 ||
        this.ingresaFormato1.get('srFosforo')!.value > 6.2
      ) {
        this.srFosforoFlag = true;
      } else {
        this.srFosforoFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srFosforo')!.value < 4.5 ||
        this.ingresaFormato1.get('srFosforo')!.value > 8.1
      ) {
        this.srFosforoFlag = true;
      } else {
        this.srFosforoFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srGGTFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log('valor srGGT:', this.ingresaFormato1.get('srGGT')!.value);
      if (this.ingresaFormato1.get('srGGT')!.value >= 10) {
        this.srGGTFlag = true;
      } else {
        this.srGGTFlag = false;
      }
    } else {
      if (this.ingresaFormato1.get('srGGT')!.value >= 6.5) {
        this.srGGTFlag = true;
      } else {
        this.srGGTFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srGlobulinasFormula() {
    let total = (
      this.retorna0NaN(
        parseFloat(this.ingresaFormato1.get('srProteinasTotales')!.value)
      ) -
      this.retorna0NaN(
        parseFloat(this.ingresaFormato1.get('srAlbumina')!.value)
      )
    ).toFixed(1); //Redonmdea a 1 decimales

    this.ingresaFormato1.get('srGlobulinas')!.setValue(total);

    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srGlobulinas:',
        this.ingresaFormato1.get('srGlobulinas')!.value
      );
      if (
        this.ingresaFormato1.get('srGlobulinas')!.value < 2.6 ||
        this.ingresaFormato1.get('srGlobulinas')!.value > 4.4
      ) {
        this.srGlobulinasFlag = true;
      } else {
        this.srGlobulinasFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srGlobulinas')!.value < 2.6 ||
        this.ingresaFormato1.get('srGlobulinas')!.value > 5.1
      ) {
        this.srGlobulinasFlag = true;
      } else {
        this.srGlobulinasFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srGPTFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log('valor srGPT:', this.ingresaFormato1.get('srGPT')!.value);
      if (this.ingresaFormato1.get('srGPT')!.value >= 68) {
        this.srGPTFlag = true;
      } else {
        this.srGPTFlag = false;
      }
    } else {
      if (this.ingresaFormato1.get('srGPT')!.value >= 68) {
        this.srGPTFlag = true;
      } else {
        this.srGPTFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srGOTFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log('valor srGOT:', this.ingresaFormato1.get('srGOT')!.value);
      if (this.ingresaFormato1.get('srGOT')!.value >= 55) {
        this.srGOTFlag = true;
      } else {
        this.srGOTFlag = false;
      }
    } else {
      if (this.ingresaFormato1.get('srGOT')!.value >= 55) {
        this.srGOTFlag = true;
      } else {
        this.srGOTFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srGlucosaFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srGlucosa:',
        this.ingresaFormato1.get('srGlucosa')!.value
      );
      if (
        this.ingresaFormato1.get('srGlucosa')!.value < 65 ||
        this.ingresaFormato1.get('srGlucosa')!.value > 118
      ) {
        this.srGlucosaFlag = true;
      } else {
        this.srGlucosaFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srGlucosa')!.value < 70 ||
        this.ingresaFormato1.get('srGlucosa')!.value > 110
      ) {
        this.srGlucosaFlag = true;
      } else {
        this.srGlucosaFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srUreaFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srFosbUreasforo:',
        this.ingresaFormato1.get('srUrea')!.value
      );
      if (
        this.ingresaFormato1.get('srUrea')!.value < 21.5 ||
        this.ingresaFormato1.get('srUrea')!.value > 64.5
      ) {
        this.srUreaFlag = true;
      } else {
        this.srUreaFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srUrea')!.value < 38.7 ||
        this.ingresaFormato1.get('srUrea')!.value > 71
      ) {
        this.srUreaFlag = true;
      } else {
        this.srUreaFlag = false;
      }
    }
    this.srNitrogenoUreicoSFormula();
  }

  srNitrogenoUreicoSFormula() {
    let total = (
      this.retorna0NaN(parseFloat(this.ingresaFormato1.get('srUrea')!.value)) *
      this.retorna0NaN(parseFloat('0.28'))
    ).toFixed(1); //Redonmdea a 1 decimales
    this.ingresaFormato1.get('srNitrogenoUreicoS')!.setValue(total);

    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srNitrogenoUreicoS:',
        this.ingresaFormato1.get('srNitrogenoUreicoS')!.value
      );
      if (
        this.ingresaFormato1.get('srNitrogenoUreicoS')!.value < 10 ||
        this.ingresaFormato1.get('srNitrogenoUreicoS')!.value > 30
      ) {
        this.srNitrogenoUreicoSFlag = true;
      } else {
        this.srNitrogenoUreicoSFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srNitrogenoUreicoS')!.value < 18 ||
        this.ingresaFormato1.get('srNitrogenoUreicoS')!.value > 33
      ) {
        this.srNitrogenoUreicoSFlag = true;
      } else {
        this.srNitrogenoUreicoSFlag = false;
      }
    }
    //this.sumaTotal();
  }

  srProteinasTotalesFormula() {
    if (this.data.fichaC.especie!.nombre.toUpperCase() == 'CANINO') {
      console.log(
        'valor srProteinasTotales:',
        this.ingresaFormato1.get('srProteinasTotales')!.value
      );
      if (
        this.ingresaFormato1.get('srProteinasTotales')!.value < 5.5 ||
        this.ingresaFormato1.get('srProteinasTotales')!.value > 7.5
      ) {
        this.srProteinasTotalesFlag = true;
      } else {
        this.srProteinasTotalesFlag = false;
      }
    } else {
      if (
        this.ingresaFormato1.get('srProteinasTotales')!.value < 5.4 ||
        this.ingresaFormato1.get('srProteinasTotales')!.value > 7.8
      ) {
        this.srProteinasTotalesFlag = true;
      } else {
        this.srProteinasTotalesFlag = false;
      }
    }
    this.srGlobulinasFormula();
  }

  async getCliente() {
    console.log('pasa emp 2:', this.data.fichaC.cliente!.idCliente);
    this.clienteService
      .getDataClienteActual(this.data.fichaC.cliente!.idCliente!)
      .subscribe({
        next: (res) => {
          console.log('cliente2: ', res['data'][0] as ICliente);
          this.datoClienteEmpresa = res['data'][0] as ICliente;
          this.data.fichaC.cliente!.correoRecepcionCliente =
            this.datoClienteEmpresa.emailRecepcionExamenCliente;
          console.log(
            'this.datoClienteEmpresa.empresa:',
            this.data.fichaC.cliente!.correoRecepcionCliente
          );
        },
        // console.log('yo:', res as PerfilI[]),
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
    /*
    this.IResultadoFormato1 = [
      {
        parametro: 'Albúmina',
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
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
        resultado: this.ingresaFormato1
          .get('srProteinasTotales')!
          .value.toString()
          .replace('.', ','),
        unidad: 'gr/dl',
        caninos: '5,5 - 7,5',
        felinos: '5,4 - 7,8',
        flagNegrilla: this.srProteinasTotalesFlag,
      },
    ];

    this.IFormato1 = {
      resultado: this.IResultadoFormato1,
      subTitulo: '',
      observaciones: this.ingresaFormato1.get('observaciones')!.value,
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
        usuarioAnalizado_id: this.currentUsuario.usuarioDato._id,
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
    */
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
