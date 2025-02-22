import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { AgregaEspecieComponent } from './agrega-especie/agrega-especie.component';
import { ModificaEspecieComponent } from './modifica-especie/modifica-especie.component';
import { ConsultaEspecieComponent } from './consulta-especie/consulta-especie.component';
import { EliminaEspecieComponent } from './elimina-especie/elimina-especie.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { EspecieService } from '@laboratorio/servicios/especie.service';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';

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
    selector: 'app-especie',
    templateUrl: './especie.component.html',
    styleUrls: ['./especie.component.scss'],
    imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class EspecieComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  private especieService = inject(EspecieService);
  dataSource = new MatTableDataSource<IEspecie>();

  displayedColumns: string[] = ['index', 'nombre', 'opciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  datoEspeciePar!: IEspecie;
  public nombreArchivo = 'especies';
  constructor() {}

  async ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1');

    await this.getListEspecie();
    this.spinnerService.esconder();
  }

  getListEspecie(): void {
    this.especieService
      .getDataEspecieTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('especie: ', res['data']);
          this.dataSource.data = res['data'] as IEspecie[];
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
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };
    dialogConfig.data = { usuario: this.localStorage?.usuarioLogin._id };
    //  dialogConfig.data = {
    //    idProducto: idProdP,
    //    titulo: tituloP
    //  };

    this.dialog
      .open(AgregaEspecieComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaEspecie(id: string, nombre: string): void {
    this.datoEspeciePar = {
      _id: id,
      nombre,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };
    // dialogConfig.data =
    // {id, rutEmpresa, razonSocial, nombreFantasia, direccion, usuarioCrea_id: this.currentUsuario.usuarioDato.usuario};
    dialogConfig.data = this.datoEspeciePar;
    this.dialog
      .open(ModificaEspecieComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaEspecie(id: string, nombre: string) {
    this.datoEspeciePar = {
      _id: id,
      nombre,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = this.datoEspeciePar;
    this.dialog
      .open(ConsultaEspecieComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaEspecie(id: string, nombre: string) {
    this.datoEspeciePar = {
      _id: id,
      nombre,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = this.datoEspeciePar;
    this.dialog
      .open(EliminaEspecieComponent, dialogConfig)
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

    const respuesta = await this.getListEspecie();
    this.dataSource.paginator?.pageSize != this.paginator.pageSize;
  }
}
