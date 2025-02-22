import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatSortModule } from '@angular/material/sort';

import Swal from 'sweetalert2';

import { AgregaDoctorSolicitanteComponent } from './agrega-doctor-solicitante/agrega-doctor-solicitante.component';
import { ModificaDoctorSolicitanteComponent } from './modifica-doctor-solicitante/modifica-doctor-solicitante.component';
import { ConsultaDoctorSolicitanteComponent } from './consulta-doctor-solicitante/consulta-doctor-solicitante.component';
import { EliminaDoctorSolicitanteComponent } from './elimina-doctor-solicitante/elimina-doctor-solicitante.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IDoctorSolicitante } from '@laboratorio/modelos/doctorSolicitante-modelo';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { StorageService } from '@shared/storage.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DoctorSolicitanteService } from '@laboratorio/servicios/doctor-solicitante.service';

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
    selector: 'app-doctor-solicitante',
    templateUrl: './doctor-solicitante.component.html',
    styleUrls: ['./doctor-solicitante.component.scss'],
    imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DoctorSolicitanteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private datoDoctorSolicitantePar!: IDoctorSolicitante;
  private doctorSolicitanteService = inject(DoctorSolicitanteService);
  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  displayedColumns: string[] = [
    'index',
    'nombre',
    'cliente:{nombreFantasia}',
    'opciones',
  ];
  dataSource = new MatTableDataSource<IDoctorSolicitante>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  public nombreArchivo = 'doctorSolicitante';

  constructor() {}

  async ngOnInit() {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';

    await this.getListDoctorSolicitante();
    // Permite ordenar cuando es estructura anidada
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'cliente:{nombreFantasia}':
          return item.cliente.nombreFantasia;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.spinnerService.esconder();
  }

  getListDoctorSolicitante() {
    this.doctorSolicitanteService
      .getDataDoctorSolicitante(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res['data'] as IDoctorSolicitante[];
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error.error.error, 'error');
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
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = {};
    //  dialogConfig.data = {
    //    idProducto: idProdP,
    //    titulo: tituloP
    //  };

    this.dialog
      .open(AgregaDoctorSolicitanteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaDoctorSolicitante(
    id: string,
    nombre: string,
    idCliente: string,
    nombreFantasia: string
  ): void {
    const datoDoctorSolicitanteAct = {
      _id: id,
      cliente: {
        idCliente: idCliente,
        nombreFantasia: nombreFantasia,
      },
      nombre,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoDoctorSolicitanteAct;
    this.dialog
      .open(ModificaDoctorSolicitanteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaDoctorSolicitante(
    id: string,
    nombre: string,
    idCliente: string,
    nombreFantasia: string
  ) {
    this.datoDoctorSolicitantePar = {
      _id: id,
      cliente: {
        idCliente: idCliente,
        nombreFantasia: nombreFantasia,
      },
      nombre,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = this.datoDoctorSolicitantePar;
    this.dialog
      .open(ConsultaDoctorSolicitanteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaDoctorSolicitante(
    id: string,
    nombre: string,
    idCliente: string,
    nombreFantasia: string
  ) {
    this.datoDoctorSolicitantePar = {
      _id: id,
      cliente: {
        idCliente: idCliente,
        nombreFantasia: nombreFantasia,
      },
      nombre,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = this.datoDoctorSolicitantePar;
    this.dialog
      .open(EliminaDoctorSolicitanteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  async refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    // this.dataSource.paginator._changePageSize(this.paginator.pageSize);
    // this.noticia=this.servicio.getNoticias();

    const respuesta = await this.getListDoctorSolicitante();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }
}
