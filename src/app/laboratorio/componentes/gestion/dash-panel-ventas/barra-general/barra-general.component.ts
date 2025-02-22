import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  OnInit,
  signal,
} from '@angular/core';

import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

import Swal from 'sweetalert2';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { loginInterface } from '@autentica/interface/loginInterface';
import { StorageService } from '@shared/storage.service';
import {
  IGestionGeneral,
  IGestionGrafico,
} from '@laboratorio/interfaces/gestion-interface';
import { GestionService } from '@laboratorio/servicios/gestion.service';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-barra-general',
  templateUrl: './barra-general.component.html',
  styleUrls: ['./barra-general.component.scss'],
  imports: [NgxChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraGeneralComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  /*
  @Input()
  anoMes!: any;
  @Input()
  clienteVet!: any;
*/
  public anoMes = input.required<any>();
  public clienteVet = input.required<any>();

  private gestionService = inject(GestionService);

  private gestionGeneral!: IGestionGeneral;

  public single = signal<IGestionGrafico[]>([]);

  view: [number, number] = [700, 400];

  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  cardColor: string = '#000000';

  anoP!: number;
  mesP!: number;
  constructor() {}

  onSelect(event: any) {
    console.log(event);
  }

  ngOnInit(): void {
    console.log('cliente Vet', this.clienteVet());
    console.log('mes ano', this.anoMes());
    this.mesP = this.anoMes().month() + 1;
    this.anoP = this.anoMes().year();
    console.log('ano:', this.anoP);
    console.log('mes:', this.mesP);
    this.getValorGeneral(this.mesP, this.anoP, this.clienteVet());
  }

  formatDataLabel(value: any) {
    let formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
    //let res =
    return formatter.format(value.value);
  }

  getValorGeneral(mesP: any, anoP: any, clienteVet: any) {
    this.gestionService
      .getDataGestionGeneral(
        anoP,
        mesP,
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
        clienteVet
      )
      .subscribe({
        next: (res) => {
          this.gestionGeneral = res['data'];
          console.log('data general: ', this.gestionGeneral);
          this.single.set([
            {
              name: String(anoP),
              value: this.gestionGeneral.valorAnualGeneralTotal,
            },
            {
              name: this.obtenerNombreMes(mesP),
              value: this.gestionGeneral.valorAnualGeneralMesTotal,
            },
          ]);
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  recepcionaPadre(mesAno: any, clienteVet: any) {
    console.log('cliente Vet', clienteVet);
    console.log('mes ano', mesAno);
    this.mesP = mesAno.value.month() + 1;
    this.anoP = mesAno.value.year();
    console.log('ano:', this.anoP);
    console.log('mes:', this.mesP);
    this.getValorGeneral(this.mesP, this.anoP, clienteVet);
  }

  obtenerNombreMes(numero: number) {
    let mesLetra = '';
    if (numero === 1) mesLetra = 'Enero';
    else if (numero === 2) mesLetra = 'Febrero';
    else if (numero === 3) mesLetra = 'Marzo';
    else if (numero === 4) mesLetra = 'Abril';
    else if (numero === 5) mesLetra = 'Mayo';
    else if (numero === 6) mesLetra = 'Junio';
    else if (numero === 7) mesLetra = 'Julio';
    else if (numero === 8) mesLetra = 'Agosto';
    else if (numero === 9) mesLetra = 'Septiembre';
    else if (numero === 10) mesLetra = 'Octubre';
    else if (numero === 11) mesLetra = 'Noviembre';
    else mesLetra = 'Diciembre';

    return mesLetra;
  }
}
