import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamenEstructura } from '@laboratorio/interfaces/examenEstructura-interface';
import {
  IResultadoEspecieFormato1,
  IResultadoFormato1,
} from '@laboratorio/modelos/examenes/examenFormato1';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatTableModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatCardModule,
  MatTooltipModule,
];

@Component({
  selector: 'app-modificaEstructuraFormato1',
  templateUrl: './funcionEstructuraFormato1.component.html',
  styleUrls: ['./funcionEstructuraFormato1.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuncionEstructuraFormato1Component implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<FuncionEstructuraFormato1Component>);
  readonly data = inject<IExamenEstructura>(MAT_DIALOG_DATA);

  /*
  indice // Indice del parametro seleccionado
  resultado // Son todos los parámetros de una especie
   */

  @ViewChild('htmlData') htmlData!: ElementRef;

  dataSource = new MatTableDataSource<IResultadoFormato1>(this.data.resultado);

  public formula = signal<string>(
    this.data.resultado[this.data.indice!].formula
  );
  public formulaInterna = signal<string>(
    this.data.resultado[this.data.indice!].formulaInterna
  );

  private examenEstructura: IExamenEstructura = this.data;

  displayedColumns: string[] = [
    'index',
    'ordenEstructura',
    'descripcion',
    'unidadMedida',
    'resultado',
    'referencia',
    'logica',
    'desde',
    'hasta',
    'opciones',
  ];

  constructor() {
    //   this.datoFicha=data;
    console.log('data:', this.data);
  }

  ngOnInit() {
    if (this.formula() == undefined) this.formula.set('');
    if (this.formulaInterna() == undefined) this.formulaInterna.set('');
  }

  async enviar() {
    this.examenEstructura.resultado[this.data.indice!].formula = this.formula();
    this.examenEstructura.resultado[this.data.indice!].formulaInterna =
      this.formulaInterna();
    console.log('envia formula:', this.examenEstructura);
    this.dialogRef.close(this.examenEstructura);
  }

  creaFormula(simbolo: string, id: string) {
    console.log('simbolo:', simbolo);
    if (simbolo === 'borrar') {
      //this.formula.set(this.formula().slice(0, this.formula().length - 1));
      //this.formulaInterno.set(this.formulaInterno().slice(0, this.formulaInterno().length - 1));
      this.formula.set('');
      this.formulaInterna.set('');
      return;
    }
    this.formula.set(this.formula() + simbolo);
    //El identifica si viene el valor _id para la formula interna
    if (id == '') this.formulaInterna.set(this.formulaInterna() + simbolo);
    else this.formulaInterna.set(this.formulaInterna() + '&' + id + '@');
  }

  seleccionaParametro(parametro: any) {
    console.log('valor:', parametro);

    this.creaFormula(parametro.descripcion, parametro._id);
    ///const valor = '(7+3)*2';
    ///const evaluatedResult = Function(`"use strict";return ${valor}`)();  permite realizar el calculo
    //7console.log(evaluatedResult);
  }
}
