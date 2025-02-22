import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { AgregaDetalleOfertaComponent } from './agrega-detalle-oferta/agrega-detalle-oferta.component';
import { Numeric } from 'd3';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OfertaService } from '@laboratorio/servicios/oferta.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamenesOferta, IOferta } from '@laboratorio/modelos/oferta-model';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { DecimalPipe } from '@angular/common';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@Component({
  selector: 'app-detalle-oferta',
  templateUrl: './detalle-oferta.component.html',
  styleUrls: ['./detalle-oferta.component.css'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule, DecimalPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleOfertaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<DetalleOfertaComponent>);
  readonly data = inject<IOferta>(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);

  private ofertaService = inject(OfertaService);
  displayedColumns: string[] = ['index', 'nombreExamen', 'monto', 'opciones'];
  dataSource = new MatTableDataSource<IExamenesOferta>();

  private matPaginatorIntl = inject(MatPaginatorIntl);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  show: boolean = true;
  public datoOferta!: IOferta;

  isLoading = false;
  sumaDetalleOferta: Numeric = 0;
  MontoTotal: Numeric = 0;

  constructor() {
    //  this.dataSource = new MatTableDataSource<IExamenesOferta>([]);
  }

  async ngOnInit() {
    // Permite fintrar en nodos o sub campos
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };

    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    console.log('pasa emp 1', this.data);
    console.log('pasa emp 2', this.data);
    this.dataSource.data = this.data.examenesOferta!;
    this.datoOferta = this.data;
    this.MontoTotal = this.data.montoTotal;
    // await this.getOferta();
  }

  async getOferta() {
    this.isLoading = true;
    console.log('data detalle:', this.data);
    console.log('data.oferta detalle:', this.data._id);
    this.ofertaService.getDataOfertaActual(this.data._id!).subscribe({
      next: (res) => {
        this.datoOferta = res['data'][0];
        console.log('dato llamado:', this.datoOferta);
        this.dataSource.data = this.datoOferta
          .examenesOferta as IExamenesOferta[];
        this.isLoading = false;
      },
      // console.log('yo:', res as PerfilI[]),
      error: (error) => {
        this.isLoading = false;
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
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = this.datoOferta;

    this.dialog
      .open(AgregaDetalleOfertaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          this.refreshTable();
        }
      });
  }

  async eliminaOferta(datoExamenesOferta: IExamenesOferta) {
    console.log('datoExamenesOferta:', datoExamenesOferta);
    console.log('datoOferta Inicio:', this.datoOferta);
    Swal.fire({
      title: 'Elimina EXAMEN - ' + datoExamenesOferta.nombreExamen + '!',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Elimina Erróneo Ingresado',
    }).then((result) => {
      if (result.isConfirmed) {
        this.datoOferta.examenesOferta = this.datoOferta.examenesOferta!.filter(
          function (examen) {
            return examen._id !== datoExamenesOferta._id;
          }
        );
        console.log('datoOferta 2:', this.datoOferta);

        this.ofertaService.putDataOferta(this.datoOferta).subscribe((dato) => {
          if (dato.codigo === 200) {
            Swal.fire('Oferta Detalle', 'Se Eliminó con Éxito', 'success'); // ,
            this.dataSource.data = this.datoOferta
              .examenesOferta as IExamenesOferta[];
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

  detalleExamenesOferta(oferta: string) {
    //  agregaNuevo(empresaInterface_: EmpresaI) {
    // Nuevo
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = {
      oferta: oferta,
      usuario: this.localStorage?.usuarioLogin._id,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };

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

  cerrar() {
    this.dialogRef.close(1);
  }
  sumaMonto() {
    this.sumaDetalleOferta = this.datoOferta.examenesOferta!.reduce(
      (sum, value) =>
        typeof value.monto == 'number' ? sum + value.monto : sum,
      0
    );
    console.log('suma:', this.sumaDetalleOferta);
    return this.sumaDetalleOferta;
  }

  getTotalMonto() {
    return this.datoOferta
      .examenesOferta!.map((t) => t.monto)
      .reduce((acc, value) => acc + value, 0);
  }

  async refreshTable() {
    await this.getOferta();
    this.dataSource.paginator?.pageSize != this.paginator.pageSize;
  }

  actualizaOferta(datoExamenesOferta: IExamenesOferta) {
    console.log('dato actualiza:', datoExamenesOferta);
    Swal.fire({
      title: 'Modifica Monto',
      text: 'Ingrese Email',
      input: 'number',
      inputValue: datoExamenesOferta.monto,
      showCancelButton: true,
      confirmButtonText: 'Grabar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Monto Erróneo',
    }).then((result) => {
      if (result.isConfirmed) {
        var index = this.datoOferta.examenesOferta!.findIndex(
          (data) => data._id == datoExamenesOferta._id
        );
        console.log('index:', index);
        this.datoOferta.examenesOferta![index].monto = result.value;
        console.log('resultado input', this.datoOferta.examenesOferta);

        this.ofertaService.putDataOferta(this.datoOferta).subscribe({
          next: (res) => {
            console.log('res:', res);
            if (res.codigo == 200) {
              this.isLoading = false;
              this.refreshTable();
              Swal.fire('Se Modificó con Éxito', '', 'success');
            } else {
              this.isLoading = false;
              Swal.fire('ERROR INESPERADO', res.mensaje, 'error');
            }
          },
          error: (error) => {
            Swal.fire('ERROR INESPERADO', error, 'error');
          },
        });
      }
    });
  }
}
