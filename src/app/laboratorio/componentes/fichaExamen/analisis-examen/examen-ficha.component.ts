import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { FichaService } from '@laboratorio/servicios/ficha.service';
import { UsuarioLabService } from '@laboratorio/servicios/usuario-lab.service';
import { SubeArchivoExternoComponent } from './sube-archivo-externo/sube-archivo-externo.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CommonModule } from '@angular/common';
import { AnalisisFormato1Component } from './analisis-formato1/analisis-formato1.component';
import { AnalisisFormato2Component } from './analisis-formato2/analisis-formato2.component';

const MATERIAL_MODELO = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@Component({
  selector: 'app-examen-ficha',
  templateUrl: './examen-ficha.component.html',
  styleUrls: ['./examen-ficha.component.scss'],
  imports: [MATERIAL_MODELO, CommonModule, MatTableExporterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExamenFichaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private readonly dialog = inject(MatDialog);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  dataSource = new MatTableDataSource<IFicha>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private fichaService = inject(FichaService);
  private usuarioLabService = inject(UsuarioLabService);

  tipoPermiso = '';
  displayedColumns: string[] = [
    'index',
    'fichaC.numeroFicha',
    'fichaC.cliente.nombreFantasia',
    'fichaC.nombrePaciente',
    'fichaC.examen.nombre',
    'fichaC.examen.tiempoPreparacion',
    'seguimientoEstado.fechaHora_recepcionado_crea',
    'usuarioAsignado.nombreCompleto',
    'estadoFicha',
    'opciones',
  ];

  public nombreArchivo = 'analisisExamen';
  constructor() {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
  }

  async ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = 'Registros por Página';
    await this.getDataMenuPermiso();

    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'fichaC.numeroFicha':
          return item.fichaC.numeroFicha;
        case 'fichaC.cliente.nombreFantasia':
          return item.fichaC.cliente.nombreFantasia;
        case 'fichaC.nombrePaciente':
          return item.fichaC.nombrePaciente;
        case 'fichaC.examen.nombre':
          return item.fichaC.examen.nombre;
        case 'seguimientoEstado.fechaHora_recepcionado_crea':
          return item.seguimientoEstado.fechaHora_recepcionado_crea;

        default:
          return item[property];
      }
    };
  }

  getListFicha(): void {
    this.fichaService
      .getDataFicha(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!,
        'Ingresado,Recepcionado',
        this.localStorage?.usuarioLogin._id!,
        this.tipoPermiso,
        this.localStorage?.usuarioLogin._id!
      )
      .subscribe({
        next: (res) => {
          console.log('res.data:', res.data);
          this.dataSource.data = res.data as any[];
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  analizaFicha(datoFicha: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '95%';
    dialogConfig.maxWidth = '100%';
    dialogConfig.height = '90%';
    dialogConfig.position = { top: '3%' };

    dialogConfig.data = datoFicha;

    console.log('datoFicha:', datoFicha);

    switch (datoFicha.fichaC.examen.numeroFormatoInterno) {
      case 1:
        this.dialog
          .open(AnalisisFormato1Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 2:
        this.dialog
          .open(AnalisisFormato2Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
    }
    /*
    switch (datoFicha.fichaC.examen.codigoInterno) {
      case 1:
        this.dialog
          .open(ActhComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 2:
        this.dialog
          .open(AnalisisDeFluidosComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 3:
        this.dialog
          .open(CoprocultivoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 4:
        this.dialog
          .open(CortisolComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog CortisolComponent:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 5:
        this.dialog
          .open(CreatinKinasaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 6:
        this.dialog
          .open(CultivoCorrienteAntibiogramaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 7:
        this.dialog
          .open(cultivoHongosTradicionalComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 9:
        this.dialog
          .open(DirectoDePeloYEscamaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 10:
        this.dialog
          .open(DistemperComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 11:
        this.dialog
          .open(EhrlichiaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 12:
        this.dialog
          .open(ElectrolitosComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 13:
        this.dialog
          .open(EnzimasComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 14:
        this.dialog
          .open(FenobarbitalComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 15:
        this.dialog
          .open(FructosaminaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 16:
        this.dialog
          .open(GlucosaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 17:
        this.dialog
          .open(HemoglobinaGlicosiladaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 18:
        this.dialog
          .open(HemogramaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 19:
        this.dialog
          .open(HormonasComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 20:
        this.dialog
          .open(IdentificacionDeCalculoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 21:
        this.dialog
          .open(InmunoViralFelinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 22:
        this.dialog
          .open(LeucemiaViralFelinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 23:
        this.dialog
          .open(MicoplasmaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 24:
        this.dialog
          .open(OrinaCompletaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 25:
        this.dialog
          .open(OrinaFuncionalComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 26:
        this.dialog
          .open(ParasitologicoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 27:
        this.dialog
          .open(ParvovirusComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 28:
        this.dialog
          .open(PerfilBioquimicoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 29:
        this.dialog
          .open(PerfilLipidicoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 30:
        this.dialog
          .open(PerfilRenalComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 31:
        this.dialog
          .open(ProgesteronaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 32:
        this.dialog
          .open(PruebasDeCoagulacionComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 33:
        this.dialog
          .open(SdmaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 34:
        this.dialog
          .open(TrigliceridosComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 35:
        this.dialog
          .open(UrocultivoAntibiogramaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 36:
        this.dialog
          .open(PeritonitisInfeciosaFelinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 37:
        this.dialog
          .open(ParathormonaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 38:
        this.dialog
          .open(BrucelosisComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 39:
        this.dialog
          .open(RecuentoReticulocitosComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 40:
        this.dialog
          .open(RecuentoPlaquetasComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 41:
        this.dialog
          .open(HemogramaParcialSerieBlancaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 42:
        this.dialog
          .open(HemogramaParcialSerieRojaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 43:
        this.dialog
          .open(HematocritoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 44:
        this.dialog
          .open(BilirrubinaTotalDirectaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 45:
        this.dialog
          .open(AlbuminaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 46:
        this.dialog
          .open(CalcioComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 47:
        this.dialog
          .open(ColesterolTotalComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 48:
        this.dialog
          .open(CreatinKinasaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 49:
        this.dialog
          .open(FosfatasaAlcalinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 50:
        this.dialog
          .open(FosforoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 51:
        this.dialog
          .open(NitrogenoUreicoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 52:
        this.dialog
          .open(ProteinasTotalesComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 53:
        this.dialog
          .open(TriyodotironinaT3Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 54:
        this.dialog
          .open(TriroxinaT4Component, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 55:
        this.dialog
          .open(T4LibreComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 56:
        this.dialog
          .open(TSHComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 57:
        this.dialog
          .open(EstradiolComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 58:
        this.dialog
          .open(GptAltComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 59:
        this.dialog
          .open(GotAstComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 60:
        this.dialog
          .open(GgtComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 61:
        this.dialog
          .open(PerfilHepaticoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 62:
        this.dialog
          .open(InsulinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 63:
        this.dialog
          .open(CoprocultivoAntibiogramaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 64:
        this.dialog
          .open(CitologicoComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 65:
        this.dialog
          .open(BiopsiaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 66:
        this.dialog
          .open(PruebaDeCoagulacionProtombinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      case 67:
        this.dialog
          .open(PruebaDeCoagulacionTromboplastinaComponent, dialogConfig)
          .afterClosed()
          .subscribe((data) => {
            console.log('Dialog output3333:', data);
            if (data === 1) {
              console.log('paso dato');
              this.refreshTable();
            }
          });
        break;
      default:
        //
        break;
    }
    */
  }

  private refreshTable() {
    this.getListFicha();
    this.dataSource.paginator!.pageSize = this.paginator.pageSize;
  }

  getDataMenuPermiso() {
    //Identifica que permiso tiene el usuario logueado
    this.usuarioLabService
      .getDataUsuarioIdPermiso(
        this.localStorage?.usuarioLogin._id!,
        'analisisExamenFicha'
      )
      .subscribe({
        next: (res) => {
          console.log('menu:', res.data);
          this.tipoPermiso = res.data;
          this.getListFicha();
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  subeExterno(_id: string, id_Ficha: string, numeroFicha: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.maxWidth = '100%';
    dialogConfig.height = '70%';
    dialogConfig.position = { top: '5%' };
    console.log('numero ficha:', numeroFicha);
    dialogConfig.data = {
      _id,
      id_Ficha,
      numeroFicha: numeroFicha,
      rutEmpresa: this.localStorage?.usuarioLogin.empresaConectada.rutEmpresa,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
      id_usuario: this.localStorage?.usuarioLogin._id,
    };
    this.dialog
      .open(SubeArchivoExternoComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        console.log('Dialog output3333:', data);
        if (data === 1) {
          console.log('paso dato');
          this.refreshTable();
        }
      });
  }
}
