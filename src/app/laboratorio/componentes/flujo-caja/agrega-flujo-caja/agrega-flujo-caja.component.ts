import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import Swal from 'sweetalert2';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IArchivo } from '@laboratorio/interfaces/archivo-interface';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { FlujoCajaService } from '@laboratorio/servicios/flujoCaja.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatIconModule,
];

@Component({
  selector: 'app-agrega-flujo-caja',
  templateUrl: './agrega-flujo-caja.component.html',
  styleUrls: ['./agrega-flujo-caja.component.css'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaFlujoCajaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialogRef = inject(MatDialogRef<AgregaFlujoCajaComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);

  private flujoCajaService = inject(FlujoCajaService);

  archivo: IArchivo = {
    nombreArchivo: '',
    base64textString: '',
  };

  /*Imagen */
  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  /*Fin Imagen */

  constructor() {}

  cuenta = new FormControl('', [Validators.required]);
  montoFijo = new FormControl('', [Validators.required]);
  tipoCuenta = new FormControl('', [Validators.required]);
  fechaTransaccion = new FormControl('', [Validators.required]);
  metodoPago = new FormControl('', [Validators.required]);
  monto = new FormControl('', [Validators.required]);
  comprobante = new FormControl('', [Validators.required]);

  agregaFlujoCaja = signal<FormGroup>(
    new FormGroup({
      cuenta: this.cuenta,
      montoFijo: this.montoFijo,
      tipoCuenta: this.tipoCuenta,
      fechaTransaccion: this.fechaTransaccion,
      metodoPago: this.metodoPago,
      monto: this.monto,
      comprobante: this.comprobante,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'cuenta') {
      return this.cuenta.hasError('required') ? 'Debes ingresar Cuenta' : '';
    }
    if (campo === 'montoFijo') {
      return this.montoFijo.hasError('required')
        ? 'Debes ingresar Monto Fijo'
        : '';
    }
    if (campo === 'tipoCuenta') {
      return this.tipoCuenta.hasError('required')
        ? 'Debes ingresar Tipo Cuenta'
        : '';
    }

    if (campo === 'fechaTransaccion') {
      return this.fechaTransaccion.hasError('required')
        ? 'Debes ingresar Fecha Transacción'
        : '';
    }
    if (campo === 'metodoPago') {
      return this.metodoPago.hasError('required')
        ? 'Debes ingresar Metodo Pago'
        : '';
    }
    if (campo === 'monto') {
      return this.monto.hasError('required') ? 'Debes ingresar Monto' : '';
    }
    if (campo === 'comprobante') {
      return this.comprobante.hasError('required')
        ? 'Debes ingresar Comprobante'
        : '';
    }

    return '';
  }

  ngOnInit() {}

  enviar() {
    console.log('archivo comprobante Enviar:', this.archivo.nombreArchivo);
    let dato;
    dato = {
      fechaMes: this.data.fecha,
      cuenta: this.agregaFlujoCaja().get('cuenta')!.value,
      montoFijo: this.agregaFlujoCaja().get('montoFijo')!.value,
      tipoCuenta: this.agregaFlujoCaja().get('tipoCuenta')!.value,
      fechaTransaccion: this.agregaFlujoCaja().get('fechaTransaccion')!.value,
      metodoPago: this.agregaFlujoCaja().get('metodoPago')!.value,
      monto: this.agregaFlujoCaja().get('monto')!.value,
      extension: this.archivo.nombreArchivo,
      rutEmpresa: this.data.rutEmpresa,
      usuarioCrea_id: this.data.usuario,
      usuarioModifica_id: this.data.usuario,
      empresa_Id: this.data.empresa_Id,
    };
    console.log('agrega 1:', dato);
    this.flujoCajaService.postDataFlujoCaja(dato).subscribe((dato) => {
      console.log('respuesta:', dato);
      console.log('respuesta:', dato.mensaje);
      if (dato.codigo === 200) {
        Swal.fire('Se agregó con Éxito', 'Click en Boton!', 'success'); // ,
        this.dialogRef.close(1);
      } else {
        if (dato.codigo != 500) {
          Swal.fire(dato.mensaje, '', 'error');
        } else {
          console.log('Error EXAMEN:', dato);
          Swal.fire('', 'ERROR SISTEMA', 'error');
        }
      }
    });
  }
  /*
  onUploadFinished(file: FileHolder) {
    this.archivo.base64textString = file.file;
    this.archivo.nombreArchivo = file.src.split(';')[0].split('/')[1]; // Aca solo guarda la extensión para que el Back genere el nombre
    console.log('archivo comprobante:', this.archivo.nombreArchivo);
  }

  onRemoved(file: FileHolder) {
    this.archivo.base64textString = '';
    this.archivo.nombreArchivo = '';
  }

  onUploadStateChanged(state: boolean) {
    console.log('paso3: ', state);
  }
  */
  /*INICIO IMAGEN 1*/
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

      this.archivo.base64textString = this.imagePreview();
      this.archivo.nombreArchivo =
        'logo.' + file?.type.split(';')[0].split('/')[1];
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
}
