import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
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
import { formatRut, RutFormat, validateRut } from '@fdograph/rut-utilities';
import Swal from 'sweetalert2';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
  IFicha,
  IFichaCliente,
  IFichaDoctorSolicitante,
  IFichaEspecie,
  IFichaExamen,
  IFichaRaza,
  IFichaUsuarioAsignado,
  IFichaValidador,
} from '@laboratorio/modelos/ficha-modelo';
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { IValidador } from '@laboratorio/modelos/validador-modelo';
import { IUsuario } from '@modelos/usuario-modelo';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import { IEmpresa } from '@modelos/empresa-modelo';
import {
  IFichaDetalleEnviaModificaExamen,
  IFichaMuestraExamenModifica,
} from '@laboratorio/interfaces/fichaMuestra-interface';
import { IDoctorSolicitante } from '@laboratorio/modelos/doctorSolicitante-modelo';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { IRaza } from '@laboratorio/modelos/raza-modelo';
import { IPacienteIngresoFicha } from '@laboratorio/interfaces/paciente-interface';
import { IClienteIngresoFicha } from '@laboratorio/interfaces/cliente-interface';
import { map, Observable, ReplaySubject, startWith, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';

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
  MatSelect,
  MatDividerModule,
  MatAutocompleteModule,
];

@Component({
  selector: 'app-modifica-ficha',
  templateUrl: './modifica-ficha.component.html',
  styleUrls: ['./modifica-ficha.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaFichaComponent implements OnInit {
  private readonly _storage = inject(StorageService);
  private readonly localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaFichaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  private readonly empresaService = inject(EmpresaService);
  private readonly examenService = inject(ExamenService);
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
  examenDato!: IExamen;
  especie!: IFichaEspecie;
  raza!: IFichaRaza;
  doctorSolicitante!: IFichaDoctorSolicitante;
  usuarioAsignado!: IFichaUsuarioAsignado;
  validadorAsignado!: IFichaValidador;
  validador!: IValidador;
  datoFicha!: IFicha;
  datoUsuarioAsignado!: IUsuario;
  ///IIngresadoPor!: IIngresadoPor;
  rescatadoEspecie!: IEspecie;
  rescatadoRaza!: IRaza;
  datoFicha_Data!: IFicha;

  //datoExamen!: IExamen[];
  datoUsuario = signal<IUsuario[]>([]);
  datoCliente!: ICliente[];
  datoEmpresa!: IEmpresa[];
  datoValidador = signal<IValidador[]>([]);
  datoFichaDetalleEnviaExamen: IFichaDetalleEnviaModificaExamen[] = [];

  datoPaciente!: IPacienteIngresoFicha[];
  IClienteIngresoFicha!: IClienteIngresoFicha;

  arregloExamenMuestraFicha = signal<IFichaMuestraExamenModifica[]>([]);
  datoDoctorSolicitante = signal<IDoctorSolicitante[]>([]);
  datoEspecie = signal<IEspecie[]>([]);
  datoRaza = signal<IRaza[]>([]);
  datoFicha_DataTodos!: IFicha[];

  /*--------------------------*/
  /** indicate search operation is in progress */
  public searching = false;
  /** list of banks filtered after simulating server side search */
  public filteredServerSideCliente: ReplaySubject<ICliente[]> =
    new ReplaySubject<ICliente[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  /*--------------------------*/

  filtrarOpcionCliente!: Observable<ICliente[]>;
  // filtrarOpcionPropietario!: Observable<IPropietario[]>;
  filtrarOpcionPaciente!: Observable<IPacienteIngresoFicha[]>;

  fechaActual: Date = new Date();

  datoSexo = signal([
    { nombre: 'Hembra', id: 'Hembra' },
    { nombre: 'Macho', id: 'Macho' },
  ]);

  cuentaChk: number = 0;

  flagGraba = 0;

  nombreLogo = 'sinLogo.png';
  nombreLogoCabeceraExamen = 'sinLogo.png';
  footerExamen = '';
  headerLeyenda = '';

  tipoEmpresa = '';
  razonSocial = '';
  rutEmpresa = '';
  nombreFantasia = '';
  tituloBoton = 'Grabar';
  estadoFicha_ = 'Ingresado';
  usuario: string = this.data.usuario;
  id_EmpresaLaboratorio = '';

  correoRecepcionCliente_P = '';
  constructor() {}

  idCliente = new FormControl('', [Validators.required]);
  idEmpresa = new FormControl('', [Validators.required]);
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

  modificaFicha = signal<FormGroup>(
    new FormGroup({
      idCliente: this.idCliente,
      idEmpresa: this.idEmpresa,
      rutPropietario: this.rutPropietario,
      nombrePropietario: this.nombrePropietario,
      nombrePaciente: this.nombrePaciente,
      idEspecie: this.idEspecie,
      idRaza: this.idRaza,
      edad: this.edad,
      sexo: this.sexo,
      idDoctorSolicitante: this.idDoctorSolicitante,
      correoClienteFinal: this.correoClienteFinal,
    })
  );

  /** control for filter for server side. */

  getErrorMessage(campo: string) {
    if (campo === 'idCliente') {
      return this.idCliente.hasError('required')
        ? 'Debes Seleccionar Cliente'
        : '';
    }
    if (campo === 'idEmpresa') {
      return this.idEmpresa.hasError('required')
        ? 'Debes Seleccionar Laboratorio'
        : '';
    }

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
    if (validateRut(control.value) === false) {
      return { rutInvalido: true };
    }
    return null as any;
  }

  async ngOnInit() {
    this.cargaCliente(this.data.empresa_Id);
    this.cargaUsuarioLaboratorio(this.data.empresa_Id);
    this.cargaEspecie(this.data.empresa_Id);
    this.cargaValidador(this.data.empresa_Id);
    ///this.cargaExamen(this.data.empresa_Id);
    this.id_EmpresaLaboratorio = this.data.empresa_Id;

    this.getEmpresa(this.data.empresa_Id);
    this.modificaFicha().get('idEmpresa')!.clearValidators();
    this.modificaFicha().get('idEmpresa')!.updateValueAndValidity();
    this.getFicha();
  }

  async getFicha() {
    this.fichaService
      .getDataFichaIdFicha(this.data.empresa_Id, this.data.datoFicha.id_Ficha)
      .subscribe({
        next: (res) => {
          console.log(' res[data]', res['data']);
          this.datoFicha_Data = res.data[0] as IFicha;
          this.datoFicha_DataTodos = res.data as IFicha[];
          console.log('ficha', this.datoFicha_Data);
          //this.cargaClienteId(this.datoFicha_Data.fichaC.cliente?.idCliente!)
          this.cargaExamenFicha();
          this.cargaDatos();
          // this.seleccionaEspecie(this.datoFicha_Data.fichaC.especie?.idEspecie)
          // this.seleccionaRaza(this.datoFicha_Data.fichaC!.raza!.idRaza)
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO5', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  async cargaDatos() {
    this.IClienteIngresoFicha = {
      idCliente: this.datoFicha_Data.fichaC.cliente?.idCliente,
      rutCliente: this.datoFicha_Data.fichaC.cliente?.rutCliente,
      razonSocial: this.datoFicha_Data.fichaC.cliente?.razonSocial,
      nombreFantasia: this.datoFicha_Data.fichaC.cliente?.nombreFantasia,
      correoRecepcionCliente:
        this.datoFicha_Data.fichaC.cliente?.correoRecepcionCliente,
    };
    this.modificaFicha()
      .get('idCliente')!
      .setValue(this.datoFicha_Data.fichaC.cliente?.nombreFantasia);

    this.modificaFicha()
      .get('rutPropietario')!
      .setValue(this.datoFicha_Data.fichaC.rutPropietario);
    if (this.datoFicha_Data.fichaC.rutPropietario != '') {
      this.cargaPropietarioRut(
        this.modificaFicha().get('rutPropietario')!.value
      );
      this.cargaPaciente(this.modificaFicha().get('rutPropietario')!.value);
    } else {
      this.modificaFicha()
        .get('nombrePropietario')!
        .setValue(this.datoFicha_Data.fichaC.nombrePropietario);
    }

    this.modificaFicha()
      .get('nombrePaciente')!
      .setValue(this.datoFicha_Data.fichaC.nombrePaciente);
    this.modificaFicha()
      .get('edad')!
      .setValue(this.datoFicha_Data.fichaC.edadPaciente);
    this.modificaFicha()
      .get('idEspecie')!
      .setValue(this.datoFicha_Data.fichaC.especie?.idEspecie);
    this.cargaRaza(
      this.datoFicha_Data.empresa?.empresa_Id!,
      this.datoFicha_Data.fichaC.especie?.nombre!,
      this.datoFicha_Data.fichaC.raza?.nombre!
    );
    this.modificaFicha().get('sexo')!.setValue(this.datoFicha_Data.fichaC.sexo);
    this.cargaClienteDoctorSolicitante(
      this.datoFicha_Data.fichaC.cliente?.idCliente
    );
    this.modificaFicha()
      .get('idDoctorSolicitante')!
      .setValue(
        this.datoFicha_Data.fichaC.doctorSolicitante?.nombreDoctorSolicitante
      );
    this.modificaFicha()
      .get('correoClienteFinal')!
      .setValue(this.datoFicha_Data.fichaC.correoClienteFinal);
  }

  private _filter(valor: string): ICliente[] {
    return this.datoCliente.filter(
      (cliente) => cliente.nombreFantasia!.toLowerCase().indexOf(valor) > -1
    );
  }

  private _filterPaciente(valor: string): IPacienteIngresoFicha[] {
    return this.datoPaciente.filter(
      (paciente) => paciente.nombre!.toLowerCase().indexOf(valor) > -1
    );
  }

  async cargaExamenFicha() {
    console.log('pasoooo exámenes:', this.datoFicha_DataTodos);

    this.datoFicha_DataTodos.sort(function (a, b) {
      if (a.fichaC.examen!.nombre > b.fichaC.examen!.nombre) {
        return 1;
      }
      if (a.fichaC.examen!.nombre < b.fichaC.examen!.nombre) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    let internoExternoBoolean: boolean;

    for (const element of this.datoFicha_DataTodos) {
      if (element.fichaC.examen!.internoExterno == 'Interno')
        internoExternoBoolean = false;
      else internoExternoBoolean = true;

      this.arregloExamenMuestraFicha.update((arregloExamenMuestraFicha) => [
        ...arregloExamenMuestraFicha,
        {
          _id: element._id!,
          numeroFicha: element.fichaC.numeroFicha!,
          codigoInterno: parseInt(element.fichaC.examen!.codigoInterno),
          nombreExamen: element.fichaC.examen!.nombre,
          internoExternoBoolean: internoExternoBoolean,
          internoExterno: element.fichaC.examen!.internoExterno,
          chk: 'chk_' + element.fichaC.examen!.codigoInterno,
          validador: element.fichaC.validador!.idValidador,
          valid: 'valid_' + element.fichaC.examen!.codigoInterno,
          usua: 'usua_' + element.fichaC.examen!.codigoInterno,
          usuarioAsignado: element.usuarioAsignado!.idUsuario!,
        },
      ]);
      console.log('paso2');
      this.modificaFicha().addControl(
        'chk_' + element.fichaC.examen!.codigoInterno,
        new FormControl({ value: '', disabled: true })
      );
      console.log('paso3');
      if (element.fichaC.examen!.internoExterno == 'Interno')
        this.modificaFicha().addControl(
          'valid_' + element.fichaC.examen!.codigoInterno,
          new FormControl(element.fichaC.validador?.idValidador, [
            Validators.required,
          ])
        );
      else
        this.modificaFicha().addControl(
          'valid_' + element.fichaC.examen!.codigoInterno,
          new FormControl({ value: '', disabled: true })
        );

      this.modificaFicha().addControl(
        'usua_' + element.fichaC.examen!.codigoInterno,
        new FormControl('')
      );
    }
  }
  /*
  async cargaExamen(idLaboratorio: string) {
    this.examenService.getDataExamenTodo(idLaboratorio).subscribe({
      next: (res) => {
        console.log('examen:', res['data']);
        this.datoExamen = res.data as any[];
      },
      // console.log('yo:', res as PerfilI[]),
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO4', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
  }
*/
  cargaValidador(idLaboratorio: string) {
    this.validadorService.getDataValidadorTodo(idLaboratorio).subscribe({
      next: (res) => {
        this.datoValidador.set(res.data);
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO5', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
  }

  getEmpresa(idLaboratorio: string) {
    //Busca si entra como Laboratorio
    this.empresaService.getDataEmpresa(idLaboratorio).subscribe({
      next: (res) => {
        this.nombreLogo = res['data'][0]?.nombreLogo;
        this.nombreLogoCabeceraExamen =
          res['data'][0]?.nombreLogoCabeceraExamen;
        this.rutEmpresa = res['data'][0]?.rutEmpresa;
        this.razonSocial = res['data'][0]?.razonSocial;
        this.nombreFantasia = res['data'][0]?.nombreFantasia;
        this.headerLeyenda = res['data'][0]?.headerLeyenda;
        this.footerExamen = res['data'][0]?.footerExamen;
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO6', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
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
    }); // (this.dataSource.data = res as PerfilI[])
  }

  cargaCliente(idLaboratorio: string) {
    this.clienteService.getDataCliente(idLaboratorio).subscribe({
      next: (res) => {
        this.datoCliente = res['data'];
        //este es de matComplete
        this.filtrarOpcionCliente = this.idCliente.valueChanges.pipe(
          startWith(''),
          map((value) =>
            value ? this._filter(value) : this.datoCliente.slice()
          )
        );
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO8', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
  }

  cargaPaciente(runPropietario: string) {
    this.fichaService.getDataPaciente(runPropietario).subscribe({
      next: (res) => {
        this.datoPaciente = res['data'];
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
    }); // (this.dataSource.data = res as PerfilI[])
  }

  cargaEmpresasCliente(idCliente: string) {
    this.clienteService.getDataEmpresasCliente(idCliente).subscribe({
      next: (res) => {
        this.datoEmpresa = res['data'];
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO9', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
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
    }); // (this.dataSource.data = res as PerfilI[])
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
      }); // (this.dataSource.data = res as PerfilI[])
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
          console.log('paso llena raza');
          //Pasa al campo del Form la raza del paciente seleccionado
          if (DependenciaRaza != undefined) {
            this.rescatadoRaza = this.datoRaza().filter(
              (raza) => raza.nombre == DependenciaRaza
            )[0];
            if (this.rescatadoRaza != undefined)
              this.modificaFicha()
                .get('idRaza')!
                .setValue(this.rescatadoRaza._id);
          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO13', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  cargaPropietarioRut(rutPropietario: string) {
    let nombrePropietario: string;

    if (rutPropietario != '') {
      this.propietarioService.getDataPropietarioRut(rutPropietario).subscribe({
        next: (res) => {
          if (res['data'].length != 0) {
            nombrePropietario = res['data'][0].nombres;
            if (res['data'][0].apellidoPaterno != '.')
              nombrePropietario =
                nombrePropietario + ' ' + res['data'][0].nombrePropietario;

            if (res['data'][0].apellidoMaterno != '.')
              nombrePropietario =
                nombrePropietario + ' ' + res['data'][0].nombreMropietario;

            this.modificaFicha()
              .get('nombrePropietario')!
              .setValue(nombrePropietario);
            this.modificaFicha().controls['nombrePropietario'].disable();
          } else {
            this.modificaFicha().controls['nombrePropietario'].enable();
            this.modificaFicha().get('nombrePropietario')!.setValue('');
          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO14', error, 'error');
        },
      });
    } else {
      this.modificaFicha().controls['nombrePropietario'].enable();
      this.modificaFicha().get('nombrePropietario')!.setValue('');
    }
  }

  async seleccionaPaciente(event: any) {
    this.modificaFicha().get('sexo')!.setValue(event.sexo);

    let idEspecieArr = this.datoEspecie().filter(
      (x) => x.nombre === event.nombreEspecie
    );

    let idEspecie_ = '';

    if (idEspecieArr.length == 1) idEspecie_ = idEspecieArr[0]._id!;

    this.modificaFicha().get('idEspecie')!.setValue(idEspecie_);
    this.rescatadoEspecie = this.datoEspecie().filter(
      (especie) => especie._id == idEspecie_
    )[0];
    this.cargaRaza(
      this.id_EmpresaLaboratorio,
      event.nombreEspecie,
      event.nombreRaza
    );

    // cargaPaciente(runPropietario)
  }

  seleccionaUsuario(p: any) {
    return;
  }

  async seleccionaCliente(p: any) {
    this.IClienteIngresoFicha = {
      idCliente: p._id,
      rutCliente: p.rutCliente,
      razonSocial: p.razonSocial,
      nombreFantasia: p.nombreFantasia,
      correoRecepcionCliente: p.emailRecepcionExamenCliente,
    };

    this.cargaClienteDoctorSolicitante(p._id);
  }

  async seleccionaEspecie(idEspecie: any) {
    console.log('idEspecie:', idEspecie);
    console.log('this.datoEspecie', this.datoEspecie());
    this.rescatadoEspecie = this.datoEspecie().filter(
      (especie) => especie._id == idEspecie
    )[0];
    this.cargaRaza(
      this.id_EmpresaLaboratorio,
      this.rescatadoEspecie.nombre,
      '0'
    );
  }

  async seleccionaRaza(idRaza: any) {
    this.rescatadoRaza = this.datoRaza().filter(
      (raza) => raza._id == idRaza
    )[0];
  }

  async enviar() {
    /*Permite ingresar con recursividad por lo de asyncrono*/
    console.log('exámenes:', this.arregloExamenMuestraFicha());
    for (const element of this.arregloExamenMuestraFicha()) {
      /*
      this.examenDato = this.datoExamen.find(
        (valor) => valor.codigoInterno === element.codigoInterno
      )!;
*/
      /*
      console.log(
        'tipo examen:',
        this.modificaFicha().get('examen')!.value.tipoExamen
      );
      this.examen = await this.datoFicha_DataTodos.find(
        (valor) =>
          Number(valor.fichaC.examen?.codigoInterno)! === element.codigoInterno
      )?.fichaC.examen!;

      this.examen.tipoExamen =
        this.modificaFicha().get('examen')!.value.tipoExamen;*/

      /*  this.examen  = {
        idExamen: this.examenDato._id!,
        codigoExamen: this.examenDato.codigoExamen,
        codigoInterno: this.examenDato.codigoInterno.toString(),
        numeroFormatoInterno: this.examenDato.numeroFormatoInterno,
        nombre: this.examenDato.nombre,
        tituloExamen: this.examenDato.tituloExamen,
        precioValor: this.examenDato.precio.toString(),
        precioValorFinal: this.examenDato.precio.toString(),
        tiempoPreparacion: this.examenDato.tiempoPreparacion,
        internoExterno: this.examenDato.internoExterno,
        categoria: this.examenDato.categoria,
        tipoExamen: this.modificaFicha().get('examen')!.value.tipoExamen,
        examenHijo: [],
      };
*/
      this.usuarioAsignado = {
        idUsuario: '',
        usuario: '',
        rutUsuario: '',
        nombreCompleto: '',
      };

      if (this.modificaFicha().get(element.usua)!.value._id != undefined) {
        this.usuarioAsignado = {
          idUsuario: this.modificaFicha().get(element.usua)!.value._id,
          usuario: this.modificaFicha().get(element.usua)!.value.usuario,
          rutUsuario: this.modificaFicha().get(element.usua)!.value.rutUsuario,
          nombreCompleto:
            this.modificaFicha().get(element.usua)!.value.nombres +
            ' ' +
            this.modificaFicha().get(element.usua)!.value.apellidoPaterno +
            ' ' +
            this.modificaFicha().get(element.usua)!.value.apellidoMaterno,
        };
      } else if (
        this.modificaFicha().get(element.usua)!.value != undefined &&
        this.modificaFicha().get(element.usua)!.value != ''
      ) {
        this.datoUsuarioAsignado = this.datoUsuario().find(
          (valor) =>
            valor._id === this.modificaFicha().get(element.usua)!.value!
        )!;
        this.usuarioAsignado = {
          idUsuario: this.datoUsuarioAsignado._id,
          usuario: this.datoUsuarioAsignado.usuario,
          rutUsuario: this.datoUsuarioAsignado.rutUsuario,
          nombreCompleto:
            this.datoUsuarioAsignado.nombres +
            ' ' +
            this.datoUsuarioAsignado.apellidoPaterno +
            ' ' +
            this.datoUsuarioAsignado.apellidoMaterno,
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

      console.log(
        'this.modificaFi 1',
        this.modificaFicha().get(element.valid)!.value._id
      );
      console.log(
        'this.modificaFi 2',
        this.modificaFicha().get(element.valid)!.value
      );

      if (this.modificaFicha().get(element.valid)!.value._id != undefined) {
        this.validadorAsignado = {
          idValidador: this.modificaFicha().get(element.valid)!.value._id,
          rutValidador: this.modificaFicha().get(element.valid)!.value
            .rutValidador,
          nombres: this.modificaFicha().get(element.valid)!.value.nombres,
          apellidoPaterno: this.modificaFicha().get(element.valid)!.value
            .apellidoPaterno,
          apellidoMaterno: this.modificaFicha().get(element.valid)!.value
            .apellidoMaterno,
          telefono: this.modificaFicha().get(element.valid)!.value.telefono,
          profesion: this.modificaFicha().get(element.valid)!.value.profesion,
          nombreFirma: this.modificaFicha().get(element.valid)!.value
            .nombreFirma,
        };
      } else if (
        this.modificaFicha().get(element.valid)!.value != undefined &&
        this.modificaFicha().get(element.valid)!.value != ''
      ) {
        this.validador = this.datoValidador().find(
          (valor) =>
            valor._id === this.modificaFicha().get(element.valid)!.value!
        )!;
        this.validadorAsignado = {
          idValidador: this.validador._id!,
          rutValidador: this.validador.rutValidador,
          nombres: this.validador.nombres,
          apellidoPaterno: this.validador.apellidoPaterno,
          apellidoMaterno: this.validador.apellidoMaterno,
          telefono: this.validador.telefono,
          profesion: this.validador.profesion,
          nombreFirma: this.validador.nombreFirma,
        };
      }

      this.datoFichaDetalleEnviaExamen.push({
        _id: element._id,
        numeroFicha: element.numeroFicha,
        examen: this.examen,
        usuarioAsignado: this.usuarioAsignado,
        validadorAsignado: this.validadorAsignado,
      });
    }
    this.grabar(); // La primera vez no graba
  }

  async grabar() {
    /*
    this.IIngresadoPor = {
      tipoEmpresa: this.datoFicha_Data.ingresadoPor?.tipoEmpresa, //Administrador, Laboratorio, Veterinaria
      idIngreso: this.datoFicha_Data.ingresadoPor?.idIngreso,
      rutIngreso: this.datoFicha_Data.ingresadoPor?.rutIngreso,
      razonSocial: this.datoFicha_Data.ingresadoPor?.razonSocial,
      nombreFantasia: this.datoFicha_Data.ingresadoPor?.nombreFantasia,
    };
*/
    this.cliente = {
      idCliente: this.IClienteIngresoFicha.idCliente, // this.modificaFicha().get('idCliente')!.value._id,
      rutCliente: this.IClienteIngresoFicha.rutCliente, // this.modificaFicha().get('idCliente')!.value.rutCliente,
      razonSocial: this.IClienteIngresoFicha.razonSocial, //this.modificaFicha().get('idCliente')!.value.razonSocial,
      nombreFantasia: this.IClienteIngresoFicha.nombreFantasia, //this.modificaFicha().get('idCliente')!.value.nombreFantasia,
      correoRecepcionCliente: this.IClienteIngresoFicha.correoRecepcionCliente, //this.modificaFicha().get('idCliente')!.value.emailRecepcionExamenCliente
    };
    /*
    empresa_ = {
      empresa_Id: this.datoFicha_Data.empresa!.empresa_Id,
      rutEmpresa: this.datoFicha_Data.empresa!.rutEmpresa,
      razonSocial: this.datoFicha_Data.empresa!.razonSocial,
      nombreFantasia: this.datoFicha_Data.empresa!.nombreFantasia,
      nombreLogo: this.datoFicha_Data.empresa!.nombreLogo,
      nombreLogoCabeceraExamen:
        this.datoFicha_Data.empresa!.nombreLogoCabeceraExamen,
      headerLeyenda: this.datoFicha_Data.empresa!.headerLeyenda,
      footerExamen: this.datoFicha_Data.empresa!.footerExamen,
    };
*/
    this.rescatadoEspecie = this.datoEspecie().filter(
      (especie) => especie._id == this.modificaFicha().get('idEspecie')!.value
    )[0];
    this.especie = {
      idEspecie: this.rescatadoEspecie._id!, //  this.modificaFicha().get('idEspecie')!.value._id,
      nombre: this.rescatadoEspecie.nombre, //this.modificaFicha().get('idEspecie')!.value.nombre
    };

    this.rescatadoRaza = this.datoRaza().filter(
      (raza) => raza._id == this.modificaFicha().get('idRaza')!.value
    )[0];
    this.raza = {
      idRaza: this.rescatadoRaza._id!, //this.modificaFicha().get('idRaza')!.value._id,
      nombre: this.rescatadoRaza.nombre, //this.modificaFicha().get('idRaza')!.value.nombre
    };

    this.doctorSolicitante = {
      idDoctorSolicitante: this.modificaFicha().get('idDoctorSolicitante')!
        .value,
      nombreDoctorSolicitante: this.modificaFicha().get('idDoctorSolicitante')!
        .value,
    };

    let nombrePropietario = '--';
    if (this.modificaFicha().get('nombrePropietario')!.value != '')
      nombrePropietario = this.modificaFicha().get('nombrePropietario')!.value;

    this.datoFicha = {
      fichaC: {
        id_Ficha: this.data.datoFicha.id_Ficha,
        cliente: this.cliente,
        rutPropietario: this.modificaFicha().get('rutPropietario')!.value,
        nombrePropietario: nombrePropietario,
        nombrePaciente: this.modificaFicha().get('nombrePaciente')!.value,
        edadPaciente: this.modificaFicha().get('edad')!.value,
        especie: this.especie,
        raza: this.raza,
        sexo: this.modificaFicha().get('sexo')!.value,
        doctorSolicitante: this.doctorSolicitante,
        correoClienteFinal:
          this.modificaFicha().get('correoClienteFinal')!.value,
        // examen:this.examen,
        // validador: this.validadorAsignado
      },
      // usuarioAsignado:this.usuarioAsignado,

      empresa: this.datoFicha_Data.empresa,
      ingresadoPor: this.datoFicha_Data.ingresadoPor,
      facturacion: {
        fechaFacturacion: new Date('01/01/1900 00:00:00'),
        fechaPagoFacturacion: new Date('01/01/1900 00:00:00'),
      },
      estadoFicha: this.estadoFicha_,
      //  usuarioCrea_id: this.usuario,
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

    console.log('actualiza:', this.datoFicha);

    this.fichaService.putDataFicha(this.datoFicha).subscribe((dato) => {
      if (dato.codigo === 200) {
        Swal.fire('Se Modificó con Éxito', '', 'success');
        this.dialogRef.close(1);
        return;
      }
      if (dato.codigo == 500) {
        Swal.fire(dato.mensaje.message, 'ERROR SISTEMA', 'error');
      }
    });
  }
  // Error handling

  async onBlurRutPropietario(event: any) {
    const rut = event.target.value;
    if (validateRut(rut) === true) {
      this.modificaFicha()
        .get('rutPropietario')!
        .setValue(formatRut(rut, RutFormat.DOTS_DASH));
      this.cargaPropietarioRut(
        this.modificaFicha().get('rutPropietario')!.value
      );
      this.cargaPaciente(this.modificaFicha().get('rutPropietario')!.value);
    } else if (rut == '') {
      this.cargaPropietarioRut(
        this.modificaFicha().get('rutPropietario')!.value
      );
    }
  }

  chkValidaFirma(p: any, nombreCampo: string) {
    //'idValidadorHemograma'
    console.log('p:', p);
    console.log('nombreCampo:', nombreCampo);
    if (p.nombreFirma.substr(0, 6) != 'firma_') {
      this.modificaFicha().get(nombreCampo)!.setValue('');

      Swal.fire(
        'No puede seleccionar este Validador',
        'NO CUENTA CON FIRMA',
        'error'
      );
    }
  }

  comparaSeleccionaDoctorSolicitante(v1: any, v2: any): boolean {
    return v1.nombre === v2;
  }
  comparaSeleccionaValidador(v1: any, v2: any): boolean {
    return v1._id === v2;
  }

  comparaSeleccionaUsuarioAsignado(v1: any, v2: any): boolean {
    return v1._id === v2;
  }
}
