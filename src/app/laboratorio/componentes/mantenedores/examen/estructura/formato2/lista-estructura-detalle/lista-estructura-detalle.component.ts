import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  IEstructuraDetalleFormato2,
  IResultadoFormato2,
} from '@laboratorio/modelos/examenes/examenFormato2';
import { AgregaEstructuraDetalleComponent } from './agrega-estructura-detalle/agrega-estructura-detalle.component';
import { ModificaEstructuraDetalleComponent } from './modifica-estructura-detalle/modifica-estructura-detalle.component';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule,
  MatSelectModule,
];

@Component({
  selector: 'app-lista-estructura-detalle',
  templateUrl: './lista-estructura-detalle.component.html',
  styleUrl: './lista-estructura-detalle.component.scss',
  imports: [
    MATERIAL_MODELO,
    CommonModule,
    MatTableExporterModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaEstructuraDetalleComponent {
  public estructuraDetalleInicio_ = input.required<IResultadoFormato2>();
  public resultadoFormato2Output = output<IResultadoFormato2>();

  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IEstructuraDetalleFormato2>();

  especieForm = new FormControl('');

  private resultadoFormato2!: IResultadoFormato2;
  private estructura_: IEstructuraDetalleFormato2[] = [];

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'nombreDescripcion',
    'tipoCampoResultado',
    'cantidadDecimales',
    'unidadMedida',
    'opciones',
  ];

  @ViewChild(MatSort)
  private _sort!: MatSort;
  public get sort(): MatSort {
    return this._sort;
  }
  public set sort(value: MatSort) {
    this._sort = value;
  }

  public nombreArchivo = 'examenes';
  constructor() {
    effect(() => {
      this.getList(this.estructuraDetalleInicio_());
    });
  }

  async ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('estructuraDetalleInicio_:', this.estructuraDetalleInicio_());

    // await this.getList();
    this.spinnerService.esconder();
  }

  getList(estructuraDetalleInicio: IResultadoFormato2) {
    this.resultadoFormato2 = estructuraDetalleInicio;
    this.dataSource.data = estructuraDetalleInicio.estructuraDetalle;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregaExamenEstructura() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = '';

    this.dialog
      .open(AgregaEstructuraDetalleComponent, dialogConfig)
      .afterClosed()
      .subscribe((estructuraDetalleFormato2: IEstructuraDetalleFormato2) => {
        if (estructuraDetalleFormato2.nombreDescripcion == null) return;

        if (
          this.estructuraDetalleInicio_().estructuraDetalle.length != undefined
        )
          this.estructura_ = this.estructuraDetalleInicio_().estructuraDetalle;

        this.estructura_.push(estructuraDetalleFormato2);
        //console.log('examen formato 2 resultado v2:', estructura_);
        //console.log('dataResultadoFormato2:', dataResultadoFormato2);

        this.resultadoFormato2.estructuraDetalle = this.estructura_!;

        this.enviar(this.resultadoFormato2);
      });
  }

  modificaExamenEstructura(row: IEstructuraDetalleFormato2) {
    console.log('row modifica:', row);
    let indice = 0;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = row;

    this.dialog
      .open(ModificaEstructuraDetalleComponent, dialogConfig)
      .afterClosed()
      .subscribe(
        (dataEstructuraDetalleFormato2: IEstructuraDetalleFormato2) => {
          if (dataEstructuraDetalleFormato2.nombreDescripcion == null) return;
          indice = this.estructuraDetalleInicio_().estructuraDetalle.findIndex(
            (valor: any) => valor._id === row._id
          );
          this.resultadoFormato2.estructuraDetalle[indice] =
            dataEstructuraDetalleFormato2;

          this.enviar(this.resultadoFormato2);
        }
      );
  }

  eliminaExamenEstructura(row: IEstructuraDetalleFormato2) {
    console.log('elimina row:', row);
    let estructura_: IResultadoFormato2[] = [];
    Swal.fire({
      title: 'Elimina  - ' + row.nombreDescripcion + ' !',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Elimina Erróneo ',
    }).then((result) => {
      if (result.isConfirmed) {
        this.estructura_ =
          this.estructuraDetalleInicio_().estructuraDetalle.filter(function (
            valor
          ) {
            return valor._id !== row._id;
          })!;
        console.log('estructura_:', estructura_);

        this.resultadoFormato2.estructuraDetalle = this.estructura_!;

        this.enviar(this.resultadoFormato2);
      }
    });
  }

  private refreshTable() {
    this.getList(this.estructuraDetalleInicio_());
  }

  async enviar(resultadoFormato2_: IResultadoFormato2) {
    await this.resultadoFormato2Output.emit(resultadoFormato2_);
    this.refreshTable();
  }
}
