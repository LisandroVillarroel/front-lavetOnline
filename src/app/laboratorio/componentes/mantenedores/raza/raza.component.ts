import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

import Swal from 'sweetalert2';
import { AgregaRazaComponent } from './agrega-raza/agrega-raza.component';
import { ModificaRazaComponent } from './modifica-raza/modifica-raza.component';
import { ConsultaRazaComponent } from './consulta-raza/consulta-raza.component';
import { EliminaRazaComponent } from './elimina-raza/elimina-raza.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { StorageService } from '@shared/storage.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { RazaService } from '@laboratorio/servicios/raza.service';
import { IRaza } from '@laboratorio/modelos/raza-modelo';

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
  selector: 'app-raza',
  templateUrl: './raza.component.html',
  styleUrls: ['./raza.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RazaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IRaza>();

  private razaService = inject(RazaService);
  datoRazaPar!: IRaza;

  displayedColumns: string[] = ['index', 'especieNombre', 'nombre', 'opciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public nombreArchivo = 'razas';
  constructor() { }

  async ngOnInit() {
    this.spinnerService.mostrar();
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    await this.getListRaza();
    this.spinnerService.esconder();
  }

  getListRaza(): void {
    this.razaService
      .getDataRazaTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('raza: ', res['data']);
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
      .open(AgregaRazaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaRaza(dataRaza: IRaza): void {
    dataRaza.usuarioModifica_id = this.localStorage?.usuarioLogin._id!;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };
    // dialogConfig.data =
    // {id, rutEmpresa, razonSocial, nombreFantasia, direccion, usuarioCrea_id: this.currentUsuario.usuarioDato.usuario};
    dialogConfig.data = dataRaza;
    this.dialog
      .open(ModificaRazaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  consultaRaza(razaPar: IRaza) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = razaPar;
    this.dialog
      .open(ConsultaRazaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaRaza(razaPar: IRaza) {
    razaPar.usuarioModifica_id = this.localStorage?.usuarioLogin._id!;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };

    dialogConfig.data = razaPar;
    this.dialog
      .open(EliminaRazaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Datoas Consulta:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  private async refreshTable() {
    await this.getListRaza();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }
}
