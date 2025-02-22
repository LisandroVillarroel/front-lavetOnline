import {
  Component,
  OnInit,
  Inject,
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
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { IExamenesOferta, IOferta } from '@laboratorio/modelos/oferta-model';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { OfertaService } from '@laboratorio/servicios/oferta.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';
import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
];

@Component({
  selector: 'app-agrega-detalle-oferta',
  templateUrl: './agrega-detalle-oferta.component.html',
  styleUrls: ['./agrega-detalle-oferta.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaDetalleOfertaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaDetalleOfertaComponent>);
  readonly data = inject<IOferta>(MAT_DIALOG_DATA);

  private examenService = inject(ExamenService);
  private ofertaService = inject(OfertaService);

  datoExamen = signal<IExamen[]>([]);

  examenesOferta: IExamenesOferta[] = [];
  examenesOfertaDato!: IExamenesOferta;

  constructor() {}

  monto = new FormControl('', [Validators.required]);
  idExamen = new FormControl('', [Validators.required]);

  agregaDetalleOferta = signal<FormGroup>(
    new FormGroup({
      monto: this.monto,
      idExamen: this.idExamen,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'monto') {
      return this.monto.hasError('required') ? 'Debes ingresar Monto' : '';
    }

    if (campo === 'idExamen') {
      return this.idExamen.hasError('required')
        ? 'Debes Seleccionar EXAMEN'
        : '';
    }

    return '';
  }

  ngOnInit() {
    this.cargaExamen();
  }

  cargaExamen() {
    this.examenService
      .getDataExamenTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          this.datoExamen.set(res.data);
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  enviar() {
    this.examenesOfertaDato = {
      idExamen: this.agregaDetalleOferta().get('idExamen')!.value._id,
      nombreExamen: this.agregaDetalleOferta().get('idExamen')!.value.nombre,
      codigoInterno:
        this.agregaDetalleOferta().get('idExamen')!.value.codigoInterno,
      monto: this.agregaDetalleOferta().get('monto')!.value,
    };

    console.log('dato data:', this.data);
    if (this.data.examenesOferta != undefined)
      this.examenesOferta = this.data.examenesOferta;

    this.examenesOferta.push(this.examenesOfertaDato);

    this.data.examenesOferta = this.examenesOferta;

    console.log('data:', this.data);
    this.ofertaService.putDataOferta(this.data).subscribe((dato) => {
      if (dato.codigo === 200) {
        Swal.fire('Se agregó con Éxito', '', 'success'); // ,
        this.dialogRef.close(1);
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
}
