import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { environment } from '@envs/environment';
import { first } from 'rxjs';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadoService } from '@shared/estado.service';
import { AutenticaService } from '@autentica/servicios/autentica.service';
import { loginInterface } from '@autentica/interface/loginInterface';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
];

@Component({
  selector: 'app-login',
  imports: [MATERIAL_MODELO, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  form!: FormGroup;
  submitted = false;
  private returnUrl = environment.urlFront;
  validaCuenta = signal(false);
  mensaje = signal('');
  // currentUsuario!: JwtResponseI;
  private url: string = '';

  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private _autenticaService = inject(AutenticaService);
  private estadoService = inject(EstadoService);

  usuario = new FormControl('', [Validators.required]);
  contrasena = new FormControl('', [Validators.required]);

  loginForm: FormGroup = new FormGroup({
    usuario: this.usuario,
    contrasena: this.contrasena,
  });

  getErrorMessage(campo: string) {
    if (campo === 'usuario') {
      return this.usuario.hasError('required') ? 'Usuario es requerido' : '';
    }
    if (campo === 'contrasena') {
      return this.contrasena.hasError('required')
        ? 'Contraseña es requerido'
        : '';
    }

    return '';
  }

  async ngOnInit() {
    console.log('jjjj:', this.estadoService.getSesion()?.usuarioLogin);
    if (this.estadoService.getSesion()?.usuarioLogin) {
      if (
        this.estadoService.getSesion()?.usuarioLogin.empresaConectada
          .tipoEmpresa == 'Laboratorio'
      ) {
        this.url = '/laboratorio/portada';
      } else {
        this.url = '/veterinaria/portada';
      }
      this.router.navigateByUrl(this.url);
    }
  }
  //async ngOnInit() {
  //    await this._autenticaService.logout();

  // get return url from route parameters or default to '/'
  //    this.returnUrl = environment.urlFront|| '/'//;this.route.snapshot.queryParams['returnUrl'] || '/home';
  //}

  // convenience getter for easy access to form fields
  //get f() { return this.loginForm.controls; }

  enviar() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) return;

    console.log('login: ', this.returnUrl);

    this.loginForm
      .get('usuario')!
      .setValue(this.loginForm.get('usuario')!.value.toUpperCase());

    console.log('paso1 Login');

    this._autenticaService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: (data: loginInterface) => {
          console.log('data:', data);
          console.log('tipo:', data.usuarioLogin.empresaConectada.tipoEmpresa);
          console.log('url Login', this.returnUrl);
          if (data.usuarioLogin.empresaConectada.tipoEmpresa == 'Laboratorio') {
            this.url = '/laboratorio/portada';
          } else {
            this.url = '/veterinaria/portada';
          }
          this.router.navigateByUrl(this.url);
          location.reload();
        },
        error: (error: any) => {
          console.log('error Login:', error);
          this.loginForm.reset();

          if (error.status === 409) {
            this.validaCuenta.set(true);

            this.mensaje.set(error.error.message);
            /*  this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
              duration: this.durationInSeconds * 1000,
            });
            */
            //                  this.alertService.error(error);
          }
        },
      });
  }

  restContrasena() {
    Swal.fire({
      title: 'Ingrese Usuario',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: (login: any) => {
        console.log('usuario:', login);
        console.log('environment.urlFront:', environment.urlFront);
        return fetch(
          `${environment.apiUrl}/resetContrasena/${login}/${environment.urlFront}`
        )
          .then((response) => {
            console.log('response:', response);
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      console.log('result confirm:', result);
      if (result.isConfirmed) {
        if (result.value.codigo === 200) {
          Swal.fire({
            html: "<img src='./assets/imagenes/email.jpg' style='width:150px;'>",
            title: `Se envió contraseña al Email:${result.value.data}`,
            // imageUrl: result.value.avatar_url
          });
        } else {
          Swal.fire(
            'Usuario no encontrado',
            '',
            'error'
            // imageUrl: result.value.avatar_url
          );
        }
      }
    });
  }
}
