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
import { MatStepperModule } from '@angular/material/stepper';
import { MatTreeModule } from '@angular/material/tree';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IClienteInterface } from '@laboratorio/interfaces/cliente-interface';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import { ClienteService } from '@laboratorio/servicios/cliente.service';

import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

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
  MatStepperModule,
];

@Component({
    selector: 'app-modifica-cliente',
    templateUrl: './modifica-cliente.component.html',
    styleUrls: ['./modifica-cliente.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModificaClienteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaClienteComponent>);
  readonly data = inject<IClienteInterface>(MAT_DIALOG_DATA);

  private servCliente = inject(ClienteService);
  datoCliente!: ICliente;

  constructor() {
    //  let query={'empresa.empresa_Id': , estado: {$ne:'Borrado'}};
    //  let existeElementoMayorQueDiez = this.datoClientePar.find(element=> element.empresa_Id === 10);
    // this.id = data.id;
    // this.rutEmpresa: data.rutEmpresa;
    // this.razonSocialPar = data.razonSocial;
    // nombreFantasia: string;
    // direccion: string;
    // usuario: string;
  }

  razonSocial = new FormControl(this.data.datoClientePar.razonSocial, [
    Validators.required,
  ]);
  nombreFantasia = new FormControl(this.data.datoClientePar.nombreFantasia, [
    Validators.required,
  ]);
  direccion = new FormControl(this.data.datoClientePar.direccion, [
    Validators.required,
  ]);
  telefono = new FormControl(this.data.datoClientePar.telefono, [
    Validators.required,
  ]);
  email = new FormControl(this.data.datoClientePar.email, [
    Validators.required,
  ]);
  nombreContacto = new FormControl(this.data.datoClientePar.nombreContacto, [
    Validators.required,
  ]);
  emailRecepcionExamenCliente = new FormControl(
    this.data.datoClientePar.emailRecepcionExamenCliente,
    [Validators.required]
  );

  //emailEnvio = new FormControl(this.data.datoClientePar.empresa[0]?.envioEmail?.emailEnvio, [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]);
  //password = new FormControl(this.data.datoClientePar.empresa[0]?.envioEmail?.password, [Validators.required]);
  //  nombreDesde = new FormControl(this.data.datoClientePar.envioEmail?.nombreDesde, [Validators.required]);
  ///  asunto = new FormControl(this.data.datoClientePar.envioEmail?.asunto, [Validators.required]);
  ///  tituloCuerpo = new FormControl(this.data.datoClientePar.envioEmail?.tituloCuerpo, [Validators.required]);
  ///  tituloCuerpoMedio = new FormControl(this.data.datoClientePar.envioEmail?.tituloCuerpoMedio, [Validators.required]);
  ///  tituloCuerpoPie = new FormControl(this.data.datoClientePar.envioEmail?.tituloCuerpoPie, [Validators.required]);

  modificaCliente = signal<FormGroup>(
    new FormGroup({
      // rutEmpresa: this.datoEmpresaPar.rutEmpresa,
      razonSocial: this.razonSocial,
      nombreFantasia: this.nombreFantasia,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      nombreContacto: this.nombreContacto,
      emailRecepcionExamenCliente: this.emailRecepcionExamenCliente,

      //emailEnvio: this.emailEnvio,
      //password: this.password,
      // nombreDesde: this.nombreDesde,
      ///  asunto: this.asunto,
      /// tituloCuerpo: this.tituloCuerpo,
      ///  tituloCuerpoMedio: this.tituloCuerpoMedio,
      ///  tituloCuerpoPie: this.tituloCuerpoPie
    })
  );

  getErrorMessage() {
    return this.razonSocial.hasError('required')
      ? 'Debes ingresar Razón Social'
      : this.nombreFantasia.hasError('required')
      ? 'Debes ingresar Nombre Fantasía'
      : this.direccion.hasError('required')
      ? 'Debes ingresar Dirección'
      : this.telefono.hasError('required')
      ? 'Debes ingresar Teléfono'
      : this.email.hasError('required')
      ? 'Debes ingresar Email'
      : this.nombreContacto.hasError('required')
      ? 'Debes ingresar Nombre Contacto'
      : this.emailRecepcionExamenCliente.hasError('required')
      ? 'Debes ingresar Email Envío EXAMEN'
      : //this.emailEnvio.hasError('required') ? 'Debes ingresar Email Envío' :
        //this.password.hasError('required') ? 'Debes ingresar Email Envío' :
        //this.nombreDesde.hasError('required') ? 'Debes ingresar Nombre Desde' :
        //  this.asunto.hasError('required') ? 'Debes ingresar Asunto' :
        //  this.tituloCuerpo.hasError('required') ? 'Debes ingresar Título Cuerpo' :
        ///this.tituloCuerpoMedio.hasError('required') ? 'Debes ingresar Título Cuerpo Medio' :
        ///this.tituloCuerpoPie.hasError('required') ? 'Debes ingresar Título Cuerpo Pie' :
        '';
  }

  ngOnInit() {
    this.spinnerService.esconder();
  }

  enviar() {
    this.spinnerService.mostrar();
    /*
    this.clienteEmpresa = [{
  ///    empresa_Id: this.datoClientePar.empresa.empresa_Id,
      razonSocial: this.modificaCliente.get('razonSocial')!.value,
      nombreFantasia: this.modificaCliente.get('nombreFantasia')!.value,
      direccion: this.modificaCliente.get('direccion')!.value,
      telefono: this.modificaCliente.get('telefono')!.value,
      email: this.modificaCliente.get('email')!.value,
      nombreContacto: this.modificaCliente.get('nombreContacto')!.value,
      emailEnvioExamenCliente: this.modificaCliente.get('emailEnvioExamenCliente')!.value,
      usuarioModifica_id: this.data.usuarioModifica_id,
 ///     menu_Id:this.datoClientePar.menu_Id
    }];
*/
    /*
    this.datoEnviaCorreo={
      //nombreDesde: this.modificaCliente.get('nombreDesde')!.value,
      asunto: this.modificaCliente.get('asunto')!.value,
      tituloCuerpo: this.modificaCliente.get('tituloCuerpo')!.value,
      tituloCuerpoMedio: '', //this.modificaCliente.get('tituloCuerpoMedio')!.value,
      tituloCuerpoPie: '', //this.modificaCliente.get('tituloCuerpoPie')!.value
    }
*/

    this.datoCliente = {
      _id: this.data.datoClientePar._id,
      rutCliente: this.data.datoClientePar.rutCliente,
      razonSocial: this.modificaCliente().get('razonSocial')!.value,
      nombreFantasia: this.modificaCliente().get('nombreFantasia')!.value,
      direccion: this.modificaCliente().get('direccion')!.value,
      telefono: this.modificaCliente().get('telefono')!.value,
      email: this.modificaCliente().get('email')!.value,
      nombreContacto: this.modificaCliente().get('nombreContacto')!.value,
      /// envioEmail: this.datoEnviaCorreo,
      emailRecepcionExamenCliente: this.modificaCliente().get(
        'emailRecepcionExamenCliente'
      )!.value,
      empresa: this.data.datoClientePar.empresa,
      tipoEmpresa: this.data.datoClientePar.tipoEmpresa,
      nombreLogo: this.data.datoClientePar.nombreLogo,
      usuarioModifica_id: this.data.usuarioModifica_id,
    };
    console.log('this.datoClienteEmpresaOriginal envia:', this.datoCliente);

    this.servCliente.putDataCliente(this.datoCliente).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        console.log('respuesta:', dato);
        if (dato.codigo === 200) {
          Swal.fire('Ya se Actualizó con Éxito', '', 'success'),
            this.dialogRef.close(1);
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Cliente:', dato);
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      },
      error: (error) => {
        this.spinnerService.esconder();
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error.error.error, 'error');
      },
    });

    // this.dialogRef.close(this.form.value);
    // console.log(this.datoCotiza);
  }
}
