import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';

import { UsuarioService } from '@servicios/usuario.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IUsuario } from '@modelos/usuario-modelo';
import { MatCardModule } from '@angular/material/card';
import { AgregaPerfilUsuarioComponent } from './agrega-perfil-usuario/agrega-perfil-usuario.component';
import { ModificaPerfilUsuarioComponent } from './modifica-perfil-usuario/modifica-perfil-usuario.component';
import { ConsultaPerfilUsuarioComponent } from './consulta-perfil-usuario/consulta-perfil-usuario.component';
import { SpinnerService } from '@shared/spinner/spinner.service';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
];

@Component({
  selector: 'app-perfiles-usuario',
  templateUrl: './perfiles-usuario.component.html',
  styleUrls: ['./perfiles-usuario.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PerfilesUsuarioComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion')!;
  private readonly spinnerService = inject(SpinnerService);

  private usuarioService = inject(UsuarioService);
  readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'usuario',
    'rutUsuario',
    'nombres',
    'apellidoPaterno',
    'usuarioLaboratorioCliente.laboratorioCliente_tipoEmpresa',
    'usuarioLaboratorioCliente.laboratorioCliente_nombreFantasia',
    'estadoUsuario',
    'opciones',
  ];
  dataSource = new MatTableDataSource<IUsuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public nombreArchivo = 'usuarios';

  constructor() { }

  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    this.getListUsuario();
  }

  getListUsuario(): void {
    this.usuarioService
      .getDataUsuario(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
        this.localStorage.usuarioLogin.empresaConectada.tipoEmpresa
      )
      .subscribe({
        next: (res) => {
          console.log('usuario: ', res);
          this.dataSource.data = res['data'] as any[];
          this.spinnerService.esconder();
        },
        error: (error) => {
          this.spinnerService.esconder();
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

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
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '2%' };
    dialogConfig.data = {
      usuario: this.localStorage.usuarioLogin._id,
      empresa_Id: this.localStorage.usuarioLogin.empresaConectada.empresa_Id,
      rutEmpresa: this.localStorage.usuarioLogin.empresaConectada.rutEmpresa,
    };
    //  dialogConfig.data = {
    //    idProducto: idProdP,
    //    titulo: tituloP
    //  };

    this.dialog
      .open(AgregaPerfilUsuarioComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaFicha(datoUsuario: IUsuario) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '2%' };

    dialogConfig.data = datoUsuario;
    this.dialog
      .open(ModificaPerfilUsuarioComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaFicha(datoUsuario: IUsuario) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '2%' };

    dialogConfig.data = datoUsuario;
    this.dialog
      .open(ConsultaPerfilUsuarioComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }
  /*
  reseteaContrasena(datoUsuario: IUsuario) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = datoUsuario;
    this.dialog
      .open(EliminaPerfilUsuarioComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }
*/
  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    // this.dataSource.paginator._changePageSize(this.paginator.pageSize);
    // this.noticia=this.servicio.getNoticias();

    this.getListUsuario();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }
}
