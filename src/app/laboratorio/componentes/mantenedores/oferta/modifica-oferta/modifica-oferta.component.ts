import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamenesOferta, IOferta } from '@laboratorio/modelos/oferta-model';
import { OfertaService } from '@laboratorio/servicios/oferta.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

var moment: any = require('moment');

const today = new Date();

const dia = today.getDate();
const mes = today.getMonth();
const ano = today.getFullYear();

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatTreeModule,
  MatCheckboxModule,
  MatSelectModule,
  MatDatepickerModule,
];

@Component({
  selector: 'app-modifica-oferta',
  templateUrl: './modifica-oferta.component.html',
  styleUrls: ['./modifica-oferta.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaOfertaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaOfertaComponent>);
  readonly data = inject<IOferta>(MAT_DIALOG_DATA);

  private ofertaService = inject(OfertaService);

  datoOferta!: IOferta;
  iExamenesOferta!: IExamenesOferta[];

  constructor() {}

  start = new FormControl(new Date(ano, mes, dia), [Validators.required]);
  end = new FormControl(new Date(ano, mes, dia), [Validators.required]);

  /* range  = new FormGroup({
      start: this.start,
      end: this.end,
    });
*/
  nombre = new FormControl(this.data.nombre, [Validators.required]);
  montoTotal = new FormControl(this.data.montoTotal, [Validators.required]);

  modificaOferta = signal<FormGroup>(
    new FormGroup({
      start: this.start,
      end: this.end,

      nombre: this.nombre,
      montoTotal: this.montoTotal,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required')
        ? 'Debes ingresar Nombre EXAMEN'
        : '';
    }

    if (campo === 'montoTotal') {
      return this.montoTotal.hasError('required') ? 'Debes Ingresar Monto' : '';
    }

    return '';
  }

  ngOnInit() {
    this.spinnerService.mostrar();
    this.iExamenesOferta = this.data.examenesOferta!;
    this.spinnerService.esconder();
  }

  enviar() {
    this.spinnerService.mostrar();

    const fechaInicio =
      moment(this.modificaOferta().get('start')!.value).format(
        'YYYY-MM-DDT00:00:00.000'
      ) + 'Z';
    const fechaFin =
      moment(this.modificaOferta().value.end).format(
        'YYYY-MM-DDT23:59:59.000'
      ) + 'Z';

    this.datoOferta = {
      _id: this.data._id,
      nombre: this.modificaOferta().get('nombre')!.value,
      fechaDesde: fechaInicio,
      fechaHasta: fechaFin,
      montoTotal: this.modificaOferta().get('montoTotal')!.value,
      estadoOferta: 'Ingresado', // El estado se cambia en el BackEnd
      //  usuarioCrea_id: this.data.usuario,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
    };

    this.ofertaService.putDataOferta(this.datoOferta).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', 'Click en Botón!', 'success'); // ,
          this.dialogRef.close(1);
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Oferta:', dato);
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
}
