/*** Este modulo permite ingresar la cabecera y los examenes que se solicitaron. Esta es tructura es parametrica */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { formatRut, RutFormat, validateRut } from '@fdograph/rut-utilities';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { EmpresaService } from '@laboratorio/servicios/empresa.service';
import { ExamenService } from '@laboratorio/servicios/examen.service';
import { ValidadorService } from '@laboratorio/servicios/validador.service';
import { UsuarioService } from '@servicios/usuario.service';
import { PropietarioService } from '@laboratorio/servicios/propietario.service';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
import { EspecieService } from '@laboratorio/servicios/especie.service';
import { RazaService } from '@laboratorio/servicios/raza.service';
import { DoctorSolicitanteService } from '@laboratorio/servicios/doctor-solicitante.service';
import { FichaService } from '@laboratorio/servicios/ficha.service';
import {
  IExamenHijo,
  IFicha,
  IFichaCliente,
  IFichaDoctorSolicitante,
  IFichaEspecie,
  IFichaExamen,
  IFichaRaza,
  IFichaUsuarioAsignado,
  IFichaValidador,
  IIngresadoPor,
} from '@laboratorio/modelos/ficha-modelo';
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { IValidador } from '@laboratorio/modelos/validador-modelo';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import {
  IFichaDetalleEnviaExamen,
  IFichaMuestraExamen,
} from '@laboratorio/interfaces/fichaMuestra-interface';
import { IDoctorSolicitante } from '@laboratorio/modelos/doctorSolicitante-modelo';
import { IPacienteIngresoFicha } from '@laboratorio/interfaces/paciente-interface';
import { IClienteIngresoFicha } from '@laboratorio/interfaces/cliente-interface';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { IRaza } from '@laboratorio/modelos/raza-modelo';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { IUsuario } from '@modelos/usuario-modelo';
import { CategoriaExamenService } from '@laboratorio/servicios/categoriaExamen.service';
import { ICategoriaExamenInterface } from '@laboratorio/interfaces/categoriaExamen-interface';
import { MatCheckboxModule } from '@angular/material/checkbox';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDividerModule,
  MatCheckboxModule,
  MatAutocompleteModule,
];

@Component({
  selector: 'app-agrega-ficha',
  templateUrl: './agrega-ficha.component.html',
  styleUrls: ['./agrega-ficha.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaFichaComponent implements OnInit {
  private readonly _storage = inject(StorageService);
  private readonly localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaFichaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  private readonly empresaService = inject(EmpresaService);
  private readonly examenService = inject(ExamenService);
  private readonly categoriaExamenService = inject(CategoriaExamenService);
  private readonly validadorService = inject(ValidadorService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly propietarioService = inject(PropietarioService);
  private readonly clienteService = inject(ClienteService);
  private readonly especieService = inject(EspecieService);
  private readonly razaService = inject(RazaService);
  private readonly doctorSolicitanteService = inject(DoctorSolicitanteService);
  private readonly fichaService = inject(FichaService);

  cliente!: IFichaCliente;
  examen!: IFichaExamen;

  especie!: IFichaEspecie;
  raza!: IFichaRaza;
  doctorSolicitante!: IFichaDoctorSolicitante;
  usuarioAsignado!: IFichaUsuarioAsignado;

  validadorAsignado!: IFichaValidador;
  validador!: IValidador;

  public datoCategoriaExamenInterface = signal<ICategoriaExamenInterface[]>([]);
  private datoExamen!: IExamen[];

  datoCategoriaHormona = signal<IExamen[]>([]);

  datoUsuario = signal<IUsuario[]>([]);

  datoCliente = signal<ICliente[]>([]);

  datoValidador = signal<IValidador[]>([]);

  datoDoctorSolicitante = signal<IDoctorSolicitante[]>([]);

  datoPaciente!: IPacienteIngresoFicha[];
  IClienteIngresoFicha!: IClienteIngresoFicha;

  datoEspecie = signal<IEspecie[]>([]);
  datoRaza = signal<IRaza[]>([]);

  IIngresadoPor!: IIngresadoPor;

  rescatadoEspecie!: IEspecie;
  rescatadoRaza!: IRaza;

  filtrarOpcionCliente!: Observable<ICliente[]>;
  filtrarOpcionPaciente!: Observable<IPacienteIngresoFicha[]>;

  arregloExamenMuestraFicha = signal<IFichaMuestraExamen[]>([]);

  datoFicha!: IFicha;
  datoFichaDetalleEnviaExamen: IFichaDetalleEnviaExamen[] = [];
  datoExamenHijo: IExamenHijo[] = [];
  fechaActual: Date = new Date();

  datoSexo = signal([
    { nombre: 'Hembra', id: 'Hembra' },
    { nombre: 'Macho', id: 'Macho' },
  ]);

  verExamenes = signal<boolean>(false);
  cuentaChk: number = 0;
  numeroFichaCorrelativo: number = 0;
  precioFinalPadre = 0;

  datoEmpresa_ = {
    empresa_Id: '',
    rutEmpresa: '',
    razonSocial: '',
    nombreFantasia: '',
    nombreLogo: 'sinLogo.png',
    nombreLogoCabeceraExamen: 'sinLogo.png',
    headerLeyenda: '',
    footerExamen: '',
  };

  tituloBoton = '';
  estadoFicha_ = '';

  id_EmpresaLaboratorio = '';

  usuario: string = this.data.usuario;

  constructor() {}

  idCliente = new FormControl('', [Validators.required]);
  rutPropietario = new FormControl('');
  nombrePropietario = new FormControl('');
  nombrePaciente = new FormControl('', [Validators.required]);
  idEspecie = new FormControl('', [Validators.required]);
  idRaza = new FormControl('', [Validators.required]);
  edad = new FormControl('', [Validators.required]);
  sexo = new FormControl('', [Validators.required]);
  idDoctorSolicitante = new FormControl('', [Validators.required]);
  correoClienteFinal = new FormControl('', [
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);

  flagExamen = new FormControl('', [Validators.required]);
  agregaFicha = signal<FormGroup>(
    new FormGroup({
      idCliente: this.idCliente,
      rutPropietario: this.rutPropietario,
      nombrePropietario: this.nombrePropietario,
      nombrePaciente: this.nombrePaciente,
      idEspecie: this.idEspecie,
      idRaza: this.idRaza,
      edad: this.edad,
      sexo: this.sexo,
      idDoctorSolicitante: this.idDoctorSolicitante,
      correoClienteFinal: this.correoClienteFinal,

      flagExamen: this.flagExamen,
    })
  );

  /** control for filter for server side. */

  getErrorMessage(campo: string) {
    if (campo === 'idCliente') {
      return this.idCliente.hasError('required')
        ? 'Debes Seleccionar Cliente'
        : '';
    }

    /*  if (campo === 'nombrePropietario'){
        return this.nombrePropietario.hasError('required') ? 'Debes ingresar Nombre Propietario' : '';
      }*/
    if (campo === 'nombrePaciente') {
      return this.nombrePaciente.hasError('required')
        ? 'Debes ingresar Nombre Paciente'
        : '';
    }
    if (campo === 'idEspecie') {
      return this.idEspecie.hasError('required')
        ? 'Debes Seleccionar Especie'
        : '';
    }
    if (campo === 'idRaza') {
      return this.idRaza.hasError('required') ? 'Debes Seleccionar Raza' : '';
    }
    if (campo === 'edad') {
      return this.edad.hasError('required') ? 'Debes Ingresar Edad' : '';
    }
    if (campo === 'sexo') {
      return this.sexo.hasError('required') ? 'Debes Seleccionar Sexo' : '';
    }
    if (campo === 'idDoctorSolicitante') {
      return this.idDoctorSolicitante.hasError('required')
        ? 'Debes Ingresar Dr. Solicitante'
        : '';
    }
    return '';
  }

  validaRut(control: FormControl): { [s: string]: boolean } {
    // let out1_rut = this.rutService.getRutChile(0, '12514508-6');
    if (validateRut(control.value) === false) {
      return { rutInvalido: true };
    }
    return null as any;
  }
  /*SON PARTE DEL MAT-AUTOCOMPLETE*/
  private _filterCliente(valor: string): ICliente[] {
    return this.datoCliente().filter(
      (cliente) => cliente.nombreFantasia!.toLowerCase().indexOf(valor) > -1
    );
  }

  private _filterPaciente(valor: string): IPacienteIngresoFicha[] {
    return this.datoPaciente.filter(
      (paciente) => paciente.nombre!.toLowerCase().indexOf(valor) > -1
    );
  }
  /*FIN SON PARTE DEL MAT-AUTOCOMPLETE*/

  async ngOnInit() {
    this.estadoFicha_ = 'Ingresado';
    this.tituloBoton = 'Grabar';
    this.cargaCliente(this.data.datoIngreso.empresa_Id);

    this.data.datoIngreso.empresa_Id;
    await this.cargaExamen(this.data.datoIngreso.empresa_Id);
    this.cargaUsuarioLaboratorio(this.data.datoIngreso.empresa_Id);
    this.cargaEspecie(this.data.datoIngreso.empresa_Id);
    this.cargaValidador(this.data.datoIngreso.empresa_Id);
    this.id_EmpresaLaboratorio = this.data.datoIngreso.empresa_Id;

    await this.getEmpresa(this.data.datoIngreso.empresa_Id);
  }

  //CARGAS CABECERA*/
  getEmpresa(idLaboratorio: string) {
    //Busca si entra como Laboratorio
    this.empresaService.getDataEmpresa(idLaboratorio).subscribe({
      next: (res) => {
        this.datoEmpresa_.nombreLogo = res.data[0]?.nombreLogo;
        this.datoEmpresa_.nombreLogoCabeceraExamen =
          res.data[0]?.nombreLogoCabeceraExamen;
        this.datoEmpresa_.rutEmpresa = res.data[0]?.rutEmpresa;
        this.datoEmpresa_.razonSocial = res.data[0]?.razonSocial;
        this.datoEmpresa_.nombreFantasia = res.data[0]?.nombreFantasia;
        this.datoEmpresa_.headerLeyenda = res.data[0]?.headerLeyenda;
        this.datoEmpresa_.footerExamen = res.data[0]?.footerExamen;
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO6', error, 'error');
      },
    });
  }

  cargaCliente(idLaboratorio: string) {
    this.clienteService.getDataCliente(idLaboratorio).subscribe({
      next: (res) => {
        this.datoCliente.set(res.data);
        //este es de matComplete
        this.filtrarOpcionCliente = this.idCliente.valueChanges.pipe(
          startWith(''),
          map((value) =>
            value ? this._filterCliente(value) : this.datoCliente().slice()
          )
        );
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO8', error, 'error');
      },
    });
  }

  cargaPaciente(runPropietario: string) {
    this.fichaService.getDataPaciente(runPropietario).subscribe({
      next: (res) => {
        this.datoPaciente = res.data;
        //este es de matComplete
        this.filtrarOpcionPaciente = this.nombrePaciente.valueChanges.pipe(
          startWith(''),
          map((valor) =>
            valor ? this._filterPaciente(valor) : this.datoPaciente.slice()
          )
        );
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO8', error, 'error');
      },
    });
  }

  cargaEspecie(idLaboratorio: string) {
    this.especieService.getDataEspecieTodo(idLaboratorio).subscribe({
      next: (res) => {
        this.datoEspecie.set(res.data);
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO11', error, 'error');
      },
    });
  }

  cargaClienteDoctorSolicitante(idCliente: any) {
    this.doctorSolicitanteService
      .getDataClienteDoctorSolicitante(idCliente)
      .subscribe({
        next: (res) => {
          this.datoDoctorSolicitante.set(res.data);
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  cargaRaza(
    empresaLaboratorio_Id: string,
    nombreEspecie: string,
    DependenciaRaza: string
  ) {
    this.razaService
      .getDataRazaTodoEspecie(empresaLaboratorio_Id, nombreEspecie)
      .subscribe({
        next: (res) => {
          this.datoRaza.set(res.data);
          //Pasa al campo del Form la raza del paciente seleccionado
          if (DependenciaRaza != undefined) {
            this.rescatadoRaza = this.datoRaza().filter(
              (raza) => raza.nombre == DependenciaRaza
            )[0];
            if (this.rescatadoRaza != undefined)
              this.agregaFicha()
                .get('idRaza')!
                .setValue(this.rescatadoRaza._id);
          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO13', error, 'error');
        },
      });
  }

  cargaPropietarioRut(rutPropietario: string) {
    let nombrePropietario: string;

    if (rutPropietario != '') {
      this.propietarioService.getDataPropietarioRut(rutPropietario).subscribe({
        next: (res) => {
          if (res.data.length != 0) {
            nombrePropietario = res.data[0].nombres;
            if (res.data[0].apellidoPaterno != '.')
              nombrePropietario =
                nombrePropietario + ' ' + res.data[0].nombrePropietario;

            if (res.data[0].apellidoMaterno != '.')
              nombrePropietario =
                nombrePropietario + ' ' + res.data[0].nombreMropietario;

            this.agregaFicha()
              .get('nombrePropietario')!
              .setValue(nombrePropietario);
            this.agregaFicha().controls['nombrePropietario'].disable();

            this.agregaFicha()
              .get('correoClienteFinal')!
              .setValue(res.data[0].email);
          } else {
            this.agregaFicha().controls['nombrePropietario'].enable();
            this.agregaFicha().get('nombrePropietario')!.setValue('');
          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO14', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
    } else {
      this.agregaFicha().controls['nombrePropietario'].enable();
      this.agregaFicha().get('nombrePropietario')!.setValue('');
    }
  }
  /*FIN CARGA CABECERA*/

  /*SELECCIONA CABECERA*/
  async seleccionaPaciente(event: any) {
    this.agregaFicha().get('sexo')!.setValue(event.sexo);

    let idEspecieArr = await this.datoEspecie().filter(
      (x) => x.nombre === event.nombreEspecie
    );

    let idEspecie_ = '';
    if (idEspecieArr.length == 1) idEspecie_ = idEspecieArr[0]._id!;

    this.agregaFicha().get('idEspecie')!.setValue(idEspecie_);
    this.rescatadoEspecie = await this.datoEspecie().filter(
      (especie) => especie._id == idEspecie_
    )[0];
    await this.cargaRaza(
      this.id_EmpresaLaboratorio,
      event.nombreEspecie,
      event.nombreRaza
    );
  }

  async seleccionaCliente(p: any) {
    this.verExamenes.set(true);

    this.IClienteIngresoFicha = {
      idCliente: p._id,
      rutCliente: p.rutCliente,
      razonSocial: p.razonSocial,
      nombreFantasia: p.nombreFantasia,
      correoRecepcionCliente: p.emailRecepcionExamenCliente,
    };

    await this.cargaClienteDoctorSolicitante(p._id);
    return;
  }

  async seleccionaEspecie(idEspecie: any) {
    this.rescatadoEspecie = await this.datoEspecie().filter(
      (especie) => especie._id == idEspecie
    )[0];
    await this.cargaRaza(
      this.id_EmpresaLaboratorio,
      this.rescatadoEspecie.nombre,
      '0'
    );
    return;
  }

  async seleccionaRaza(idRaza: any) {
    this.rescatadoRaza = await this.datoRaza().filter(
      (raza) => raza._id == idRaza
    )[0];
    return;
  }
  /*FIN SELECCION CABECERA*/

  async categoriaExamen(idLaboratorio: string) {
    let registroCategoriaExamenInterface: ICategoriaExamenInterface;
    this.categoriaExamenService
      .getDataCategoriaExamenTodo(idLaboratorio)
      .subscribe({
        next: (res) => {
          for (const _examenCategoria of res.data) {
            this.agregaFicha().addControl(
              _examenCategoria.sigla,
              new FormControl('')
            );

            registroCategoriaExamenInterface = {
              nombre: _examenCategoria.nombre,
              sigla: _examenCategoria.sigla,
              examen: this.cargaCategoriaFiltro(_examenCategoria.nombre),
            };

            this.datoCategoriaExamenInterface.update(
              (datoCategoriaExamenInterface) => [
                ...datoCategoriaExamenInterface,
                registroCategoriaExamenInterface,
              ]
            );
          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO4', error, 'error');
        },
      });
  }

  async cargaExamen(idLaboratorio: string) {
    this.examenService.getDataExamenTodo(idLaboratorio).subscribe({
      next: (res) => {
        this.datoExamen = res.data;

        this.datoExamen.sort(function (a, b) {
          if (a.nombre! > b.nombre!) {
            return 1;
          }
          if (a.nombre! < b.nombre!) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        this.categoriaExamen(this.data.datoIngreso.empresa_Id);

        this.datoCategoriaHormona.set(
          this.datoExamen.filter(
            (item) => item.categoria == 'Hormonas' && item.tipoExamen != 'Padre'
          )
        );
        let internoExternoBoolean: boolean;
        for (const element of this.datoExamen) {
          if (element.internoExterno == 'Interno')
            internoExternoBoolean = false;
          else internoExternoBoolean = true;

          this.arregloExamenMuestraFicha.update((arregloExamenMuestraFicha) => [
            ...arregloExamenMuestraFicha,
            {
              nombreCategoriaExamen: element.categoria,
              codigoInterno: element.codigoInterno!,
              nombreExamen: element.nombre,
              internoExternoBoolean: internoExternoBoolean,
              internoExterno: element.internoExterno,
              tipoExamen: element.tipoExamen,
              chk: 'chk_' + element.codigoInterno,
              valid: 'valid_' + element.codigoInterno,
              usua: 'usua_' + element.codigoInterno,
            },
          ]);
          this.agregaFicha().addControl(
            'chk_' + element.codigoInterno,
            new FormControl('')
          );

          this.agregaFicha().addControl(
            'valid_' + element.codigoInterno,
            new FormControl('')
          );
          this.agregaFicha().addControl(
            'usua_' + element.codigoInterno,
            new FormControl('')
          );
        }
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO4', error, 'error');
      },
    });
  }

  public cargaCategoriaFiltro(categoria: string) {
    return this.datoExamen.filter(
      (item) => item.categoria == categoria && item.tipoExamen != 'Padre'
    );
  }

  validaValidador(visible: boolean, campo: string, internoExterno: string) {
    // VALIDA QUE CUANDO ES VISIBLE ACTIVA LA VALIDACIÓN DE LOS CAMPOS idValidador
    if (visible) {
      if (internoExterno == 'Interno') {
        this.agregaFicha().removeControl(campo);
        this.agregaFicha().addControl(
          campo,
          new FormControl('', [Validators.required])
        );
      } else {
        this.agregaFicha().removeControl(campo);
        this.agregaFicha().addControl(
          campo,
          new FormControl({ value: '', disabled: true })
        );
      }
    } else {
      this.agregaFicha().removeControl(campo);
      this.agregaFicha().addControl(campo, new FormControl(''));
    }
  }

  cargaValidador(idLaboratorio: string) {
    this.validadorService.getDataValidadorTodo(idLaboratorio).subscribe({
      next: (res) => {
        this.datoValidador.set(res.data);
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO5', error, 'error');
      },
    });
  }

  cargaUsuarioLaboratorio(idLaboratorio: string) {
    this.usuarioService.getDataUsuarioLaboratorio(idLaboratorio).subscribe({
      next: (res) => {
        this.datoUsuario.set(res.data);
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO7', error, 'error');
      },
    });
  }

  async seleccionaExamen(p: any, categoria_: string) {
    this.cuentaChk;
    console.log('p:', p);
    console.log('categoria:', categoria_);
    let datosExamenHijo = this.datoExamen.filter(
      (item) => item.categoria == categoria_ && item.tipoExamen != 'Padre'
    );
    let datosExamenPadre = this.datoExamen.filter(
      (item) => item.categoria == categoria_ && item.tipoExamen == 'Padre'
    );

    console.log('datosExamenHijo:', datosExamenHijo);
    console.log('datosExamenPadre:', datosExamenPadre);
    //Desvisualiza todos
    for (const element of datosExamenHijo) {
      this.agregaFicha()
        .get('chk_' + element.codigoInterno)!
        .setValue(false);
      this.validaValidador(
        false,
        'valid_' + element.codigoInterno,
        element.internoExterno
      );
    }
    //Fin Desvisualiza

    let muestra = true;
    let hijosSeleccionados = p.filter((item: any) => item.tipoExamen == 'Hijo'); //Rescata Hijos seleccionados

    if (hijosSeleccionados.length == 0) {
      if (datosExamenPadre.length != 0) {
        muestra = false;
      }
    }
    if (datosExamenPadre.length != 0) {
      this.agregaFicha()
        .get('chk_' + datosExamenPadre[0].codigoInterno)!
        .setValue(muestra); //Muestra
      this.validaValidador(
        muestra,
        'valid_' + datosExamenPadre[0].codigoInterno,
        datosExamenPadre[0].internoExterno
      );
    }
    //Visualiza los marcados
    for (const element of p) {
      this.agregaFicha()
        .get('chk_' + element.codigoInterno)!
        .setValue(true);
      if (element.tipoExamen != 'Hijo')
        this.validaValidador(
          true,
          'valid_' + element.codigoInterno,
          element.internoExterno
        );
    }

    this.cambiaValidacionGlobal();

    return;
  }

  cambiaValidacionGlobal() {
    /** Este metodo verifica si selecciono algún examen */
    let cuenta = 0;
    for (let datoCategoriaExamenInterface_ of this.datoCategoriaExamenInterface()) {
      cuenta =
        cuenta +
        this.agregaFicha().get(datoCategoriaExamenInterface_.sigla)?.value
          .length;
    }

    if (cuenta == 0)
      this.agregaFicha()
        .get('flagExamen')!
        .setValidators([Validators.required]);
    else this.agregaFicha().get('flagExamen')!.clearValidators();

    this.agregaFicha().get('flagExamen')!.updateValueAndValidity();
  }

  chkExamenFicha(nombreCampo: string) {
    this.agregaFicha().get(nombreCampo)!.setValue(true);
  }

  async enviar() {
    /*Recorre todas las categorias*/
    this.precioFinalPadre = 0;
    for (let datoCategoriaExamenInterface_ of this.datoCategoriaExamenInterface()) {
      await this.enviar_SinPadre(datoCategoriaExamenInterface_.nombre);
      await this.enviar_ConPadre(datoCategoriaExamenInterface_.nombre);
    }
    this.grabar(); // Solo entra una vez
  }

  async enviar_ConPadre(categoria: string) {
    /** identifica todos los examenes hijos seleccionados */
    let examenDato: IExamen;
    this.datoExamenHijo = [];
    let padre: IFichaMuestraExamen[];

    for (const element of this.arregloExamenMuestraFicha().filter(
      (valor) =>
        valor.nombreCategoriaExamen == categoria && valor.tipoExamen == 'Hijo'
    )) {
      console.log('categoria111:', categoria);
      if (this.agregaFicha().get(element.chk)!.value) {
        examenDato = await this.datoExamen.find(
          (valor) => valor.codigoInterno === element.codigoInterno
        )!;

        await this.datoExamenHijo.push({
          idExamen: examenDato._id!,
          codigoInterno: examenDato.codigoInterno.toString()!,
          nombre: examenDato.nombre!,
          precioValor: examenDato.precio.toString()!,
        });
        this.precioFinalPadre = this.precioFinalPadre + examenDato.precio;
      }
    }
    console.log('this.datoExamenHijo:', this.datoExamenHijo);
    if (this.datoExamenHijo.length > 0) {
      console.log('this.datoExamenHijo.length');
      padre = await this.arregloExamenMuestraFicha().filter(
        (valor) =>
          valor.nombreCategoriaExamen == categoria &&
          valor.tipoExamen == 'Padre'
      );
      console.log('padre[0].codigoInterno:', padre[0].codigoInterno);
      examenDato = await this.datoExamen.find(
        (valor) => valor.codigoInterno === padre[0].codigoInterno
      )!;
      console.log('examenDato:', examenDato);
      await this.cargaEnvia(padre[0], examenDato, this.datoExamenHijo);
    }
  }

  async enviar_SinPadre(categoria: string) {
    /**Identifica los examenes seleccionados Independientes */
    let examenDato: IExamen;
    for (const element of this.arregloExamenMuestraFicha().filter(
      (valor) =>
        valor.nombreCategoriaExamen == categoria &&
        valor.tipoExamen == 'Independiente'
    )) {
      if (this.agregaFicha().get(element.chk)!.value) {
        examenDato = await this.datoExamen.find(
          (valor) => valor.codigoInterno === element.codigoInterno
        )!;
        this.precioFinalPadre = examenDato.precio;
        await this.cargaEnvia(element, examenDato, []);
      }
    }
  }

  cargaEnvia(
    /**Este metodo unifica el examen y sus datos */
    elemento: IFichaMuestraExamen,
    examenDato: IExamen,
    examenHijo: IExamenHijo[]
  ) {
    this.examen = {
      idExamen: examenDato._id!,
      codigoExamen: examenDato.codigoExamen,
      codigoInterno: examenDato.codigoInterno.toString(),
      numeroFormatoInterno: examenDato.numeroFormatoInterno,
      nombre: examenDato.nombre,
      tituloExamen: examenDato.tituloExamen,
      precioValor: examenDato.precio.toString(),
      precioValorFinal: this.precioFinalPadre.toString(),
      tiempoPreparacion: examenDato.tiempoPreparacion,
      internoExterno: examenDato.internoExterno,
      categoria: examenDato.categoria,
      tipoExamen: examenDato.tipoExamen,
      examenHijo: examenHijo,
    };

    this.usuarioAsignado = {
      idUsuario: '',
      usuario: '',
      rutUsuario: '',
      nombreCompleto: '',
    };

    if (this.agregaFicha().get(elemento.usua)!.value._id != undefined) {
      this.usuarioAsignado = {
        idUsuario: this.agregaFicha().get(elemento.usua)!.value._id,
        usuario: this.agregaFicha().get(elemento.usua)!.value.usuario,
        rutUsuario: this.agregaFicha().get(elemento.usua)!.value.rutUsuario,
        nombreCompleto:
          this.agregaFicha().get(elemento.usua)!.value.nombres +
          ' ' +
          this.agregaFicha().get(elemento.usua)!.value.apellidoPaterno +
          ' ' +
          this.agregaFicha().get(elemento.usua)!.value.apellidoMaterno,
      };
    }

    this.validadorAsignado = {
      idValidador: '',
      rutValidador: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      profesion: '',
      nombreFirma: '',
    };

    if (this.agregaFicha().get(elemento.valid)!.value._id != undefined) {
      this.validadorAsignado = {
        idValidador: this.agregaFicha().get(elemento.valid)!.value._id,
        rutValidador: this.agregaFicha().get(elemento.valid)!.value
          .rutValidador,
        nombres: this.agregaFicha().get(elemento.valid)!.value.nombres,
        apellidoPaterno: this.agregaFicha().get(elemento.valid)!.value
          .apellidoPaterno,
        apellidoMaterno: this.agregaFicha().get(elemento.valid)!.value
          .apellidoMaterno,
        telefono: this.agregaFicha().get(elemento.valid)!.value.telefono,
        profesion: this.agregaFicha().get(elemento.valid)!.value.profesion,
        nombreFirma: this.agregaFicha().get(elemento.valid)!.value.nombreFirma,
      };
    }

    this.datoFichaDetalleEnviaExamen.push({
      examen: this.examen,
      usuarioAsignado: this.usuarioAsignado,
      validadorAsignado: this.validadorAsignado,
    });
  }

  grabar() {
    /**Rescata los datos faltantes y Graba */
    this.numeroFichaCorrelativo = this.numeroFichaCorrelativo + 1;
    console.log('correlativo:', this.numeroFichaCorrelativo);

    this.IIngresadoPor = {
      tipoEmpresa: 'Laboratorio', //Administrador, Laboratorio, Veterinaria
      idIngreso: this.data.datoIngreso.empresa_Id,
      rutIngreso: this.data.datoIngreso.rutEmpresa,
      razonSocial: this.data.datoIngreso.razonSocial,
      nombreFantasia: this.data.datoIngreso.nombreFantasia,
    };

    this.cliente = {
      idCliente: this.IClienteIngresoFicha.idCliente, // this.agregaFicha.get('idCliente')!.value._id,
      rutCliente: this.IClienteIngresoFicha.rutCliente, // this.agregaFicha.get('idCliente')!.value.rutCliente,
      razonSocial: this.IClienteIngresoFicha.razonSocial, //this.agregaFicha.get('idCliente')!.value.razonSocial,
      nombreFantasia: this.IClienteIngresoFicha.nombreFantasia, //this.agregaFicha.get('idCliente')!.value.nombreFantasia,
      correoRecepcionCliente: this.IClienteIngresoFicha.correoRecepcionCliente, //this.agregaFicha.get('idCliente')!.value.emailRecepcionExamenCliente
    };

    this.datoEmpresa_.empresa_Id = this.data.empLaboratorio;
    this.especie = {
      idEspecie: this.rescatadoEspecie._id!, //  this.agregaFicha.get('idEspecie')!.value._id,
      nombre: this.rescatadoEspecie.nombre, //this.agregaFicha.get('idEspecie')!.value.nombre
    };

    this.raza = {
      idRaza: this.rescatadoRaza._id!, //this.agregaFicha.get('idRaza')!.value._id,
      nombre: this.rescatadoRaza.nombre, //this.agregaFicha.get('idRaza')!.value.nombre
    };

    this.doctorSolicitante = {
      idDoctorSolicitante: this.agregaFicha().get('idDoctorSolicitante')!.value
        ._id,
      nombreDoctorSolicitante: this.agregaFicha().get('idDoctorSolicitante')!
        .value.nombre,
    };

    let nombrePropietario = '--';
    if (this.agregaFicha().get('nombrePropietario')!.value != '')
      nombrePropietario = this.agregaFicha().get('nombrePropietario')!.value;

    this.datoFicha = {
      fichaC: {
        cliente: this.cliente,
        rutPropietario: this.agregaFicha().get('rutPropietario')!.value,
        nombrePropietario: nombrePropietario,
        nombrePaciente: this.agregaFicha().get('nombrePaciente')!.value,
        edadPaciente: this.agregaFicha().get('edad')!.value,
        especie: this.especie,
        raza: this.raza,
        sexo: this.agregaFicha().get('sexo')!.value,
        doctorSolicitante: this.doctorSolicitante,
        correoClienteFinal: this.agregaFicha().get('correoClienteFinal')!.value,
      },
      empresa: this.datoEmpresa_,
      ingresadoPor: this.IIngresadoPor,
      facturacion: {
        fechaFacturacion: new Date('01/01/1900 00:00:00'),
        fechaPagoFacturacion: new Date('01/01/1900 00:00:00'),
      },
      estadoFicha: this.estadoFicha_,
      usuarioCrea_id: this.usuario,
      usuarioModifica_id: this.usuario,
      seguimientoEstado: {
        usuarioIngresado_crea_id: this.usuario,
        usuarioIngresado_modifica_id: this.usuario,
        fechaHora_ingresado_crea: new Date('01/01/1900 00:00:00'),
        fechaHora_ingresado_modifica: new Date('01/01/1900 00:00:00'),
        usuarioRecepcionado_crea_id: this.usuario,
        fechaHora_recepcionado_crea: new Date('01/01/1900 00:00:00'),
        usuarioRecepcionado_modifica_id: this.usuario,
        fechaHora_recepcionado_modifica: new Date('01/01/1900 00:00:00'),

        usuarioAnalizado_id: '',
        fechaHora_analizado: new Date('01/01/1900 00:00:00'),

        usuarioEnviado_id: '',
        fechaHora_enviado: new Date('01/01/1900 00:00:00'),
      },
      datoFichaDetalleEnviaExamen: this.datoFichaDetalleEnviaExamen,
    };
    console.log('datoFicha:', this.datoFicha);

    this.fichaService.postDataFicha(this.datoFicha).subscribe({
      next: (dato) => {
        console.log('agrega dato:', dato);
        if (dato.codigo === 200) {
          //       console.log('valor examen:',dato)
          Swal.fire('Se Agregó con Éxito', '', 'success');
          this.dialogRef.close(1);
          return;
        }
        if (dato.codigo == 500) {
          console.log('Error de backend:', dato.mensaje);
          Swal.fire(dato.mensaje.message, 'ERROR SISTEMA', 'error');
          return;
        }
      },
      error: (error) => {
        this.spinnerService.esconder();
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }

  async onBlurRutPropietario(event: any) {
    const rut = event.target.value;

    if (validateRut(rut) === true) {
      this.agregaFicha()
        .get('rutPropietario')!
        .setValue(formatRut(rut, RutFormat.DOTS_DASH));
      this.cargaPropietarioRut(this.agregaFicha().get('rutPropietario')!.value);
      this.cargaPaciente(this.agregaFicha().get('rutPropietario')!.value);
    } else if (rut == '') {
      this.cargaPropietarioRut(this.agregaFicha().get('rutPropietario')!.value);
    }
  }

  chkValidaFirma(p: any, nombreCampo: string) {
    //'idValidadorHemograma'
    if (p.nombreFirma.substr(0, 5) != 'firma') {
      this.agregaFicha().get(nombreCampo)!.setValue('');

      Swal.fire(
        'No puede seleccionar este Validador',
        'NO CUENTA CON FIRMA',
        'error'
      );
    }
  }
}
