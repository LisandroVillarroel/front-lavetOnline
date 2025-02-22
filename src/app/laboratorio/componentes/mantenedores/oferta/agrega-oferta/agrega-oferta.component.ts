import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IOferta } from '@laboratorio/modelos/oferta-model';
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
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
];

@Component({
  selector: 'app-agrega-oferta',
  templateUrl: './agrega-oferta.component.html',
  styleUrls: ['./agrega-oferta.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaOfertaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaOfertaComponent>);

  private ofertaService = inject(OfertaService);

  datoOferta!: IOferta;

  constructor(
  ) { }

  start = new FormControl(new Date(ano, mes, dia), [Validators.required]);
  end = new FormControl(new Date(ano, mes, dia), [Validators.required]);

  /* range  = new FormGroup({
      start: this.start,
      end: this.end,
    });
*/
  nombre = new FormControl('', [Validators.required]);
  montoTotal = new FormControl('', [Validators.required]);

  agregaOferta = signal<FormGroup>(
    new FormGroup({
      start: this.start,
      end: this.end,

      nombre: this.nombre,
      montoTotal: this.montoTotal,
    }));

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

  ngOnInit() { }

  enviar() {
    this.spinnerService.mostrar();

    const fechaInicio =
      moment(this.agregaOferta().get('start')!.value).format(
        'YYYY-MM-DDT00:00:00.000'
      ) + 'Z';
    const fechaFin =
      moment(this.agregaOferta().value.end).format('YYYY-MM-DDT23:59:59.000') +
      'Z';

    this.datoOferta = {
      nombre: this.agregaOferta().get('nombre')!.value,
      fechaDesde: fechaInicio,
      fechaHasta: fechaFin,
      montoTotal: this.agregaOferta().get('montoTotal')!.value,
      estadoOferta: 'Ingresado',
      usuarioCrea_id: this.localStorage?.usuarioLogin._id!,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
    };

    console.log('agrega 1:', this.datoOferta);

    this.ofertaService.postDataOfert(this.datoOferta).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', 'Click en Botón!', 'success'); // ,
          this.dialogRef.close(1);
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Doctor Solicitante:', dato);
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
