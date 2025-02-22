import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';
import { IEmpresa } from '@modelos/empresa-modelo';
import { IIngresadoPorFicha } from '@laboratorio/interfaces/ingresadoPor-interface';
import { FichaService } from '@laboratorio/servicios/ficha.service';
import { UsuarioService } from '@servicios/usuario.service';
import { AgregaFichaComponent } from './agrega-ficha/agrega-ficha.component';
import { ModificaFichaComponent } from './modifica-ficha/modifica-ficha.component';
import { ConsultaFichaComponent } from './consulta-ficha/consulta-ficha.component';
import { DetalleFichaComponent } from './detalle-ficha/detalle-ficha.component';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FichaComponent implements OnInit {
  private readonly _storage = inject(StorageService);
  private readonly localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private readonly matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IFicha>();

  private readonly fichaService = inject(FichaService);
  private readonly usuarioService = inject(UsuarioService);

  tipoPermiso = '';
  datoEmpresa!: IEmpresa;
  IngresadoPorFichaEmp!: IIngresadoPorFicha;

  displayedColumns: string[] = [
    'index',
    'id_Ficha',
    'nombreFantasia',
    'nombrePaciente',
    'cantidadIngresadosRecepcionadosEstados',
    'cantidadSolicitadosEstados',
    'cantidadAnalizadosEstados',
    'cantidadEnviadosEstados',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;

  public nombreArchivo = 'IngresoFicha';
  constructor() {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
  }

  async ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';

    await this.getDataMenuPermiso();
  }

  getListFicha(): void {
    this.fichaService
      .getDataFichaXIdFicha(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
        'Ingresado,Solicitado,Recepcionado',
        this.tipoPermiso,
        this.localStorage?.usuarioLogin._id!
      )
      .subscribe({
        next: (res) => {
          console.log('fichaaaaaa: ', res);
          this.isLoading = true;
          this.dataSource.data = res['data'] as any[];
          this.isLoading = false;
        },
        // console.log('yo:', res as PerfilI[]),
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
    dialogConfig.width = '95%';
    dialogConfig.height = '95%';
    dialogConfig.position = { top: '2%' };

    dialogConfig.data = {
      usuario: this.localStorage?.usuarioLogin._id,
      empLaboratorio:
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      datoIngreso: this.localStorage?.usuarioLogin.empresaConectada,
    };

    this.dialog
      .open(AgregaFichaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaFicha(datoFicha: any) {
    const datoFichaPar = {
      datoFicha: datoFicha,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      usuario: this.localStorage?.usuarioLogin._id,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoFichaPar;
    this.dialog
      .open(ModificaFichaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaFicha(datoFicha: any) {
    const datoFichaPar = datoFicha;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoFichaPar;
    this.dialog
      .open(ConsultaFichaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  private refreshTable() {
    this.getListFicha();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }

  getDataMenuPermiso() {
    //Identifica que permiso tiene el usuario logueado
    this.usuarioService
      .getDataUsuarioIdPermiso(
        this.localStorage?.usuarioLogin._id!,
        'ingresoFicha'
      )
      .subscribe(
        (res) => {
          console.log('menu:', res);
          this.tipoPermiso = res.data;
          this.getListFicha();
        },
        (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        }
      );
  }

  detalleFicha(id_Ficha: string) {
    //  agregaNuevo(empresaInterface_: EmpresaI) {
    // Nuevo
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = {
      id_Ficha: id_Ficha,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      usuario: this.localStorage?.usuarioLogin._id,
    };
    this.dialog
      .open(DetalleFichaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  recepcionFicha(id_Ficha: string) {
    Swal.fire({
      title: 'Recepcionar',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.fichaService
          .getDataFichaRecepcionaIdFicha(
            id_Ficha,
            this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
            this.localStorage?.usuarioLogin._id!
          )
          .subscribe({
            next: (res) => {
              console.log('fichaaaaaa: ', res);
              Swal.fire({
                position: 'top-start',
                icon: 'success',
                title: 'Proceso realizado con Éxito',
                showConfirmButton: false,
                timer: 2000,
              });
              this.refreshTable();
            },
            // console.log('yo:', res as PerfilI[]),
            error: (error) => {
              this.isLoading = false;
              console.log('error carga:', error);
              Swal.fire('ERROR INESPERADO', error, 'error');
            },
          }); // (this.dataSource.data = res as PerfilI[])
      }
    });
  }
}
