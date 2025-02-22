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

import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';

import Swal from 'sweetalert2';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
import { MenuService } from '@servicios/menu.service';
import { ICliente, IClienteEmpresa } from '@laboratorio/modelos/cliente-modelo';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-agrega-cliente',
  templateUrl: './agrega-cliente.component.html',
  styleUrls: ['./agrega-cliente.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaClienteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialogRef = inject(MatDialogRef<AgregaClienteComponent>);

  private servCliente = inject(ClienteService);
  private menuService = inject(MenuService);

  datoCliente: ICliente | undefined;
  clienteEmpresa!: IClienteEmpresa[];

  clienteEmpresa_!: IClienteEmpresa;

  clienteEmpresaRescata!: IClienteEmpresa[];
  datoClienteRescata: ICliente | undefined;
  //datoEnviaCorreo!: IEmailCliente;

  tipoEmpresa!: string;
  menu_Id!: string;
  _idBusca!: string;
  rutClienteBusca!: string;
  constructor() {}

  async ngOnInit() {
    await this.getDataMenu();
    this.spinnerService.esconder();
  }

  rutCliente = new FormControl('', [Validators.required, this.validaRut]);
  razonSocial = new FormControl('', [Validators.required]);
  nombreFantasia = new FormControl('', [Validators.required]);
  direccion = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  nombreContacto = new FormControl('', [Validators.required]);
  emailRecepcionExamenCliente = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);

  /*emailEnvio = new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]);
    password = new FormControl('', [Validators.required]);*/
  // nombreDesde = new FormControl('', [Validators.required]);
  /// asunto = new FormControl('', [Validators.required]);
  /// tituloCuerpo = new FormControl('', [Validators.required]);
  /// tituloCuerpoMedio = new FormControl('', [Validators.required]);
  /// tituloCuerpoPie = new FormControl('', [Validators.required]);

  agregaCliente = signal<FormGroup>(
    new FormGroup({
      rutCliente: this.rutCliente,
      razonSocial: this.razonSocial,
      nombreFantasia: this.nombreFantasia,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      nombreContacto: this.nombreContacto,
      emailRecepcionExamenCliente: this.emailRecepcionExamenCliente,

      /* emailEnvio: this.emailEnvio,
      password: this.password,*/
      // nombreDesde: this.nombreDesde,
      ///   asunto: this.asunto,
      ///   tituloCuerpo: this.tituloCuerpo,
      ///    tituloCuerpoMedio: this.tituloCuerpoMedio,
      ///    tituloCuerpoPie: this.tituloCuerpoPie

      // address: this.addressFormControl
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'rutCliente') {
      return this.rutCliente.hasError('required')
        ? 'Debes ingresar Rut'
        : this.rutCliente.hasError('rutInvalido')
        ? 'Rut Inválido'
        : '';
    }
    if (campo === 'razonSocial') {
      return this.razonSocial.hasError('required')
        ? 'Debes ingresar Razón Social'
        : '';
    }
    if (campo === 'nombreFantasia') {
      return this.nombreFantasia.hasError('required')
        ? 'Debes ingresar Nombre Fantasía'
        : '';
    }
    if (campo === 'direccion') {
      return this.direccion.hasError('required')
        ? 'Debes ingresar Dirección'
        : '';
    }
    if (campo === 'telefono') {
      return this.telefono.hasError('required')
        ? 'Debes ingresar Teléfono'
        : '';
    }
    if (campo === 'email') {
      return this.email.hasError('required') ? 'Debes ingresar Email' : '';
    }
    if (campo === 'nombreContacto') {
      return this.nombreContacto.hasError('required')
        ? 'Debes ingresar Nombre Contacto'
        : '';
    }
    if (campo === 'emailRecepcionExamenCliente') {
      return this.emailRecepcionExamenCliente.hasError('required')
        ? 'Debes ingresar Email Envío EXAMEN'
        : '';
    }

    /*
      if (campo === 'emailEnvio'){
        return this.emailEnvio.hasError('required') ? 'Debes ingresar Email Envio' : '';
      }
      if (campo === 'password'){
        return this.password.hasError('required') ? 'Debes ingresar Password' : '';
      }

      if (campo === 'nombreDesde'){
        return this.nombreDesde.hasError('required') ? 'Debes ingresar Nombre Desde' : '';
      }

      if (campo === 'asunto'){
        return this.asunto.hasError('required') ? 'Debes ingresar Asunto' : '';
      }
      if (campo === 'tituloCuerpo'){
        return this.tituloCuerpo.hasError('required') ? 'Debes ingresar Título Cuerpo' : '';
      }
      if (campo === 'tituloCuerpoMedio'){
        return this.tituloCuerpoMedio.hasError('required') ? 'Debes ingresar Título Cuerpo Medio' : '';
      }
      if (campo === 'tituloCuerpoPie'){
        return this.tituloCuerpoPie.hasError('required') ? 'Debes ingresar título Cuerpo Pie' : '';
      }*/
    /* return this.rutEmpresa.hasError('required') ? 'Debes ingresar Rut' :
             this.rutEmpresa.hasError('rutInvalido') ? 'Rut Inválido' :
          this.razonSocial.hasError('required') ? 'Debes ingresar Razón Social' :
          this.nombreFantasia.hasError('required') ? 'Debes ingresar Nombre Fantasía' :
          this.direccion.hasError('required') ? 'Debes ingresar Dirección' :
              '';
            */
    return '';
  }

  validaRut(control: FormControl): { [s: string]: boolean } {
    console.log('uno', control.value);
    // let out1_rut = this.rutService.getRutChile(0, '12514508-6');
    if (validateRut(control.value) === false) {
      return { rutInvalido: true };
    }
    return null as any;
  }

  async onBlurRutCliente(event: any) {
    const rut = event.target.value;

    if (validateRut(rut) === true) {
      await this.agregaCliente()
        .get('rutCliente')!
        .setValue(formatRut(rut, RutFormat.DOTS_DASH));
      await this.BuscaRut(formatRut(rut, RutFormat.DOTS_DASH));
    }
  }

  async BuscaRut(rutCliente: string) {
    this.servCliente.getDataClientePorRut(rutCliente).subscribe({
      next: (res) => {
        console.log(' res:', res);
        console.log(' res.data[0]:', res.data[0]);

        if (res.data[0] != undefined) {
          this.clienteEmpresaRescata = res.data[0].empresa;
          this.datoClienteRescata = res.data[0];

          //   this.datoEnviaCorreo=res.data[0].envioEmail;
          //this._idBusca=res.data[0]._id;
          // this.rutClienteBusca=res.data[0].rutCliente;
          if (
            res.data[0].empresa.empresa_Id ==
            this.localStorage?.usuarioLogin.empresaConectada.empresa_Id
          ) {
            this.agregaCliente().get('rutCliente')!.setValue('');
            Swal.fire('El Cliente ya Existe en la lista', '', 'error'); // ,
          } else {
            Swal.fire({
              title: `El Cliente existe en los registros, <br> << Lo Desea Incorporar >>?`,
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: 'Incorporar',
              denyButtonText: ``,
              cancelButtonText: `Cancelar`,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                this.enviarExiste();

                //  this.dialogRef.close(1);
              } else {
                //  Swal.fire('Changes are not saved', '', 'info')
                this.agregaCliente().get('rutCliente')!.setValue('');
              }
            });
          }
        }
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }

  getDataMenu() {
    this.menuService.getDataMenuNombre('Cliente').subscribe({
      next: (res) => {
        console.log('res menu cliente:', res);
        console.log(' res.data.nombreMenu:', res.data.nombreMenu);
        console.log(' res.data.menu_Id:', res.data.menu_Id);
        console.log(' res.data[0].nombreMenu:', res.data[0].nombreMenu);
        console.log(' res.data[0].menu_Id:', res.data[0]._id);
        this.tipoEmpresa = res.data[0].nombreMenu;
        this.menu_Id = res.data[0]._id;
      },
      // console.log('yo:', res as PerfilI[]),
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }

  enviarExiste() {
    this.clienteEmpresa_ = {
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      //   fechaHora_modifica: '1990-01-01', esta se graba por default
      usuarioModifica_id: this.localStorage?.usuarioLogin._id,
      menu_Id: this.menu_Id,
    };
    this.clienteEmpresaRescata.push(this.clienteEmpresa_);

    this.datoCliente = {
      _id: this.datoClienteRescata!._id, //this._idBusca,
      rutCliente: this.datoClienteRescata!.rutCliente, // this.rutClienteBusca,
      razonSocial: this.datoClienteRescata!.razonSocial,
      nombreFantasia: this.datoClienteRescata!.nombreFantasia,
      direccion: this.datoClienteRescata!.direccion,
      telefono: this.datoClienteRescata!.telefono,
      email: this.datoClienteRescata!.email,
      nombreContacto: this.datoClienteRescata!.nombreContacto,
      //  envioEmail:this.datoEnviaCorreo,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      nombreLogo: this.datoClienteRescata!.nombreLogo,
      empresa: this.clienteEmpresaRescata,
      emailRecepcionExamenCliente:
        this.datoClienteRescata!.emailRecepcionExamenCliente,
      //tipoEmpresa: this.datoClienteRescata!.tipoEmpresa
    };
    console.log('agrega 1:', this.datoCliente);

    this.servCliente.putDataCliente(this.datoCliente).subscribe({
      next: (dato) => {
        console.log('respuesta:', dato);
        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', '', 'success'),
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
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }

  enviar() {
    /*
    this.datoEnviaCorreo={
      //emailEnvio: this.agregaCliente.get('emailEnvio')!.value,
      //password: this.agregaCliente.get('password')!.value,
    //  nombreDesde: this.agregaCliente.get('nombreDesde')!.value,
   ///   asunto: this.agregaCliente.get('asunto')!.value,
   ///   tituloCuerpo: this.agregaCliente.get('tituloCuerpo')!.value,
   ///   tituloCuerpoMedio: '', //this.agregaCliente.get('tituloCuerpoMedio')!.value,
   ///   tituloCuerpoPie: '' //this.agregaCliente.get('tituloCuerpoPie')!.value
    }
*/
    this.spinnerService.mostrar();
    this.clienteEmpresa = [
      {
        empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
        usuarioModifica_id: this.localStorage?.usuarioLogin._id,
        menu_Id: this.menu_Id,
      },
    ];

    this.datoCliente = {
      rutCliente: this.agregaCliente().get('rutCliente')!.value.toUpperCase(),
      razonSocial: this.agregaCliente().get('razonSocial')!.value,
      nombreFantasia: this.agregaCliente().get('nombreFantasia')!.value,
      direccion: this.agregaCliente().get('direccion')!.value,
      telefono: this.agregaCliente().get('telefono')!.value,
      nombreContacto: this.agregaCliente().get('nombreContacto')!.value,
      email: this.agregaCliente().get('email')!.value,
      //envioEmail: this.datoEnviaCorreo,

      empresa: this.clienteEmpresa,
      tipoEmpresa: this.tipoEmpresa,
      emailRecepcionExamenCliente: this.agregaCliente().get(
        'emailRecepcionExamenCliente'
      )!.value,
      nombreLogo: 'sinLogo.png',
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };
    console.log('agrega 1:', this.datoCliente);
    this.servCliente.postDataCliente(this.datoCliente).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        console.log('respuesta:', dato.codigo);
        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', '', 'success'); // ,
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
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }
}
