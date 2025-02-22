import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';

import { AgregaExamenComponent } from './agrega-examen/agrega-examen.component';
import { ModificaExamenComponent } from './modifica-examen/modifica-examen.component';
import { ConsultaExamenComponent } from './consulta-examen/consulta-examen.component';
import { EliminaExamenComponent } from './elimina-examen/elimina-examen.component';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Formato1Component } from './formato/formato1/formato1.component';
import { Formato2Component } from './formato/formato2/formato2.component';
import { Formato3Component } from './formato/formato3/formato3.component';
import { Formato4Component } from './formato/formato4/formato4.component';
import { Formato5Component } from './formato/formato5/formato5.component';
import { Formato6Component } from './formato/formato6/formato6.component';
import { Formato7Component } from './formato/formato7/formato7.component';
import { Formato8Component } from './formato/formato8/formato8.component';
import { Formato9Component } from './formato/formato9/formato9.component';
import { Formato10Component } from './formato/formato10/formato10.component';
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
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { ListaParametroComponent } from './estructura/lista-parametro/lista-parametro.component';


const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IExamen>();

  private servicioService = inject(ExamenService);

  visible = signal<boolean>(true);
  show = signal<boolean>(true);
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'codigoExamen',
    'codigoInterno',
    'numeroFormatoInterno',
    'internoExterno',
    'categoria',
    'tituloExamen',
    'nombre',
    'sigla',
    'precio',
    'tiempoPreparacion',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public nombreArchivo = 'examenes';
  constructor() { }

  ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1');

    if (
      this.localStorage?.usuarioLogin.empresaConectada.tipoEmpresa?.toUpperCase() ==
      'Laboratorio'.toUpperCase()
    ) {
      this.visible.set(false);
    }
    if (
      this.localStorage?.usuarioLogin.empresaConectada.tipoEmpresa?.toUpperCase() ==
      'ADMINISTRADOR'.toUpperCase()
    ) {
      this.show.set(false);
    }
    this.getList();
    this.spinnerService.esconder();
  }

  getList(): void {
    this.servicioService
      .getDataExamenTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('examen:', res);
          if (res.codigo == 200) {
            console.log('pasa Examen 2', res);
            this.dataSource.data = res.data;
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

  consultaFormato(row: any) {
    console.log('row:', row);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '85%';
    dialogConfig.height = '95%';
    dialogConfig.position = { top: '2%' };

    dialogConfig.data = row;

    /*
          this.dialog.open(Formato1Component, dialogConfig)
          .afterClosed().subscribe(
           data => {console.log('Datoas Consulta:', data);
            }
          );
    */
    switch (row.numeroFormatoInterno) {
      case 1:
        this.dialog
          .open(Formato1Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 2:
        this.dialog
          .open(Formato2Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 3:
        this.dialog
          .open(Formato3Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 4:
        this.dialog
          .open(Formato4Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog CortisolComponent:', data);
          });
        break;
      case 5:
        this.dialog
          .open(Formato5Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 6:
        this.dialog
          .open(Formato6Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 7:
        this.dialog
          .open(Formato7Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 8:
        this.dialog
          .open(Formato8Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 9:
        this.dialog
          .open(Formato9Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      case 10:
        this.dialog
          .open(Formato10Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
          });
        break;
      default:
        //
        break;
    }
  }

  agregaNuevo() {
    //  agregaNuevo(empresaInterface_: EmpresaI) {
    // Nuevo
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = '';

    this.dialog
      .open(AgregaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualiza(datoPar: IExamen) {
    /*   this.datoPar = {
         _id: row._id,
         codigoExamen: row.codigoExamen,
         nombre: row.nombre,
         sigla: row.sigla,
         precio: row.precio,
         codigoInterno: row.codigoInterno,
         numeroFormatoInterno: row.numeroFormatoInterno,
         internoExterno: row.internoExterno,
         tipoExamen: row.tipoExamen,
         categoria: row.categoria,
         tiempoPreparacion: row.tiempoPreparacion,
         tituloExamen: row.tituloExamen,

         empresa_Id: this.currentUsuario.usuarioDato.empresaConectada.empresa_Id,
         usuarioModifica_id: this.currentUsuario.usuarioDato._id
       };
       */

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    // dialogConfig.data =
    // {id, rutEmpresa, razonSocial, nombreFantasia, direccion, usuarioCrea_id: this.currentUsuario.usuarioDato.usuario};
    dialogConfig.data = datoPar;
    this.dialog
      .open(ModificaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consulta(datoPar: IExamen) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoPar;
    this.dialog
      .open(ConsultaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  listaEstructura(Examen_Id: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = Examen_Id;//datoPar.formato?.formato1?.resultadoEspecie;
    this.dialog
      .open(ListaParametroComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  elimina(datoPar: IExamen) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoPar;
    this.dialog
      .open(EliminaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    // this.dataSource.paginator._changePageSize(this.paginator.pageSize);
    // this.noticia=this.servicio.getNoticias();

    this.getList();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }

  colorIconFormato(internoExterno: string) {
    let colorFondo;
    if (internoExterno == 'Externo') colorFondo = 'colorIconExterno';

    return colorFondo;
  }
}
