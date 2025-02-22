import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import Swal from 'sweetalert2';

import { IEmail, IEmpresa } from '@laboratorio/modelos/empresa-modelo';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
///import { UtilesService } from '@servicios/utiles.service';
import { IFichaCabecera } from '@laboratorio/interfaces/imprimeExamen-interface';
import { IArchivo } from '@laboratorio/interfaces/archivo-interface';
import { FichaService } from '@laboratorio/servicios/ficha.service';
import { StorageService } from '@shared/storage.service';
import { EmpresaService } from '@laboratorio/servicios/empresa.service';
import { loginInterface } from 'src/app/autentica/interface/loginInterface';

import { EditorModule } from 'primeng/editor';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '@shared/spinner/spinner.service';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatDialogModule,
];

@Component({
  selector: 'app-perfil-empresa',
  templateUrl: './perfil-empresa.component.html',
  styleUrls: ['./perfil-empresa.component.scss'],
  imports: [
    MATERIAL_MODELO,
    MatDialogModule,
    ReactiveFormsModule,
    EditorModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PerfilEmpresaComponent {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private snackBar = inject(MatSnackBar);
  private empresaService = inject(EmpresaService);

  datoEmpresa!: IEmpresa;
  envioEmail!: IEmail;

  public carga = signal(false);
  archivo: IArchivo[] = [
    {
      nombreArchivo: 'sinLogo.png',
      base64textString: '',
    },
    {
      nombreArchivo: 'sinLogo.png',
      base64textString: '',
    },
  ];

  imagen = '';
  imagenExamen = '';
  iFichaCabecera!: IFichaCabecera;
  imgFirma: any;
  imgLogo: any;
  uploading = false;
  selectedImages!: FileList;

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

  /*Imagen 2*/
  imageNameExamen = signal('');
  fileSizeExamen = signal(0);
  uploadProgressExamen = signal(0);
  imagePreviewExamen = signal('');
  @ViewChild('fileInputExamen') fileInputExamen: ElementRef | undefined;
  selectedFileExamen: File | null = null;
  uploadSuccessExamen: boolean = false;
  uploadErrorExamen: boolean = false;
  /*Fin Imagen 1*/

  constructor() {}
  /*
  constructor(
    private empresaService: EmpresaService,
    private utilesService:UtilesService,
    private fichaService: FichaService
   ) {
    this.authenticationService.currentUsuario.subscribe(x => this.currentUsuario = x);
    if (this.authenticationService.getCurrentUser() != null) {
          this.currentUsuario.usuarioDato = this.authenticationService.getCurrentUser() ;
    }
*/

  razonSocial = new FormControl('', [Validators.required]);
  nombreFantasia = new FormControl('', [Validators.required]);
  direccion = new FormControl('', [Validators.required]);
  nombreContacto = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  // tipoEmpresa = new FormControl('', [Validators.required]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  correoRecepcionSolicitud = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  //emailEnvio = new FormControl(this.datoEmpresa.envioEmail?.emailEnvio, [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]);
  //password = new FormControl(this.datoEmpresa.envioEmail?.password, [Validators.required]);
  //nombreDesde = new FormControl('', [Validators.required]);
  asunto = new FormControl('', [Validators.required]);
  tituloCuerpo = new FormControl('', [Validators.required]);
  //tituloCuerpoMedio = new FormControl('', [Validators.required]);
  //tituloCuerpoPie = new FormControl('', [Validators.required]);

  headerLeyenda = new FormControl('');
  footerExamen = new FormControl('');

  modificaEmpresa = signal<FormGroup>(
    new FormGroup({
      razonSocial: this.razonSocial,
      nombreFantasia: this.nombreFantasia,
      direccion: this.direccion,
      nombreContacto: this.nombreContacto,
      telefono: this.telefono,
      //   tipoEmprsa: this.tipoEmpresa,
      email: this.email,
      correoRecepcionSolicitud: this.correoRecepcionSolicitud,

      asunto: this.asunto,
      tituloCuerpo: this.tituloCuerpo,

      headerLeyenda: this.headerLeyenda,
      footerExamen: this.footerExamen,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'razonSocial') {
      return this.razonSocial.hasError('required')
        ? 'Debes ingresar Razon Social'
        : '';
    }
    if (campo === 'nombreFantasia') {
      return this.nombreFantasia.hasError('required')
        ? 'Debes ingresar Nombre Fantasía'
        : '';
    }
    if (campo === 'direccion') {
      return this.direccion.hasError('required')
        ? 'Debes ingresar Direccion'
        : '';
    }
    if (campo === 'nombreContacto') {
      return this.nombreContacto.hasError('required')
        ? 'Debes ingresar Nombre Contacto'
        : '';
    }
    if (campo === 'telefono') {
      return this.telefono.hasError('required')
        ? 'Debes ingresar telefono'
        : '';
    }
    if (campo === 'email') {
      return this.email.hasError('required') ? 'Debes ingresar Email' : '';
    }
    if (campo === 'correoRecepcionSolicitud') {
      return this.correoRecepcionSolicitud.hasError('required')
        ? 'Debes ingresar Recepción Email Solicitud'
        : '';
    }

    if (campo === 'asunto') {
      return this.asunto.hasError('required') ? 'Debes ingresar Asunto' : '';
    }

    return '';
  }

  async ngOnInit() {
    await this.getEmpresa();
    this.spinnerService.esconder();
    /*await this.utilesService.getBase64ImageFromUrl('./assets/imagenes/sinFirma.jpg').then(base64 => {
      this.imgFirma = base64;
    })
*/
  }

  getEmpresa() {
    console.log(
      'this.currentUsuario.usuarioDato.empresaConectada.empresa_Id:',
      this.localStorage?.usuarioLogin.empresaConectada.empresa_Id
    );
    this.empresaService
      .getDataEmpresa(
        this.localStorage!.usuarioLogin.empresaConectada.empresa_Id
      )
      .subscribe({
        next: (res) => {
          this.carga.set(true);
          this.datoEmpresa = res['data'][0] as IEmpresa;
          this.imagen =
            'https://storage.cloud.google.com/lavetonline/logo/' +
            this.datoEmpresa?.nombreLogo;
          this.imagenExamen =
            'https://storage.cloud.google.com/lavetonline/logo/' +
            this.datoEmpresa?.nombreLogoCabeceraExamen;

          console.log(
            'titulo cuerpo1111:',
            this.datoEmpresa.envioEmail?.tituloCuerpo
          );

          /*  console.log('logo:',this.datoEmpresa?.nombreLogo);
        if (this.datoEmpresa?.nombreLogo == undefined && this.datoEmpresa?.nombreLogo=='') {
          this.archivo[0].ruta= this.archivo[0].ruta+this.currentUsuario.usuarioDato.empresaConectada.rutEmpresa+'/'  // agregar a estructura data.nomreArchivo
          this.archivo[0].nombreArchivo
        }

        if (this.datoEmpresa?.nombreLogoCabeceraExamen == undefined || this.datoEmpresa?.nombreLogoCabeceraExamen=='') {
          this.imagenExamen=this.imagenExamen+'sinLogo.png';
       }else{
          this.imagenExamen=this.imagenExamen+ this.currentUsuario.usuarioDato.empresaConectada.rutEmpresa+'/'+this.datoEmpresa?.nombreLogoCabeceraExamen  // agregar a estructura data.nomreArchivo
       }
*/
          this.modificaEmpresa()
            .get('razonSocial')!
            .setValue(this.datoEmpresa.razonSocial);
          this.modificaEmpresa()
            .get('nombreFantasia')!
            .setValue(this.datoEmpresa.nombreFantasia);
          this.modificaEmpresa()
            .get('direccion')!
            .setValue(this.datoEmpresa.direccion);
          this.modificaEmpresa()
            .get('nombreContacto')!
            .setValue(this.datoEmpresa.nombreContacto);
          this.modificaEmpresa()
            .get('telefono')!
            .setValue(this.datoEmpresa.telefono);
          this.modificaEmpresa().get('email')!.setValue(this.datoEmpresa.email);
          this.modificaEmpresa()
            .get('correoRecepcionSolicitud')!
            .setValue(this.datoEmpresa.correoRecepcionSolicitud);
          this.modificaEmpresa()
            .get('asunto')!
            .setValue(this.datoEmpresa.envioEmail?.asunto);
          this.modificaEmpresa()
            .get('tituloCuerpo')!
            .setValue(this.datoEmpresa.envioEmail?.tituloCuerpo);
          this.modificaEmpresa()
            .get('headerLeyenda')!
            .setValue(this.datoEmpresa.headerLeyenda);
          this.modificaEmpresa()
            .get('footerExamen')!
            .setValue(this.datoEmpresa.footerExamen);
        },

        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  enviar() {
    this.spinnerService.mostrar();
    console.log('archivo:', this.archivo[0].base64textString);
    console.log('modificaEmpresa', this.modificaEmpresa());
    console.log(
      'tituloCuerpo',
      this.modificaEmpresa().get('tituloCuerpo')!.value
    );
    // console.log('nombre logo empresa:',this.datoEmpresa?.nombreLogo);

    this.envioEmail = {
      asunto: this.modificaEmpresa().get('asunto')!.value,
      tituloCuerpo: this.modificaEmpresa().get('tituloCuerpo')!.value,
    };

    this.datoEmpresa = {
      _id: this.datoEmpresa._id,
      rutEmpresa: this.datoEmpresa.rutEmpresa.toUpperCase(),
      razonSocial: this.modificaEmpresa().get('razonSocial')!.value,
      nombreFantasia: this.modificaEmpresa().get('nombreFantasia')!.value,
      direccion: this.modificaEmpresa().get('direccion')!.value,
      nombreContacto: this.modificaEmpresa().get('nombreContacto')!.value,
      telefono: this.modificaEmpresa().get('telefono')!.value,
      tipoEmpresa: this.datoEmpresa.tipoEmpresa,
      menu_Id: this.datoEmpresa.menu_Id,
      email: this.modificaEmpresa().get('email')!.value,
      correoRecepcionSolicitud: this.modificaEmpresa().get(
        'correoRecepcionSolicitud'
      )!.value,
      envioEmail: this.envioEmail,

      nombreLogo: this.datoEmpresa.nombreLogo, //this.archivo[0].ruta+this.archivo[0].nombreArchivo,
      headerLeyenda: this.modificaEmpresa().get('headerLeyenda')!.value,
      footerExamen: this.modificaEmpresa().get('footerExamen')!.value,
      nombreLogoCabeceraExamen: this.datoEmpresa.nombreLogoCabeceraExamen, //this.archivo[1].ruta+this.archivo[1].nombreArchivo,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };
    console.log('datos a grabar:', this.datoEmpresa);
    this.empresaService.putDataEmpresa(this.datoEmpresa).subscribe({
      next: (dato) => {
        console.log('respuesta:', dato);
        console.log('respuesta:', dato.mensaje);
        if (dato.codigo === 200) {
          this.spinnerService.esconder();
          /*
          this.empresaService
            .postDataEmpresaArchivo(
              this.archivo,
              this.datoEmpresa._id!,
              this.datoEmpresa.rutEmpresa.toUpperCase()
            )
            .subscribe({
              next: (dato) => {
                if (dato.codigo === 200) {
                  this.getEmpresa();
                  Swal.fire('Se grabó con Éxito', '', 'success');
                }
              },
              error: (error) => {
                console.log('error carga:', error);
                Swal.fire('ERROR INESPERADO', error, 'error');
              },
            });
          */
          // this.dialogRef.close(1);
        } else {
          this.spinnerService.esconder();
          if (dato.codigo != 500) {
            Swal.fire(dato.mensaje, '', 'error');
          } else {
            console.log('Error Examen:', dato);
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
    //}
  }
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

      this.archivo[0].base64textString = this.imagePreview();
      this.archivo[0].nombreArchivo =
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

    this.archivo[0].nombreArchivo = 'sinLogo.png';
    this.archivo[0].base64textString = '';
  }
  /*FIN IMAGEN 1*/
  /*
  onUploadFinished(file: FileHolder) {
    this.imagen= file.src;
    this.archivo[0].base64textString=file.file;
    this.archivo[0].nombreArchivo='logo.'+file.src.split(';')[0].split('/')[1];
  }

  onRemoved(file: FileHolder) {
    console.log('paso2: ', file);
    this.imagen= '';
    this.archivo[0].nombreArchivo= 'sinLogo.png';
    this.archivo[0].base64textString= '';
  }

  onUploadStateChanged(state: boolean) {
    console.log('paso3: ', state);
  }

*/
  /*INICIO IMAGEN 2*/
  onImagenSelecionadaExamen(event: any) {
    const file = event.target.files[0] as File | null;
    if (file!.size > 50000) {
      Swal.fire('El tamaño de la imagen debe ser menor a 50kb', '', 'error');
      return;
    }
    this.uploadFileExamen(file);
    /*
    this.imagenExamen= file.src;
    this.archivo[1].base64textString=file.file;
    this.archivo[1].nombreArchivo='logoCabeceraExamen.'+file.src.split(';')[0].split('/')[1];
    */
  }

  onFileDropExamen(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFileExamen(file);
  }

  uploadFileExamen(file: File | null): void {
    console.log('file examen:', file?.type.split(';')[0].split('/')[1]);
    if (file && file.type.startsWith('image/')) {
      this.selectedFileExamen = file;
      this.fileSizeExamen.set(Math.round(file.size / 1024)); // Set file size in KB

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewExamen.set(e.target?.result as string); // Set image preview URL
      };
      reader.readAsDataURL(file);

      this.uploadSuccessExamen = true;
      this.uploadErrorExamen = false;
      this.imageNameExamen.set(file.name); // Set image name
      this.archivo[1].base64textString = this.imagePreviewExamen();
      this.archivo[1].nombreArchivo =
        'logoCabeceraExamen.' + file?.type.split(';')[0].split('/')[1];
    } else {
      this.uploadSuccessExamen = false;
      this.uploadErrorExamen = true;
      this.snackBar.open('Sólo una imagen!', 'Cerrar', {
        duration: 3000,
        panelClass: 'error',
      });
    }
  }

  onDragOverExamen(event: DragEvent): void {
    event.preventDefault();
  }

  // Method to remove the uploaded image
  removeImageExamen(): void {
    this.selectedFileExamen = null;
    this.imageNameExamen.set('');
    this.fileSizeExamen.set(0);
    this.imagePreviewExamen.set('');
    this.uploadSuccessExamen = false;
    this.uploadErrorExamen = false;
    this.uploadProgressExamen.set(0);

    this.archivo[0].nombreArchivo = 'sinLogo.png';
    this.archivo[0].base64textString = '';
  }
  /*FIN IMAGEN 2*/
  /*
  onRemovedExamen(file: FileHolder) {
    console.log('paso2: ', file);
    this.imagenExamen= '';

    this.archivo[1].nombreArchivo= 'sinLogo.png';
    this.archivo[1].base64textString= '';
  }

  onUploadStateChangedExamen(state: boolean) {
    console.log('paso3: ', state);
  }
*/
  async visualizaFormato() {}

  ///  async visualizaFormato() {
  /*  let imgFirma!:any;
    await this.utilesService.getBase64ImageFromUrl('./assets/imagenes/sinFirma.jpg').then(base64 => {
      imgFirma = base64;
    })
*/
  /*///    this.fichaService
      .postDownLoadImagen(this.datoEmpresa?.nombreLogoCabeceraExamen)
      .subscribe({
        next: (res) => {
          this.utilesService.getBase64ImageDeBlob(res).then((base64) => {
            this.imgLogo = base64;
            this.visualizaFormatoFirma();
          });
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }
*/
  ///  async visualizaFormatoFirma() {
  /*
    await this.utilesService.getBase64ImageFromUrl('./assets/imagenes/sinFirma.jpg').then(base64 => {
      this.imgFirma = base64;
    })
*/
  /*///    this.fichaService.postDownLoadImagenFirma('sinFirma.jpg').subscribe({
      next: (res) => {
        this.utilesService.getBase64ImageDeBlob(res).then((base64) => {
          this.imgFirma = base64;
          this.muestra();
        });
      },
      // console.log('yo:', res as PerfilI[]),
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }
*/
  /*///  async muestra() {
    this.iFichaCabecera = {
      rutaNombreLogo: this.imgLogo,
      nombreExamen: 'XXXXXXXXXXXXXXX',
      tituloExamen: 'XXXXXXXXXXXXXXXXXXXXXX',
      id_Ficha: 'XXX99',
      nombrePropietario: 'XXXXXXXXXXXXXXXXXXX',
      fechaHora_recepcionado_crea: new Date(),
      nombrePaciente: 'XXXXXXXXXXXXXXXX',
      especieNombre: 'XXXXXXXXXX',
      razaNombre: 'XXXXXXXXXX',
      edadPaciente: '99 XXXX',
      sexo: 'XXXXXXXXX',
      numeroFicha: 'XXXXX-1',
      clienteNombreFantasia: 'XXXXXXXXXXXX XXXXX',
      nombreDoctorSolicitante: 'XXXXXXXXXXX',
      rutaFirmaValidador: this.imgFirma!,
      nombreValidador: 'XXXXXX XXXXXXXX',
      profesionValidador: 'XXXXXXXXXXX',
      headerLeyenda: this.datoEmpresa.headerLeyenda!,
      footerExamen: this.datoEmpresa.footerExamen!,
    };
    //datosResultadoExamen=await this.utilesService.datoResultadoExamen(datoFicha.formatoResultado,datoFicha.fichaC.examen.codigoInterno);

    this.utilesService.generaPdf(this.iFichaCabecera, '', 99999, 'ABRE');
  }
  */
}
