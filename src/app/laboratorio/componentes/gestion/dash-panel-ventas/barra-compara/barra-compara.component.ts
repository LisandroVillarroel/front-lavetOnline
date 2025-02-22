import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IComparaAnterior } from '@laboratorio/interfaces/gestion-interface';
import { GestionService } from '@laboratorio/servicios/gestion.service';
import { StorageService } from '@shared/storage.service';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barra-compara',
  templateUrl: './barra-compara.component.html',
  styleUrls: ['./barra-compara.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgxChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraComparaComponent implements OnInit {
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

  comparaAnterior!: IComparaAnterior;

  public multi = signal<IComparaAnterior[]>([]);

  //multi: any[];
  view: [number, number] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Meses';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Ventas';
  legendTitle: string = '';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  anoP!: number;
  mesP!: number;

  constructor() {}

  ngOnInit(): void {
    console.log('cliente Vet', this.clienteVet());
    console.log('mes ano', this.anoMes);
    this.mesP = this.anoMes().month() + 1;
    this.anoP = this.anoMes().year();
    console.log('ano:', this.anoP);
    console.log('mes:', this.mesP);
    this.getComparaVentasAnoAnterior(this.mesP, this.anoP, this.clienteVet());
  }

  onSelect(data: any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //  console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //  console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getComparaVentasAnoAnterior(mesP: any, anoP: any, clienteVet: any) {
    console.log('ano compara:', anoP);
    this.gestionService
      .getDataComparaVentasAnoAnterior(
        anoP,
        mesP,
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
        clienteVet
      )
      .subscribe({
        next: (res) => {
          this.multi.set(res.data);
          console.log('data generallll: ', this.multi());
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  recepcionaPadreCompara(mesAno: any, clienteVet: any) {
    console.log('cliente Vet', clienteVet);
    console.log('mes ano', mesAno);
    this.mesP = mesAno.value.month() + 1;
    this.anoP = mesAno.value.year();
    console.log('ano:', this.anoP);
    console.log('mes:', this.mesP);
    this.getComparaVentasAnoAnterior(this.mesP, this.anoP, clienteVet);
  }
}
