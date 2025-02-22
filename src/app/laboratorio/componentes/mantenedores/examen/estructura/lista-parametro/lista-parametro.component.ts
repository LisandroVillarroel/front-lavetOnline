
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { IFormato1, IResultadoEspecieFormato1, IResultadoFormato1 } from '@laboratorio/modelos/examenes/examenFormato1';
import { IExamenEstructura } from '@laboratorio/interfaces/examenEstructura-interface';
import { EspecieService } from '@laboratorio/servicios/especie.service';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AgregaEstructuraFormato1Component } from './estructura-formato1/agrega-estructura-formato1/agregaEstructuraFormato1.component';
import { ModificaEstructuraFormato1Component } from './estructura-formato1/modifica-estructura-formato1/modificaEstructuraFormato1.component';


const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule,
  MatSelectModule
];

@Component({
  selector: 'app-lista-parametro',
  templateUrl: './lista-parametro.component.html',
  styleUrl: './lista-parametro.component.scss',
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaParametroComponent {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dataIdExamen = inject<string>(MAT_DIALOG_DATA);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  private datoExamenResultadoEspecie: IResultadoEspecieFormato1[] = [];
  private datoExamenResultado!: IResultadoFormato1[];
  private examenEstructura!: IExamenEstructura;

  private datoExamen!: IExamen;

  dataSource = new MatTableDataSource<IResultadoFormato1>();

  especieForm = new FormControl('');

  private examenService = inject(ExamenService);

  private especieService = inject(EspecieService);

  public datoEspecie = signal<IEspecie[]>([]);

  private maxOrden: number = 0;
  private resultadoEspecieIndex: number = 0;

  visible = signal<boolean>(true);
  show = signal<boolean>(true);
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'ordenEstructura',
    'descripcion',
    'unidadMedida',
    'resultado',
    'referencia',
    'logica',
    'desde',
    'hasta',
    'opciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  private _sort!: MatSort;
  public get sort(): MatSort {
    return this._sort;
  }
  public set sort(value: MatSort) {
    this._sort = value;
  }

  public nombreArchivo = 'examenes';
  constructor() { }

  async ngOnInit() {
    console.log('datos llegados', this.dataIdExamen)
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
    await this.cargaEspecie();
    this.spinnerService.esconder();
  }

  cargaEspecie() {
    this.especieService
      .getDataEspecieTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res: any) => {
          this.datoEspecie.set(res.data);
        },
        // console.log('yo:', res as PerfilI[]),

        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  seleccionaEspecie(especieId: string) {
    this.getList(especieId);
  }

  getList(especieId: string) {
    this.examenService
      .getDataExamen(
        this.dataIdExamen
      )
      .subscribe({
        next: (res) => {
          if (res.codigo == 200) {
            this.datoExamen = res.data[0];
            console.log('examen origen:', this.datoExamen);
            console.log('especieId:', especieId)
            if (this.datoExamen.formato?.formato1?.resultadoEspecie == undefined || this.datoExamen.formato?.formato1?.resultadoEspecie.length == 0) {
              this.datoExamenResultadoEspecie.push({ especie_Id: especieId, resultado: [] }) //Agrega registro vacio para esda especie
              console.log('paso1')
            } else {
              this.datoExamenResultadoEspecie = this.datoExamen.formato?.formato1?.resultadoEspecie; //Rescata todos los parametros por especie
              console.log('paso2');
              console.log('this.datoExamenResultadoEspecie 1:', this.datoExamenResultadoEspecie);
              this.resultadoEspecieIndex = this.datoExamenResultadoEspecie.findIndex((valor: any) => valor.especie_Id === especieId);
            }


            //this.datoExamenResultadoEspecie = res.data.formato?.formato1?.resultadoEspecie.find((resultadoEspecie: any) => resultadoEspecie.especie_Id === especieId);
            //  this.datoExamenResultadoEspecie = res.data.formato?.formato1?.resultadoEspecie

            console.log('this.resultadoEspecieIndex:', this.resultadoEspecieIndex);
            console.log('this.datoExamenResultadoEspecie:', this.datoExamenResultadoEspecie);


            this.datoExamenResultado = this.datoExamenResultadoEspecie[this.resultadoEspecieIndex].resultado;
            console.log('this.datoExamenResultado:', this.datoExamenResultado);
            console.log('this.datoExamenResultado largo:', this.datoExamenResultado.length);
            this.datoExamenResultado.sort((a, b) => a.ordenEstructura - b.ordenEstructura);
            console.log('pasa Examen 2', this.datoExamenResultado);

            if (this.datoExamenResultado.length > 0) {
              this.maxOrden = this.datoExamenResultado[this.datoExamenResultado.length - 1].ordenEstructura + 1;
            }
            console.log('maxOrden', this.maxOrden);
            this.dataSource.data = this.datoExamenResultado;
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
    dialogConfig.width = '55%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '2%' };

    dialogConfig.data = row;

    /*
          this.dialog.open(Formato1Component, dialogConfig)
          .afterClosed().subscribe(
           data => {console.log('Datoas Consulta:', data);
            }
          );
    */
    /*
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
    */
  }

  agregaEstructura() {
    //  agregaNuevo(empresaInterface_: EmpresaI) {
    // Nuevo
    this.examenEstructura = {
      maximoEstructura: this.maxOrden,
      resultado: this.datoExamenResultado,
    }
    console.log('his.examenEstructura:', this.examenEstructura);
    console.log('this.resultadoEspecieIndex:', this.resultadoEspecieIndex);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = this.examenEstructura;

    this.dialog
      .open(AgregaEstructuraFormato1Component, dialogConfig)
      .afterClosed()
      .subscribe((data: IExamenEstructura) => {
        console.log('examen111:', this.datoExamen);
        console.log('Dialog output estructura:', data.resultado);
        this.datoExamenResultadoEspecie[this.resultadoEspecieIndex].resultado != data.resultado;
        console.log('datoExamenResultadoEspecie:', this.datoExamenResultadoEspecie);


        this.datoExamen.formato!.formato1!.resultadoEspecie = this.datoExamenResultadoEspecie;
        console.log('examen:', this.datoExamen);
        if (data.resultado != undefined) {
          this.enviar(this.datoExamen, 'Se agregó con Éxito')
        }
      });

  }

  actualizaEstructura(id: string) {
    // Actualiza
    console.log('id:', id)

    this.examenEstructura = {
      indice: this.datoExamenResultado.findIndex((valor: any) => valor._id === id),
      resultado: this.datoExamenResultado,
    }
    console.log('his.examenEstructura:', this.examenEstructura);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };
    dialogConfig.data = this.examenEstructura;

    this.dialog
      .open(ModificaEstructuraFormato1Component, dialogConfig)
      .afterClosed()
      .subscribe((data: IExamenEstructura) => {
        console.log('examen111:', this.datoExamen);
        console.log('Dialog output estructura:', data.resultado);
        this.datoExamenResultadoEspecie[this.resultadoEspecieIndex].resultado != data.resultado;
        console.log('datoExamenResultadoEspecie:', this.datoExamenResultadoEspecie);

        this.datoExamen.formato!.formato1!.resultadoEspecie = this.datoExamenResultadoEspecie;
        console.log('examen:', this.datoExamen);
        if (data.resultado != undefined) {

          this.enviar(this.datoExamen, 'Se actualizó con Éxito')
        }
      });

  }
  /*
    actualiza(datoPar: IExamen) {
         this.datoPar = {
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
  /*
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

}*/

  consulta(datoPar: IExamen) {
    /*
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
      */
  }

  async elimina(datoParametro: IResultadoFormato1) {
    Swal.fire({
      title: "Elimina  - " + datoParametro.descripcion + " !",
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      validationMessage: 'Elimina Erróneo '
    }).then((result) => {

      if (result.isConfirmed) {
        this.datoExamenResultado = this.datoExamenResultado!.filter(function (parametro) {
          return parametro._id !== datoParametro._id;
        })
        console.log('this.datoExamenResultado 2:', this.datoExamenResultado);

        this.datoExamenResultadoEspecie[this.resultadoEspecieIndex].resultado = this.datoExamenResultado;
        console.log('datoExamenResultadoEspecie:', this.datoExamenResultadoEspecie);


        this.datoExamen.formato!.formato1!.resultadoEspecie = this.datoExamenResultadoEspecie;
        console.log('dato examen final:', this.datoExamen)
        this.enviar(this.datoExamen, 'Se eliminó con Éxito');

      }
    });
  }

  enviar(datoExamen_: IExamen, mensajeConfirma: string) {
    this.spinnerService.mostrar();

    this.examenService.putDataExamen(datoExamen_).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire(mensajeConfirma, '', 'success'); // ,
          console.log('paso refre')
          this.refreshTable();
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Raza:', dato);
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      },
      error: (error) => {
        this.spinnerService.esconder();
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    // this.dataSource.paginator._changePageSize(this.paginator.pageSize);
    // this.noticia=this.servicio.getNoticias();

    this.getList(this.especieForm.value!);
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }

  colorIconFormato(internoExterno: string) {
    let colorFondo;
    if (internoExterno == 'Externo') colorFondo = 'colorIconExterno';

    return colorFondo;
  }
}
