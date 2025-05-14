import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
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
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AgregaExamenFormatro2Component } from './agrega-examen-formato2/agrega-examen-formato2.component';
import {
  IEstructuraDetalleFormato2,
  IResultadoFormato2,
} from '@laboratorio/modelos/examenes/examenFormato2';
import { ModificaExamenFormatro2Component } from './modifica-examen-formato2/modifica-examen-formato2.component';
import { ListaEstructuraDetalleComponent } from './lista-estructura-detalle/lista-estructura-detalle.component';

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
  selector: 'app-lista-formato2',
  templateUrl: './lista-formato2.component.html',
  styleUrl: './lista-formato2.component.scss',
  imports: [
    MATERIAL_MODELO,
    CommonModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    ListaEstructuraDetalleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaFormato2Component {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dataIdExamen = inject<string>(MAT_DIALOG_DATA);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  private datoExamen!: IExamen;

  dataSource = new MatTableDataSource<IResultadoFormato2>();

  especieForm = new FormControl('');

  private examenService = inject(ExamenService);

  visible = signal<boolean>(false);
  show = signal<boolean>(true);
  estructuraDetalleInicio!: IResultadoFormato2;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'nombreExamen',
    'tipoEstructura',
    'nombreTituloDescripcion',
    'nombreTituloResultado',
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
  constructor() {}

  async ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';

    await this.getList();
    this.spinnerService.esconder();
  }

  getList() {
    this.dataSource.data = [];

    this.examenService.getDataExamen(this.dataIdExamen).subscribe({
      next: (res) => {
        if (res.codigo == 200) {
          this.datoExamen = res.data[0];

          this.dataSource.data = this.datoExamen.formato?.formato2?.estructura!;
        } else {
          Swal.fire('ERROR INESPERADO', res.mensaje, 'error');
        }
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }

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
    let estructura_: IResultadoFormato2[] = [];
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = '';

    this.dialog
      .open(AgregaExamenFormatro2Component, dialogConfig)
      .afterClosed()
      .subscribe((dataResultadoFormato2: IResultadoFormato2) => {
        if (dataResultadoFormato2.nombreExamen == null) return;

        if (this.datoExamen.formato?.formato2?.estructura != undefined)
          estructura_ = this.datoExamen.formato!.formato2!.estructura;
        estructura_!.push(dataResultadoFormato2);

        this.datoExamen.formato!.formato2!.estructura = estructura_!;

        this.enviar(this.datoExamen, 'Se agregó con Éxito');
      });
  }
  modificaExamenEstructura(row: IResultadoFormato2) {
    let indice = 0;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = row;

    this.dialog
      .open(ModificaExamenFormatro2Component, dialogConfig)
      .afterClosed()
      .subscribe((dataResultadoFormato2: IResultadoFormato2) => {
        if (dataResultadoFormato2.nombreExamen == null) return;
        indice = this.datoExamen.formato!.formato2!.estructura.findIndex(
          (valor: any) => valor._id === row._id
        );
        this.datoExamen.formato!.formato2!.estructura[indice] =
          dataResultadoFormato2;

        this.enviar(this.datoExamen, 'Se Modificó con Éxito');
      });
  }
  eliminaExamenEstructura(row: IResultadoFormato2) {
    let estructura_: IResultadoFormato2[] = [];
    Swal.fire({
      title: 'Elimina  - ' + row.nombreExamen + ' !',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Elimina Erróneo ',
    }).then((result) => {
      if (result.isConfirmed) {
        estructura_ = this.datoExamen.formato?.formato2?.estructura!.filter(
          function (valor) {
            return valor._id !== row._id;
          }
        )!;

        this.datoExamen.formato!.formato2!.estructura = estructura_;

        this.enviar(this.datoExamen, 'Se eliminó con Éxito');
      }
    });
  }

  clickDetalle(row: IResultadoFormato2) {
    console.log('row Detalle:', row);
    this.visible.set(true);
    this.estructuraDetalleInicio = row;
  }

  grabaListaEstructuraDetalle(
    resultadoFormato2_: IResultadoFormato2,
    mensajeConfirma: string
  ) {
    let indice = 0;
    if (resultadoFormato2_.nombreExamen == null) return;
    indice = this.datoExamen.formato!.formato2!.estructura.findIndex(
      (valor: any) => valor._id === resultadoFormato2_._id
    );
    this.datoExamen.formato!.formato2!.estructura[indice] = resultadoFormato2_;
    this.enviar(this.datoExamen, mensajeConfirma);
  }
  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    // this.dataSource.paginator._changePageSize(this.paginator.pageSize);
    // this.noticia=this.servicio.getNoticias();

    this.getList();
  }

  enviar(datoExamen_: IExamen, mensajeConfirma: string) {
    this.spinnerService.mostrar();
    this.examenService.putDataExamen(datoExamen_).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire(mensajeConfirma, '', 'success'); // ,
          this.refreshTable();
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      },
      error: (error) => {
        this.spinnerService.esconder();
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }
}
