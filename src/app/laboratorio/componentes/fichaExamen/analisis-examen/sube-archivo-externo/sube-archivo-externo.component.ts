import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Inject,
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
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { loginInterface } from '@autentica/interface/loginInterface';
import { FichaService } from '@laboratorio/servicios/ficha.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
];

@Component({
  selector: 'app-sube-archivo-externo',
  templateUrl: './sube-archivo-externo.component.html',
  styleUrls: ['./sube-archivo-externo.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubeArchivoExternoComponent {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<SubeArchivoExternoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  private snackBar = inject(MatSnackBar);
  private fichaService = inject(FichaService);

  /*Imagen*/
  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  pdfBase64 = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  /*Fin Imagen*/
  constructor() {}

  flagArchivoPdf = new FormControl('', [Validators.required]);

  ingresoPdf = signal<FormGroup>(
    new FormGroup({
      flagArchivoPdf: this.flagArchivoPdf,
    })
  );

  async enviar() {
    if (this.pdfBase64() == '') {
      Swal.fire('EXAMEN EXTERNO', 'Debe ingresar un EXAMEN PDF', 'error');
      return;
    }

    console.log(
      'valores finales:',
      this.pdfBase64(),
      this.data._id,
      this.data.id_Ficha,
      this.data.numeroFicha + '.pdf',
      this.data.rutEmpresa.slice(0, -2),
      this.data.numeroFicha,
      this.data.empresa_Id,
      this.data.id_usuario
    );
    /*
    this.fichaService
      .subePdfExamenExterno(
        this.pdfBase64,
        this.data._id,
        this.data.id_Ficha,
        this.data.numeroFicha + '.pdf',
        this.data.rutEmpresa.slice(0, -2),
        this.data.numeroFicha,
        this.data.empresa_Id,
        this.data.id_usuario
      )

      .subscribe((dato) => {
        console.log('paso1:', dato);

        if (dato.codigo === 200) {
          Swal.fire('Se agregó con Éxito', '', 'success'); // ,
          this.dialogRef.close(1);
        } else {
          Swal.fire('', 'ERROR SISTEMA', 'error');
        }
      });
      */
  }

  onPdfSelecionadaDocumento(event: any) {
    console.log('event:', event);

    const file = event.target.files[0] as File | null;
    console.log('file:', file);
    if (file!.size > 500000) {
      Swal.fire('El tamaño de la imagen debe ser menor a 50mb', '', 'error');
      return;
    }
    this.uploadFile(file);
    //console.log('file:', file);
    ///this.imagen= file;
    ///this.archivo[0].base64textString=file.file;
    ///this.archivo[0].nombreArchivo='logo.'+file.src.split(';')[0].split('/')[1];
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFile(file);
  }

  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('application/pdf')) {
      console.log('muestra base64: ', file);

      this.selectedFile = file;
      this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

      const reader = new FileReader();
      reader.onload = (e) => {
        this.pdfBase64.set(e.target?.result as string); // Set image preview URL
      };
      reader.readAsDataURL(file);

      this.uploadSuccess = true;
      this.uploadError = false;
      this.imageName.set(file.name); // Set image name

      console.log('this.pdfBase64:', this.pdfBase64);

      this.ingresoPdf().get('flagArchivoPdf')!.clearValidators();
      this.ingresoPdf().get('flagArchivoPdf')!.updateValueAndValidity();
    } else {
      this.uploadSuccess = false;
      this.uploadError = true;
      this.snackBar.open('Sólo un exámen!', 'Cerrar', {
        duration: 3000,
        panelClass: 'error',
      });
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imageName.set('');
    this.fileSize.set(0);
    this.pdfBase64.set('');
    this.uploadSuccess = false;
    this.uploadError = false;
    this.uploadProgress.set(0);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  /*
  onUploadFinished(file: File) {
    console.log('paso1:', file);
    console.log('muestra base64: ', file);
    this.pdfBase64 = file;

    this.ingresoPdf().get('flagArchivoPdf')!.clearValidators();
    this.ingresoPdf().get('flagArchivoPdf')!.updateValueAndValidity();
  }

  onRemoved(file: File) {
    console.log('paso2: ', file);
    this.pdfBase64 = '';
    this.ingresoPdf()
      .get('flagArchivoPdf')!
      .setValidators([Validators.required]);
    this.ingresoPdf().get('flagArchivoPdf')!.updateValueAndValidity();
  }

  onUploadStateChanged(state: boolean) {
    console.log('paso3: ', state);
  }
*/
  comparaEstadoUsuario(v1: any, v2: any): boolean {
    return v1.toUpperCase() === v2.toUpperCase();
  }
}
