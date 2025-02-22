import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Inject,
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IArchivo } from '@laboratorio/interfaces/archivo-interface';
import { IValidador } from '@laboratorio/modelos/validador-modelo';
import { ValidadorService } from '@laboratorio/servicios/validador.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

//import { FileHolder } from 'angular2-image-upload';

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
];

@Component({
    selector: 'app-modifica-validadores',
    templateUrl: './modifica-validadores.component.html',
    styleUrls: ['./modifica-validadores.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModificaValidadoresComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaValidadoresComponent>);
  readonly data = inject<IValidador>(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);

  private validadorService = inject(ValidadorService);

  datoEnviaValidador!: IValidador;

  public imagen = 'https://storage.cloud.google.com/lavetonline/firma/';
  private archivo: IArchivo = {
    nombreArchivo: 'sinFirma.jpg',
    base64textString: '',
  };

  /*Imagen 1*/
  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  /*Fin Imagen 1*/

  constructor() {}

  nombres = new FormControl(this.data.nombres, [Validators.required]);
  apellidoPaterno = new FormControl(this.data.apellidoPaterno, [
    Validators.required,
  ]);
  apellidoMaterno = new FormControl(this.data.apellidoMaterno, [
    Validators.required,
  ]);
  profesion = new FormControl(this.data.profesion, [Validators.required]);
  telefono = new FormControl(this.data.telefono, [Validators.required]);

  modificaValidador = signal<FormGroup>(
    new FormGroup({
      nombres: this.nombres,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      profesion: this.profesion,
      telefono: this.telefono,
    })
  );

  getErrorMessage(campo: string) {
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
    if (campo === 'profesion') {
      return this.profesion.hasError('required')
        ? 'Debes ingresar Profesión'
        : '';
    }
    if (campo === 'telefono') {
      return this.telefono.hasError('required')
        ? 'Debes ingresar telefono'
        : '';
    }

    return '';
  }

  ngOnInit() {
    this.spinnerService.esconder();
    if (
      this.data.nombreFirma == 'sinFirma.jpg' ||
      this.data.nombreFirma == '' ||
      1 == 1
    ) {
      this.imageName.set(this.imagen + 'sinFirma.jpg'); // agregar a estructura data.nomreArchivo
    } else {
      this.imageName.set(this.imagen + this.data?.nombreFirma); // agregar a estructura data.nomreArchivo
    }
  }

  async enviar() {
    this.spinnerService.mostrar();
    let nombreFirma = this.data?.nombreFirma;

    if (this.archivo.nombreArchivo != '') {
      nombreFirma = this.archivo.nombreArchivo;
    }

    this.datoEnviaValidador = {
      _id: this.data._id,
      rutValidador: this.data.rutValidador.toUpperCase(),
      nombres: this.modificaValidador().get('nombres')!.value,
      apellidoPaterno: this.modificaValidador().get('apellidoPaterno')!.value,
      apellidoMaterno: this.modificaValidador().get('apellidoMaterno')!.value,
      profesion: this.modificaValidador().get('profesion')!.value,
      telefono: this.modificaValidador().get('telefono')!.value,
      nombreFirma: nombreFirma,
      empresa_Id: this.data.empresa_Id,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    this.validadorService.putDataValidador(this.datoEnviaValidador).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          if (this.archivo.nombreArchivo !== 'sinFirma.jpg') {
            console.log('archivo', this.archivo);
            this.agregaFirmaValidador();
          }
          Swal.fire('Se Actualizó con Éxito', '', 'success'); // ,
          this.dialogRef.close(1);
        } else {
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Usuario:', dato);
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
  }

  agregaFirmaValidador() {
    this.validadorService.postDataValidadorArchivo(this.archivo).subscribe({
      next: (dato) => {},
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }
  /*
  onUploadFinished(file: FileHolder) {
    this.imagen = file.src;
    this.archivo.base64textString = file.file;
    this.archivo.nombreArchivo =
      'firma_' +
      this.localStorage?.usuarioLogin.empresaConectada.rutEmpresa.toUpperCase() +
      '_' +
      this.data?.rutValidador.toUpperCase() +
      '.' +
      file.src.split(';')[0].split('/')[1];
  }

  onRemoved(file: FileHolder) {
    this.imagen = '';
    this.archivo.base64textString = '';
    this.archivo.nombreArchivo = 'sinFirma.jpg';
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
        this.data?.rutValidador.toUpperCase() +
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
  /*FIN IMAGEN*/
}
