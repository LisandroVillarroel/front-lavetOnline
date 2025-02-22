import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';
import { AgregaValidadoresComponent } from './agrega-validadores/agrega-validadores.component';
import { ConsultaValidadoresComponent } from './consulta-validadores/consulta-validadores.component';
import { EliminaValidadoresComponent } from './elimina-validadores/elimina-validadores.component';
import { ModificaValidadoresComponent } from './modifica-validadores/modifica-validadores.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { IValidador } from '@laboratorio/modelos/validador-modelo';
import { ValidadorService } from '@laboratorio/servicios/validador.service';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@Component({
    selector: 'app-validadores',
    templateUrl: './validadores.component.html',
    styleUrls: ['./validadores.component.scss'],
    imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ValidadoresComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IValidador>();

  private validadorService = inject(ValidadorService);

  show: boolean = true;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'rutValidador',
    'nombres',
    'apellidoPaterno',
    'apellidoMaterno',
    'profesion',
    'telefono',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public nombreArchivo = 'validadores';
  constructor() {}

  async ngOnInit() {
    this.spinnerService.mostrar();
    // Permite fintrar en nodos o sub campos
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };

    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    await this.getListValidador();
    this.spinnerService.esconder();
  }

  getListValidador() {
    this.validadorService
      .getDataValidadorTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('validador:', res['data']);
          this.dataSource.data = res['data'] as IValidador[];
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregaNuevo() {
    // Nuevo
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = { usuario: this.localStorage?.usuarioLogin._id };
    //  dialogConfig.data = {
    //    idProducto: idProdP,
    //    titulo: tituloP
    //  };

    this.dialog
      .open(AgregaValidadoresComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaValidador(datoValidador: IValidador): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoValidador;
    this.dialog
      .open(ModificaValidadoresComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaValidador(datoValidador: IValidador) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoValidador;
    this.dialog
      .open(ConsultaValidadoresComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaValidador(datoValidador: IValidador) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoValidador;
    this.dialog
      .open(EliminaValidadoresComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  async refreshTable() {
    const respuesta = await this.getListValidador();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }
}
