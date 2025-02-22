import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { AgregaClienteComponent } from './agrega-cliente/agrega-cliente.component';
import { ModificaClienteComponent } from './modifica-cliente/modifica-cliente.component';
import { ConsultaClienteComponent } from './consulta-cliente/consulta-cliente.component';
import { EliminaClienteComponent } from './elimina-cliente/elimina-cliente.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { loginInterface } from '@autentica/interface/loginInterface';
import { StorageService } from '@shared/storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { IClienteInterface } from '@laboratorio/interfaces/cliente-interface';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';

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
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
    imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClienteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private clienteService = inject(ClienteService);
  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  displayedColumns: string[] = [
    'index',
    'rutCliente',
    'razonSocial',
    'nombreFantasia',
    'direccion',
    'telefono',
    'email',
    'nombreContacto',
    'opciones',
  ];
  dataSource = new MatTableDataSource<ICliente>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  show: boolean = true;
  private datoClienteEmpresaOriginal!: ICliente[];
  private datoCliente!: IClienteInterface;

  public nombreArchivo = 'clientes';
  constructor() {}

  async ngOnInit() {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };

    // this.matPaginatorIntl.itemsPerPageLabel = 'your custom text 1';
    //   this.matPaginatorIntl.firstPageLabel = 'your custom text 2';
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    //   this.matPaginatorIntl.lastPageLabel = 'your custom text 4';
    //   this.matPaginatorIntl.nextPageLabel = 'your custom text 5';
    //   this.matPaginatorIntl.previousPageLabel = 'your custom text 6';

    console.log('pasa emp 1');
    /*  if (this.authenticationService.getCurrentUser() != null) {
      this.localStorage!.usuarioLogin =
        this.authenticationService.getCurrentUser();
    }*/
    await this.getListCliente();
    //await this.getListClienteTodo();

    // Permite ordenar cuando es estructura anidada
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'empresa.rutCliente':
          return item.empresa[0].rutCliente;
        case 'empresa.razonSocial':
          return item.empresa[0].razonSocial;
        case 'empresa.nombreFantasia':
          return item.empresa[0].nombreFantasia;
        case 'empresa.direccion':
          return item.empresa[0].direccion;
        case 'empresa.telefono':
          return item.empresa[0].telefono;
        case 'empresa.email':
          return item.empresa[0].email;
        case 'empresa.nombreContacto':
          return item.empresa[0].nombreContacto;
        default:
          return item[property];
      }
    };
    this.spinnerService.esconder();
  }

  /*
async getListClienteTodo() {
    console.log('pasa emp 2:',this.currentUsuario.usuarioDato.empresaConectada.empresa_Id);
    this.clienteService
      .getDataCliente(this.currentUsuario.usuarioDato.empresaConectada.empresa_Id)
      .subscribe((res) => {
        console.log('cliente2: ', res['data'] as ICliente[]);
        this.datoClienteEmpresa=res['data'] as ICliente[];
        for(let a=0; a<this.datoClienteEmpresa.length; a++){
         // for(let b=0; b<this.datoClienteEmpresa[a].empresa!.length; b++){

           //  if (this.datoClienteEmpresa![a].empresa![a].empresa_Id != this.currentUsuario.usuarioDato.empresa.empresa_Id){
             this.datoClienteEmpresa![a].empresa = this.datoClienteEmpresa![a].empresa!.filter(x=> x.empresa_Id === this.currentUsuario.usuarioDato.empresaConectada.empresa_Id)
           //  }
          // }
        }

    //   this.datoClienteEmpresa.empresa = this.datoClienteEmpresa.empresa!.filter(x=> x.empresa_Id === this.currentUsuario.usuarioDato.empresa.empresa_Id)
        console.log('this.datoClienteEmpresa.empresa:', this.datoClienteEmpresa);
        console.log('cliente original ultimo: ', this.datoClienteEmpresaOriginal);
        this.dataSource.data = this.datoClienteEmpresa;
      },
      // console.log('yo:', res as PerfilI[]),
      error => {
        console.log('error carga:', error);
        Swal.fire(
          'ERROR INESPERADO',
          error,
         'error'
       );
      }
    ); // (this.dataSource.data = res as PerfilI[])
  }
*/
  async getListCliente() {
    this.clienteService
      .getDataCliente(
        this.localStorage!.usuarioLogin.empresaConectada.empresa_Id
      )
      .subscribe({
        next: (res) => {
          console.log('cliente1: ', res['data'] as ICliente[]);
          this.datoClienteEmpresaOriginal = res['data'] as ICliente[];
          console.log('cliente original: ', this.datoClienteEmpresaOriginal);
          this.dataSource.data = this.datoClienteEmpresaOriginal;
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
    //  agregaNuevo(empresaInterface_: EmpresaI) {
    // Nuevo
    console.log('usu:', this.localStorage?.usuarioLogin._id);
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
      .open(AgregaClienteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaCliente(datoClientePar: ICliente): void {
    console.log('datos actualiza:', datoClientePar);
    this.datoCliente = {
      datoClientePar: datoClientePar,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    // dialogConfig.data =
    // {id, rutEmpresa, razonSocial, nombreFantasia, direccion, usuarioCrea_id: this.currentUsuario.usuarioDato.usuario};
    dialogConfig.data = this.datoCliente;
    this.dialog
      .open(ModificaClienteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaCliente(datoClientePar: ICliente) {
    console.log('consulta cliente:', datoClientePar);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoClientePar;
    this.dialog
      .open(ConsultaClienteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaCliente(datoClientePar: ICliente) {
    this.datoCliente = {
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
      datoClientePar: datoClientePar,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = this.datoCliente;
    this.dialog
      .open(EliminaClienteComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  async refreshTable() {
    await this.getListCliente();
    this.dataSource.paginator?.pageSize != this.paginator.pageSize;
  }
}
