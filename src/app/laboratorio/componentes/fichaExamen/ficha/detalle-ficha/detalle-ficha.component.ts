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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { FichaService } from '@laboratorio/servicios/ficha.service';
import { IEmpresa } from '@modelos/empresa-modelo';
import { IIngresadoPorFicha } from '@laboratorio/interfaces/ingresadoPor-interface';

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
  selector: 'app-detalle-ficha',
  templateUrl: './detalle-ficha.component.html',
  styleUrls: ['./detalle-ficha.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleFichaComponent implements OnInit {
  private readonly _storage = inject(StorageService);
  private readonly localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<DetalleFichaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  private readonly dialog = inject(MatDialog);
  private readonly matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IFicha>();

  private readonly fichaService = inject(FichaService);

  tipoPermiso = '';
  datoFichaPar!: IFicha;
  datoEmpresa!: IEmpresa;
  IngresadoPorFichaEmp!: IIngresadoPorFicha;

  displayedColumns: string[] = [
    'index',
    'fichaC.numeroFicha',
    'fichaC.cliente.nombreFantasia',
    'fichaC.nombrePaciente',
    'fichaC.examen.nombre',
    'fichaC.examen.tiempoPreparacion',
    'fechaHora_crea',
    'seguimientoEstado.fechaHora_recepcionado_crea',
    'estadoFicha',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
  }

  async ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';

    this.getListFicha();
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'fichaC.numeroFicha':
          return item.fichaC.numeroFicha;
        case 'fichaC.cliente.nombreFantasia':
          return item.fichaC.cliente.nombreFantasia;
        case 'fichaC.nombrePaciente':
          return item.fichaC.nombrePaciente;
        case 'fichaC.examen.nombre':
          return item.fichaC.examen.nombre;
        case 'seguimientoEstado.fechaHora_recepcionado_crea':
          return item.seguimientoEstado.fechaHora_recepcionado_crea;

        default:
          return item[property];
      }
    };
  }

  getListFicha(): void {
    this.fichaService
      .getDataFichaIdFicha(this.data.empresa_Id, this.data.id_Ficha)
      .subscribe({
        next: (res) => {
          console.log('fichaaaaaa: ', res);
          this.dataSource.data = res.data as any[];
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error.error.error, 'error');
        },
      });
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
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    // dialogConfig.data = {usuario: this.currentUsuario.usuarioDato._id, empresa_Id:this.currentUsuario.usuarioDato.empresaConectada.empresa_Id,rutEmpresa:this.currentUsuario.usuarioDato.empresaConectada.rutEmpresa,idCliente: this.currentUsuario.usuarioDato.empresaConectada.empresa_Id,datoIngreso:this.IngresadoPorFichaEmp,tipoEmpresa:'Laboratorio'};
    dialogConfig.data = {
      usuario: this.localStorage?.usuarioLogin._id,
      empLaboratorio:
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      datoIngreso: this.localStorage?.usuarioLogin.empresaConectada,
    };
    //  dialogConfig.data = {
    //    idProducto: idProdP,
    //    titulo: tituloP
    //  };
    /*

        this.dialog.open(AgregaFichaComponent, dialogConfig)
        .afterClosed().subscribe(
         data => {console.log('Dialog output3333:', data);
                  if (data === 1) {
                      this.refreshTable();
                  }
          }
        );
        */
  }

  actualizaFicha(datoFicha: any) {
    this.datoFichaPar = datoFicha;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    /*
        dialogConfig.data = this.datoFichaPar;
        this.dialog.open(ModificaFichaComponent, dialogConfig)
        .afterClosed().subscribe(
         data => {console.log('Dialog output3333:', data);
                  if (data === 1) {
                      this.refreshTable();
                  }
          }
        );
    */
  }
  /*
  consultaFicha(datoFicha:any) {
    this.datoFichaPar = datoFicha;

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '90%';
      dialogConfig.height = '90%';
      dialogConfig.position = { top : '3%'};

      dialogConfig.data = this.datoFichaPar;
      this.dialog.open(ConsultaFichaComponent, dialogConfig)
      .afterClosed().subscribe(
       data => {console.log('Datoas Consulta:', data);
                if (data === 1) {
                    this.refreshTable();
                }
        }
      );

   }

   */

  recepcionFicha(numeroFicha: string) {
    Swal.fire({
      title: 'Recepcionar',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.fichaService
          .getDataFichaRecepcionaNumeroFicha(
            numeroFicha,
            this.data.empresa_Id,
            this.data.usuario
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
              console.log('error carga:', error);
              Swal.fire('ERROR INESPERADO', error.error.error, 'error');
            },
          }); // (this.dataSource.data = res as PerfilI[])
      }
    });
  }

  eliminaExamen(_id: string) {
    Swal.fire({
      title: 'Elimina EXÁMEN',
      text: 'El Exámen se eliminará para siempre!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.fichaService.deleteDataFicha(_id, this.data.usuario).subscribe({
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
            console.log('error carga:', error);
            Swal.fire('ERROR INESPERADO', error.error.error, 'error');
          },
        }); // (this.dataSource.data = res as PerfilI[])
      }
    });
  }

  private refreshTable() {
    this.getListFicha();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }

  cerrar() {
    this.dialogRef.close(1);
  }
}
