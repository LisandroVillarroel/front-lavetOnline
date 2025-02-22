import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

import Swal from 'sweetalert2';
import { BarraGeneralComponent } from './barra-general/barra-general.component';
import { BarraComparaComponent } from './barra-compara/barra-compara.component';
import { BarraExamenesComponent } from './barra-examenes/barra-examenes.component';
import { BarraDiasComponent } from './barra-dias/barra-dias.component';
import { BarraVeterinariaComponent } from './barra-veterinaria/barra-veterinaria.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

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

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatIconModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
];

@Component({
  selector: 'app-dash-panel-ventas',
  templateUrl: './dash-panel-ventas.component.html',
  styleUrls: ['./dash-panel-ventas.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    //   {
    //     provide: DateAdapter,
    //     useClass: MomentDateAdapter,
    //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    //   },

    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    provideMomentDateAdapter(MY_FORMATS),
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MATERIAL_MODELO,
    ReactiveFormsModule,
    FormsModule,
    BarraVeterinariaComponent,
    BarraGeneralComponent,
    BarraExamenesComponent,
    BarraDiasComponent,
    BarraComparaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashPanelVentasComponent {
  @ViewChild('selector1')
  BarraGeneralHijo!: BarraGeneralComponent;
  @ViewChild('selector2')
  getComparaVentasAnoAnterior!: BarraComparaComponent;
  @ViewChild('selector3')
  getVentaExamen!: BarraExamenesComponent;
  @ViewChild('selector4')
  getVentaDia!: BarraDiasComponent;
  @ViewChild('selector5')
  getVentaCliente!: BarraVeterinariaComponent;

  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  public datoCliente = signal<ICliente[]>([]);

  private clienteService = inject(ClienteService);

  /** Based on the screen size, switch from standard to one column per row */
  anoMes = new FormControl(moment());

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.anoMes.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.anoMes.setValue(ctrlValue);
    datepicker.close();
    console.log('paso', this.anoMes);
    this.BarraGeneralHijo.recepcionaPadre(
      this.anoMes,
      this.formClienteVet.get('cliente')!.value
    );
    this.getComparaVentasAnoAnterior.recepcionaPadreCompara(
      this.anoMes,
      this.formClienteVet.get('cliente')!.value
    );
    this.getVentaExamen.recepcionaPadreCompara(
      this.anoMes,
      this.formClienteVet.get('cliente')!.value
    );
    this.getVentaDia.recepcionaPadreCompara(
      this.anoMes,
      this.formClienteVet.get('cliente')!.value
    );
    this.getVentaCliente.recepcionaPadreCompara(
      this.anoMes,
      this.formClienteVet.get('cliente')!.value
    );
  }

  cliente = new FormControl('Todos');
  formClienteVet = new FormGroup({
    cliente: this.cliente,
  });

  constructor() {}

  async ngOnInit() {
    console.log('pasa ficha 1', this.anoMes);
    this.cargaCliente();
  }

  cargaCliente() {
    this.clienteService
      .getDataCliente(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res: any) => {
          this.datoCliente.set(res.data);
        },
        // console.log('yo:', res as PerfilI[]),

        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  async seleccionaVeterinaria(p: any) {
    console.log('dats cliente:', p);

    console.log('anomes:', this.anoMes);

    this.BarraGeneralHijo.recepcionaPadre(this.anoMes, p);
    this.getComparaVentasAnoAnterior.recepcionaPadreCompara(this.anoMes, p);
    this.getVentaExamen.recepcionaPadreCompara(this.anoMes, p);
    this.getVentaDia.recepcionaPadreCompara(this.anoMes, p);
    this.getVentaCliente.recepcionaPadreCompara(this.anoMes, p);
    return;
  }
}
