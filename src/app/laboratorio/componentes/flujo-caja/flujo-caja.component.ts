import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommonModule, formatDate } from '@angular/common';
import { AgregaFlujoCajaComponent } from './agrega-flujo-caja/agrega-flujo-caja.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { IFacturaFacturada } from '@laboratorio/interfaces/facturacion-interface';
import { FlujoCajaService } from '@laboratorio/servicios/flujoCaja.service';
import { MatTableExporterModule } from 'mat-table-exporter';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const today = new Date();

const dia = today.getDate();
const mes = today.getMonth();
const ano = today.getFullYear();

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDatepickerModule,
];

@Component({
  selector: 'app-flujo-caja',
  templateUrl: './flujo-caja.component.html',
  styleUrls: ['./flujo-caja.component.scss'],
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MATERIAL_MODELO,
    CommonModule,
    ReactiveFormsModule,
    MatTableExporterModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlujoCajaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IFacturaFacturada>();

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    'index',
    'fechaMes',
    'cuenta',
    'montoFijo',
    'cargos',
    'abonos',
    'opciones',
  ];
  selection = new SelectionModel<IFacturaFacturada>(true, []); //Box

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  flujoCajaService = inject(FlujoCajaService);

  anoMes = new FormControl(moment());
  idPagado = new FormControl('SinDato');

  flujoCaja = new FormGroup({
    anoMes: this.anoMes,
  });

  nombreArchivo =
    'FlujoCaja_' +
    this.localStorage?.usuarioLogin.empresaConectada.rutEmpresa
      .replace('.', '')
      .replace('.', '')
      .replace('-', '') +
    '_' +
    formatDate(new Date(), 'dd-MM-yyyy', 'en-US');

  fecha = '';
  constructor() {}

  async ngOnInit() {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };

    this.fecha = ano.toString() + (mes + 1).toString().padStart(2, '0');

    await this.getListConsultaCaja(this.fecha);

    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'fichaC.numeroFicha':
          return item.fichaC.numeroFicha;
        case 'fichaC.cliente.nombreFantasia':
          return item.fichaC.cliente.nombreFantasia;
        case 'fichaC.examen.nombre':
          return item.fichaC.examen.nombre;
        default:
          return item[property];
      }
    };
  }

  getListConsultaCaja(fecha: string) {
    this.flujoCajaService
      .getDataConsultaTotalCuentaMes(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
        fecha
      )
      .subscribe({
        next: (res) => {
          console.log('rescata datos:', res);
          this.dataSource.data = res['data'] as any[];
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

  AsignaFichaFactura(fechaFacturacion: string, idCliente: string) {}

  consultaFacturado(numFactura: number, idCliente: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '95%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '2%' };
    dialogConfig.data = { numFactura, idCliente };

    /*  this.dialog.open(DetalleFacturadoComponent, dialogConfig)
      .afterClosed().subscribe(
       data => {console.log('Dialog output3333:', data);
        }
      );
      */
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    console.log('anomes desdesss:', normalizedMonthAndYear);
    const ctrlValue = this.anoMes.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.anoMes.setValue(ctrlValue);
    this.fecha = moment(this.flujoCaja.get('anoMes')!.value).format('YYYYMM');
    this.getListConsultaCaja(this.fecha);
    datepicker.close();
    // const ano=this.anoMes.value!.year();
    // const mes=this.anoMes.value!.month()+1;
    // const fechaFacturacion=ano+'-'+mes+'-01 00:00:00'
  }

  agregaNuevo() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '95%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '2%' };
    dialogConfig.data = {
      fecha: this.fecha,
      usuario: this.localStorage?.usuarioLogin._id,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      rutEmpresa: this.localStorage?.usuarioLogin.empresaConectada.rutEmpresa,
    };

    this.dialog
      .open(AgregaFlujoCajaComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
      });
  }
}
