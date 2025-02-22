import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AgregaPropietarioComponent } from './agrega-propietario/agrega-propietario.component';
import { ModificaPropietarioComponent } from './modifica-propietario/modifica-propietario.component';
import { ConsultaPropietarioComponent } from './consulta-propietario/consulta-propietario.component';
import { EliminaPropietarioComponent } from './elimina-propietario/elimina-propietario.component';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { IPropietario } from '@laboratorio/modelos/propietario-modelo';
import { PropietarioService } from '@laboratorio/servicios/propietario.service';

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
  selector: 'app-propietario',
  templateUrl: './propietario.component.html',
  styleUrls: ['./propietario.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PropietarioComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IPropietario>();

  private propietarioService = inject(PropietarioService);

  displayedColumns: string[] = ['index', 'rutPropietario', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'direccion', 'telefono', 'email', 'opciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public nombreArchivo = 'propietarios';
  constructor() { }

  ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1');
    this.getList();
    this.spinnerService.esconder();
  }

  getList(): void {

    this.propietarioService
      .getDataPropietario()
      .subscribe({
        next: (res) => {
          // tslint:disable-next-line: no-string-literal
          this.dataSource.data = res['data'] as IPropietario[];
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire(
            'ERROR INESPERADO',
            error.error.error,
            'error'
          );
        }
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
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = '';//{usuario: this.currentUsuario.usuarioDato._id};
    //  dialogConfig.data = {
    //    idProducto: idProdP,
    //    titulo: tituloP
    //  };


    this.dialog.open(AgregaPropietarioComponent, dialogConfig)
      .afterClosed().subscribe(
        data => {
          console.log('Dialog output3333:', data);
          if (data === 1) {
            this.refreshTable();
          }
        }
      );
  }

  actualiza(datoPar: IPropietario) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    // dialogConfig.data =
    // {id, rutEmpresa, razonSocial, nombreFantasia, direccion, usuarioCrea_id: this.currentUsuario.usuarioDato.usuario};
    dialogConfig.data = datoPar;
    this.dialog.open(ModificaPropietarioComponent, dialogConfig)
      .afterClosed().subscribe(
        data => {
          console.log('Dialog output3333:', data);
          if (data === 1) {
            this.refreshTable();
          }
        }
      );
  }

  consulta(datoPar: IPropietario) {


    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoPar;
    this.dialog.open(ConsultaPropietarioComponent, dialogConfig)
      .afterClosed().subscribe(
        data => {
          console.log('Datoas Consulta:', data);
          if (data === 1) {
            this.refreshTable();
          }
        }
      );
  }

  elimina(datoPar: IPropietario) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoPar;
    this.dialog.open(EliminaPropietarioComponent, dialogConfig)
      .afterClosed().subscribe(
        data => {
          console.log('Datoas Consulta:', data);
          if (data === 1) {
            this.refreshTable();
          }
        }
      );
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
}
