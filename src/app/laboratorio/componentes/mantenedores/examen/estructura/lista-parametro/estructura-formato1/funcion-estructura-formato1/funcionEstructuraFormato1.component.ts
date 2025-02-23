import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Inject,
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
import { MatAccordion } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamenEstructura } from '@laboratorio/interfaces/examenEstructura-interface';
import { IResultadoFormato1 } from '@laboratorio/modelos/examenes/examenFormato1';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';
import { UnidadMedidaService } from '@laboratorio/servicios/unidad-medida.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatTableModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
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
  readonly data = inject<any>(MAT_DIALOG_DATA);

  @ViewChild('htmlData') htmlData!: ElementRef;

  dataSource = new MatTableDataSource<IResultadoFormato1>(
    this.data.datoExamenResultado
  );

  /*datoExamen!: IExamen[];*/

  examenEstructura: IExamenEstructura = this.data;
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

  ngOnInit() {}

  async enviar() {}

  seleccionaParametro(parametro: any) {
    console.log('click');
  }
}
