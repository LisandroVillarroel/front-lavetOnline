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
  MatPaginator,
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
import {
  IResultadoEspecieFormato1,
  IResultadoFormato1,
} from '@laboratorio/modelos/examenes/examenFormato1';
import { IExamenEstructura } from '@laboratorio/interfaces/examenEstructura-interface';
import { EspecieService } from '@laboratorio/servicios/especie.service';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AgregaExamenFormatro2Component } from './agrega-examen-formato2/agrega-examen-formato2.component';

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

  dataSource = new MatTableDataSource<IResultadoFormato1>();

  especieForm = new FormControl('');

  private examenService = inject(ExamenService);

  visible = signal<boolean>(true);
  show = signal<boolean>(true);
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['index', 'ordenEstructura', 'opciones'];

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
    console.log('datos llegados', this.dataIdExamen);
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1');

    await this.getList();
    this.spinnerService.esconder();
  }

  getList() {
    this.dataSource.data = [];
    /*
    this.examenService.getDataExamen(this.dataIdExamen).subscribe({
      next: (res) => {
        if (res.codigo == 200) {
          this.datoExamen = res.data[0];
          console.log('examen origen:', this.datoExamen);

          if (
            this.datoExamen.formato?.formato1?.resultadoEspecie == undefined ||
            this.datoExamen.formato?.formato1?.resultadoEspecie.length == 0
          ) {
            this.datoExamenResultadoEspecie.push({
              especie_Id: especieId,
              resultado: [],
            }); //Agrega registro vacio para esda especie
            console.log('paso1');
          } else {
            this.datoExamenResultadoEspecie =
              this.datoExamen.formato?.formato1?.resultadoEspecie; //Rescata todos los parametros por especie
            console.log('paso2');
            console.log(
              'this.datoExamenResultadoEspecie 1:',
              this.datoExamenResultadoEspecie
            );
            this.resultadoEspecieIndex =
              this.datoExamenResultadoEspecie.findIndex(
                (valor: any) => valor.especie_Id === especieId
              );
          }
          //Pregunta si la especie existe
          if (this.resultadoEspecieIndex == -1) {
            this.noExisteParametro.set('NO EXISTEN PARÁMETROS PARA ESPECIE');
            return;
          }
          this.noExisteParametro.set('');
          console.log(
            'this.resultadoEspecieIndex:',
            this.resultadoEspecieIndex
          );
          console.log(
            'this.datoExamenResultadoEspecie:',
            this.datoExamenResultadoEspecie
          );

          this.datoExamenResultado =
            this.datoExamenResultadoEspecie[
              this.resultadoEspecieIndex
            ].resultado;
          console.log('this.datoExamenResultado:', this.datoExamenResultado);
          console.log(
            'this.datoExamenResultado largo:',
            this.datoExamenResultado.length
          );
          this.datoExamenResultado.sort(
            (a, b) => a.ordenEstructura - b.ordenEstructura
          );
          console.log('pasa Examen 2', this.datoExamenResultado);

          if (this.datoExamenResultado.length > 0) {
            this.maxOrden =
              this.datoExamenResultado[this.datoExamenResultado.length - 1]
                .ordenEstructura + 1;
          }
          console.log('maxOrden', this.maxOrden);
          this.dataSource.data = this.datoExamenResultado;
        } else {
          console.log('error carga:', res.mensaje);
          Swal.fire('ERROR INESPERADO', res.mensaje, 'error');
        }
      },
      // console.log('yo:', res as PerfilI[]),
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
    */
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
      .open(AgregaExamenFormatro2Component, dialogConfig)
      .afterClosed()
      .subscribe((data: IExamenEstructura) => {
        console.log('examen111:', this.datoExamen);
      });
  }
  actualizaExamenEstructura(row: any) {}
  eliminaExamenEstructura(row: any) {}

  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    // this.dataSource.paginator._changePageSize(this.paginator.pageSize);
    // this.noticia=this.servicio.getNoticias();

    this.getList();
  }
}
