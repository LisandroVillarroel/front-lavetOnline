import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
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
import { CategoriaExamenService } from '@laboratorio/servicios/categoriaExamen.service';
import { ICategoriaExamen } from '@laboratorio/modelos/categoriaExamen-modelo';
import { AgregaCategoriaExamenComponent } from './agrega-categoria-examen/agrega-categoria-examen.component';
import { ConsultaCategoriaExamenComponent } from './consulta-categoria-examen/consulta-categoria-examen.component';
import { EliminaCategoriaExamenComponent } from './elimina-categoria-examen/elimina-categoria-examen.component';
import { ModificaCategoriaExamenComponent } from './modifica-categoria-examen/modifica-categoria-examen.component';

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
  selector: 'app-categoria-examen',
  templateUrl: './categoria-examen.component.html',
  styleUrls: ['./categoria-examen.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoriaExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  private categoriaExamenService = inject(CategoriaExamenService);
  dataSource = new MatTableDataSource<ICategoriaExamen>();

  displayedColumns: string[] = ['index', 'nombre', 'sigla', 'opciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  datoCategoriaExamenPar!: ICategoriaExamen;
  public nombreArchivo = 'categoriaExamen';
  constructor() {}

  async ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1');

    await this.getListCategoriaExamen();
    this.spinnerService.esconder();
  }

  getListCategoriaExamen(): void {
    this.categoriaExamenService
      .getDataCategoriaExamenTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('CategoriaExamen: ', res.data);
          this.dataSource.data = res.data;
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
      .open(AgregaCategoriaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaCategoriaExamen(id: string, nombre: string, sigla: string): void {
    this.datoCategoriaExamenPar = {
      _id: id,
      nombre,
      sigla,
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
    dialogConfig.data = this.datoCategoriaExamenPar;
    this.dialog
      .open(ModificaCategoriaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaCategoriaExamen(id: string, nombre: string, sigla: string) {
    this.datoCategoriaExamenPar = {
      _id: id,
      nombre,
      sigla,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = this.datoCategoriaExamenPar;
    this.dialog
      .open(ConsultaCategoriaExamenComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaCategoriaExamen(id: string, nombre: string, sigla: string) {
    this.datoCategoriaExamenPar = {
      _id: id,
      nombre,
      sigla,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = this.datoCategoriaExamenPar;
    this.dialog
      .open(EliminaCategoriaExamenComponent, dialogConfig)
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

    const respuesta = await this.getListCategoriaExamen();
    this.dataSource.paginator?.pageSize != this.paginator.pageSize;
  }
}
