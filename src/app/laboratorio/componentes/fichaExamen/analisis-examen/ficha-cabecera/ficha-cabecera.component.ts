import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
  OnInit,
} from '@angular/core';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';

@Component({
  selector: 'app-ficha-cabecera',
  templateUrl: './ficha-cabecera.component.html',
  styleUrls: ['./ficha-cabecera.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FichaCabeceraComponent implements OnInit {
  /*  @Input()
  public datoFichaRecibeFicha!: any;
*/

  public datoFichaRecibeFicha = input.required<IFicha>();

  propietario = '--';
  constructor() {}

  ngOnInit(): void {
    if (this.datoFichaRecibeFicha().fichaC.nombrePropietario != '')
      this.propietario = this.datoFichaRecibeFicha().fichaC.nombrePropietario!;
    console.log('ficha imprime:', this.datoFichaRecibeFicha);
  }
}
