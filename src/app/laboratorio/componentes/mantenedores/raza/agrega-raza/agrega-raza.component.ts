import { Component, OnInit, ChangeDetectionStrategy, inject, signal, } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule, } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { IRaza } from '@laboratorio/modelos/raza-modelo';
import { EspecieService } from '@laboratorio/servicios/especie.service';
import { RazaService } from '@laboratorio/servicios/raza.service';
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
  selector: 'app-agrega-raza',
  templateUrl: './agrega-raza.component.html',
  styleUrls: ['./agrega-raza.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgregaRazaComponent implements OnInit {
  private readonly _storage = inject(StorageService);
  private readonly localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaRazaComponent>);

  private razaService = inject(RazaService);
  private especieService = inject(EspecieService);

  datoRaza!: IRaza;
  datoEspecie = signal<IEspecie[]>([]);

  constructor() { }

  idEspecie = new FormControl('', [Validators.required]);
  nombre = new FormControl('', [Validators.required]);

  agregaRaza = signal<FormGroup>(
    new FormGroup({
      idEspecie: this.idEspecie,
      nombre: this.nombre,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    if (campo === 'idEspecie') {
      return this.idEspecie.hasError('required')
        ? 'Debes Seleccionar Especie'
        : '';
    }

    return '';
  }

  async ngOnInit() {
    this.spinnerService.mostrar();
    await this.cargaEspecie();
    this.spinnerService.esconder();
  }

  cargaEspecie() {
    this.especieService
      .getDataEspecieTodo(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('especie:', res['data']);
          this.datoEspecie.set(res.data);
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  enviar() {
    this.spinnerService.mostrar();
    this.datoRaza = {
      nombre: this.agregaRaza().get('nombre')!.value,
      especieNombre: this.agregaRaza().get('idEspecie')!.value.nombre,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };
    this.razaService.postDataRaza(this.datoRaza).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', '', 'success'); // ,
          this.dialogRef.close(1);
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
}
