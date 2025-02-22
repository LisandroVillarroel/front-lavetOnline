import { MatIconModule } from '@angular/material/icon';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loginInterface } from '@autentica/interface/loginInterface';

import { formatRut, RutFormat, validateRut } from '@fdograph/rut-utilities';
import { IArchivo } from '@laboratorio/interfaces/archivo-interface';
import { IValidador } from '@laboratorio/modelos/validador-modelo';
import { ValidadorService } from '@laboratorio/servicios/validador.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
];

@Component({
    selector: 'app-agrega-validadores',
    templateUrl: './agrega-validadores.component.html',
    styleUrls: ['./agrega-validadores.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgregaValidadoresComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaValidadoresComponent>);
  private snackBar = inject(MatSnackBar);

  private validadorService = inject(ValidadorService);

  private datoEnviaValidador!: IValidador;

  archivo: IArchivo = {
    nombreArchivo: '',
    base64textString: '',
  };

  /*Imagen*/
  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  /*Fin Imagen*/

  constructor() {}

  rutValidador = new FormControl('', [Validators.required, this.validaRut]);
  nombres = new FormControl('', [Validators.required]);
  apellidoPaterno = new FormControl('', [Validators.required]);
  apellidoMaterno = new FormControl('', [Validators.required]);
  profesion = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);

  agregaValidador = signal<FormGroup>(
    new FormGroup({
      rutValidador: this.rutValidador,
      nombres: this.nombres,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      telefono: this.telefono,
      profesion: this.profesion,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'rutValidador') {
      return this.rutValidador.hasError('required')
        ? 'Debes ingresar Rut'
        : this.rutValidador.hasError('rutInvalido')
        ? 'Rut Inválido'
        : '';
    }
    if (campo === 'nombres') {
      return this.nombres.hasError('required') ? 'Debes ingresar Nombres' : '';
    }
    if (campo === 'apellidoPaterno') {
      return this.apellidoPaterno.hasError('required')
        ? 'Debes ingresar Apellido Paterno'
        : '';
    }
    if (campo === 'apellidoMaterno') {
      return this.apellidoMaterno.hasError('required')
        ? 'Debes ingresar Apellido Materno'
        : '';
    }
    if (campo === 'telefono') {
      return this.telefono.hasError('required')
        ? 'Debes ingresar telefono'
        : '';
    }
    if (campo === 'profesion') {
      return this.profesion.hasError('required')
        ? 'Debes ingresar Profesión'
        : '';
    }
    return '';
  }

  ngOnInit() {}

  async enviar() {
    let nombreFirma;
    if (this.archivo.nombreArchivo == '') {
      nombreFirma = 'sinFirma.jpg';
    } else {
      nombreFirma = this.archivo.nombreArchivo;
    }

    this.datoEnviaValidador = {
      rutValidador: this.agregaValidador()
        .get('rutValidador')!
        .value.toUpperCase(),
      nombres: this.agregaValidador().get('nombres')!.value,
      apellidoPaterno: this.agregaValidador().get('apellidoPaterno')!.value,
      apellidoMaterno: this.agregaValidador().get('apellidoMaterno')!.value,
      telefono: this.agregaValidador().get('telefono')!.value,
      profesion: this.agregaValidador().get('profesion')!.value,
      nombreFirma: nombreFirma,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    this.validadorService
      .postDataValidador(this.datoEnviaValidador)
      .subscribe((dato) => {
        console.log('paso1:', dato);

        if (dato.codigo === 200) {
          console.log('paso2:', dato);
          this.agregaFirmaValidador();
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Usuario:', dato);
            Swal.fire('', 'ERROR SISTEMA', 'error');
          }
        }
      });
  }

  agregaFirmaValidador() {
    this.validadorService.postDataValidadorArchivo(this.archivo).subscribe({
      next: (dato) => {
        if (dato.codigo === 200) {
          Swal.fire('Se grabó con Éxito', '', 'success');
          this.dialogRef.close(1);
        }
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
    /*
    this.imagenesService.uploadFile(this.archivo)
    .subscribe({
      next: (datos) => {
        console.log('antes de grabar imagen:',datos);
        if(datos.resultado === 'OK') {
          Swal.fire(
            'Se agregó con Éxito',
            '',
            'success'
          ); // ,
          this.dialogRef.close(1);
        }
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire(
          'ERROR INESPERADO',
          error,
        'error'
      );
      }
  })
  */
  }

  validaRut(control: FormControl): { [s: string]: boolean } {
    // let out1_rut = this.rutService.getRutChile(0, '12514508-6');
    if (validateRut(control.value) === false) {
      return { rutInvalido: true };
    }
    return null as any;
  }

  onBlurRutUsuario(event: any) {
    const rut = event.target.value;

    if (validateRut(rut) === true) {
      this.agregaValidador()
        .get('rutValidador')!
        .setValue(formatRut(rut, RutFormat.DOTS_DASH));
    }
  }
  /*
  onUploadFinished(file: FileHolder) {
    this.archivo.base64textString = file.file;
    this.archivo.nombreArchivo =
      'firma_' +
      this.currentUsuario.usuarioDato.empresaConectada.rutEmpresa.toUpperCase() +
      '_' +
      this.agregaValidador.get('rutValidador')!.value.toUpperCase() +
      '.' +
      file.src.split(';')[0].split('/')[1];
  }

  onRemoved(file: FileHolder) {
    this.archivo.base64textString = '';
    this.archivo.nombreArchivo = '';
  }

  onUploadStateChanged(state: boolean) {
    console.log('paso3: ', state);
  }
*/
  /*INICIO IMAGEN*/
  onImagenSelecionadaLogo(event: any) {
    const file = event.target.files[0] as File | null;
    if (file!.size > 50000) {
      Swal.fire('El tamaño de la imagen debe ser menor a 50kb', '', 'error');
      return;
    }
    this.uploadFile(file);
    //console.log('file:', file);
    ///this.imagen= file;
    ///this.archivo[0].base64textString=file.file;
    ///this.archivo[0].nombreArchivo='logo.'+file.src.split(';')[0].split('/')[1];
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFile(file);
  }

  // Method to handle file upload
  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string); // Set image preview URL
      };
      reader.readAsDataURL(file);

      this.uploadSuccess = true;
      this.uploadError = false;
      this.imageName.set(file.name); // Set image name

      this.archivo.nombreArchivo =
        'firma_' +
        this.localStorage?.usuarioLogin.empresaConectada.rutEmpresa.toUpperCase() +
        '_' +
        this.agregaValidador().get('rutValidador')!.value.toUpperCase() +
        '.' +
        file?.type.split(';')[0].split('/')[1];

      this.archivo.base64textString = this.imagePreview();
      //this.archivo.nombreArchivo =
      //  'logo.' + file?.type.split(';')[0].split('/')[1];
    } else {
      this.uploadSuccess = false;
      this.uploadError = true;
      this.snackBar.open('Sólo una imagen!', 'Cerrar', {
        duration: 3000,
        panelClass: 'error',
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Method to remove the uploaded image
  removeImage(): void {
    this.selectedFile = null;
    this.imageName.set('');
    this.fileSize.set(0);
    this.imagePreview.set('');
    this.uploadSuccess = false;
    this.uploadError = false;
    this.uploadProgress.set(0);

    this.archivo.nombreArchivo = 'sinLogo.png';
    this.archivo.base64textString = '';
  }
  /*FIN IMAGEN 1*/
  comparaEstadoUsuario(v1: any, v2: any): boolean {
    return v1.toUpperCase() === v2.toUpperCase();
  }
}
