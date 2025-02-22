import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { ModificaOfertaComponent } from './modifica-oferta/modifica-oferta.component';
import { AgregaOfertaComponent } from './agrega-oferta/agrega-oferta.component';
import { DetalleOfertaComponent } from './detalle-oferta/detalle-oferta.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { IOferta } from '@laboratorio/modelos/oferta-model';
import { OfertaService } from '@laboratorio/servicios/oferta.service';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
];

@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrls: ['./oferta.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfertaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IOferta>();

  displayedColumns: string[] = [
    'index',
    'detalleOferta',
    'nombre',
    'fechaDesde',
    'fechaHasta',
    'montoTotal',
    'estadoOferta',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private ofertaService = inject(OfertaService);

  show: boolean = true;
  datoOferta!: IOferta[];
  public nombreArchivo = 'ofertas';

  constructor() {
    // Permite fintrar en nodos o sub campos
  }

  async ngOnInit() {
    this.spinnerService.mostrar();
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };

    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1');
    await this.getListOferta();
    this.spinnerService.esconder();
  }

  async getListOferta() {
    this.ofertaService
      .getDataOfertaTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          this.datoOferta = res['data'] as IOferta[];
          this.dataSource.data = this.datoOferta;
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
    dialogConfig.data = ''
    this.dialog
      .open(AgregaOfertaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  actualizaOferta(datoOfertaPar: IOferta): void {
    console.log('datos actualiza:', datoOfertaPar);
    /* let datoOferta = {
      datoOfertaPar: datoOfertaPar,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id,
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
    dialogConfig.data = datoOfertaPar;
    this.dialog
      .open(ModificaOfertaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  eliminaOferta(datoOfertaPar: IOferta) {
    Swal.fire({
      title: 'Elimina Oferta - ' + datoOfertaPar.nombre + '!',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Elimina Erróneo Ingresado',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ofertaService
          .deleteDataOferta(
            datoOfertaPar._id!,
            this.localStorage?.usuarioLogin._id!
          )
          .subscribe((dato) => {
            if (dato.codigo === 200) {
              Swal.fire('Oferta Detalle', 'Se Eliminó con Éxito', 'success'); // ,
              this.refreshTable();
            } else {
              if (dato.codigo != 500) {
                Swal.fire(dato.mensaje, '', 'error');
              } else {
                console.log('Error Oferta:', dato);
                Swal.fire('', 'ERROR SISTEMA', 'error');
              }
            }
          });
      }
    });
  }

  detalleExamenesOferta(datoOfertaPar: IOferta) {
    //  agregaNuevo(empresaInterface_: EmpresaI) {
    // Nuevo
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = datoOfertaPar; /*{
      oferta: oferta,
      usuario: this.localStorage?.usuarioLogin._id,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };
*/
    this.dialog
      .open(DetalleOfertaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  async refreshTable() {
    await this.getListOferta();
    this.dataSource.paginator?.pageSize != this.paginator.pageSize;
  }
}
