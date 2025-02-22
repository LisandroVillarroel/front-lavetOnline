import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  model,
  OnInit,
} from '@angular/core';

import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MenuService } from 'src/app/servicios/menu.service';
import { IUsuario } from '@modelos/usuario-modelo';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
import { MenuItem } from '@modelos/menu-modelo';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NOOP_TREE_KEY_MANAGER_FACTORY_PROVIDER } from '@angular/cdk/a11y';
import { SpinnerService } from '@shared/spinner/spinner.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */

/**
 * @title Tree with nested nodes
 */

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
  MatStepperModule,
];

@Component({
    selector: 'app-consulta-perfil-usuario',
    templateUrl: './consulta-perfil-usuario.component.html',
    styleUrls: ['./consulta-perfil-usuario.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    providers: [NOOP_TREE_KEY_MANAGER_FACTORY_PROVIDER],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaPerfilUsuarioComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private menuService = inject(MenuService);
  private _formBuilder = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<ConsultaPerfilUsuarioComponent>);
  readonly data = inject<IUsuario>(MAT_DIALOG_DATA);
  public datoUsuarioPar = model(this.data);

  tipoPermiso = new FormControl('', Validators.required);

  menuItems!: MenuItem[];
  menuItemsResultado!: MenuItem[];
  menuItemsResultadoFiltro!: MenuItem[];

  //datoUsuarioPar!: IUsuario;
  //datoUsuario!: IUsuario;

  /*tree*/
  treeControl = new NestedTreeControl<MenuItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<MenuItem>();
  /*fin tree*/

  secondFormGroup!: FormGroup;

  constructor() {
    //  this.datoUsuarioPar = data;
    //  console.log('data:',this.datoUsuarioPar);
    /* this.authenticationService.currentUsuario.subscribe(x => this.currentUsuario = x);
    if (this.authenticationService.getCurrentUser() != null) {
          this.currentUsuario.usuarioDato = this.authenticationService.getCurrentUser() ;
    }
          */
    //Carga Menu
    /*
    this.dataSource.data = this.data.MenuItem; //TREE_DATA;
    Object.keys(this.dataSource.data).forEach(x => {
      this.setParent(this.dataSource.data[x as any], null);
    });
    */
    //Fin Carga Menu
  }

  ngOnInit() {
    this.getDataMenu();
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  /*tree*/

  hasChild = (_: number, node: MenuItem) =>
    !!node.children && node.children.length > 0;
  setParent(data: any, parent: any) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach((x: any) => {
        this.setParent(x, data);
      });
    }
  }

  checkAllParents(node: any) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every((child) => child.selected);
      //    node.parent.tipoPermiso = descendants.every(child => child.tipoPermiso);
      node.parent.indeterminate = descendants.some((child) => child.selected);
      this.checkAllParents(node.parent);
    } else {
      const descendants = this.treeControl.getDescendants(node);
      node.selected = descendants.every((child) => child.selected);
      //  node.tipoPermiso = descendants.every(child => child.tipoPermiso);
      node.indeterminate = descendants.some((child) => child.selected);
    }
  }

  todoItemSelectionToggle(
    checked: any,
    node: { selected: any; children: any[] }
  ) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach((x) => {
        this.todoItemSelectionToggle(checked, x);
      });
    }
    this.checkAllParents(node);
  }

  tipoPermisoAllParents(node: any) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.tipoPermiso = descendants.every((child) => child.tipoPermiso);
      this.tipoPermisoAllParents(node.parent);
    } else {
      const descendants = this.treeControl.getDescendants(node);
      node.tipoPermiso = descendants.every((child) => child.tipoPermiso);
    }
  }

  /*Fin tree*/

  getDataMenu() {
    let flag = 0;
    console.log(
      'idmenu:',
      this.data.usuarioLaboratorioCliente?.laboratorioCliente_menu_Id
    );
    this.menuService
      .getDataMenu(
        this.data.usuarioLaboratorioCliente!.laboratorioCliente_menu_Id
      )
      .subscribe({
        next: (res) => {
          this.menuItems = res.data[0].MenuItem;
          //this.flag=true;
          for (let b = 0; b < this.menuItems.length; b++) {
            if (
              this.menuItems[b].children &&
              this.menuItems[b].children!.length
            ) {
              //Pregunta si tiene hijos
              for (let c = 0; c < this.menuItems[b].children!.length; c++) {
                // Recorre menu originl Hijos
                flag = 0;

                for (let d = 0; d < this.data.MenuItem!.length; d++) {
                  // Recorre Usuario
                  if (
                    this.data.MenuItem![d].children &&
                    this.data.MenuItem![d].children!.length
                  ) {
                    //<Pregunta si Menu Usuario tiene Hijos

                    for (
                      let e = 0;
                      e < this.data.MenuItem![d].children!.length;
                      e++
                    ) {
                      //Recorre Usuario Hijo
                      if (
                        this.data.MenuItem![d].children![e]._id ==
                        this.menuItems[b].children![c]._id
                      ) {
                        this.menuItems[b].children![c].selected =
                          this.data.MenuItem![d].children![e].selected;
                        this.menuItems[b].children![c].tipoPermiso =
                          this.data.MenuItem![d].children![e].tipoPermiso;

                        if (
                          this.data.MenuItem![d].children![e].selected === true
                        ) {
                          this.menuItems[b].selected =
                            this.data.MenuItem![d].children![e].selected;
                        }
                        flag = 1;
                        break;
                      }
                    }
                    if (flag == 1) {
                      break;
                    }
                  }
                }
              }
            } else {
              this.menuItemsResultadoFiltro = this.data.MenuItem!.filter(
                (item: any) => item._id === this.menuItems[b]._id
              );
              this.menuItems[b].selected =
                this.menuItemsResultadoFiltro[0].selected;
              this.menuItems[b].tipoPermiso =
                this.menuItemsResultadoFiltro[0].tipoPermiso;

              /*if (this.menuItems[a].codigoServicio.toUpperCase() === this.menuItems[b].route.toUpperCase().replace("/0","").replace("/1","")){
            this.fillerNav[b].disabled=false;
          }*/
            }
          }
          this.dataSource.data = this.menuItems; //TREE_DATA;
          Object.keys(this.dataSource.data).forEach((x) => {
            this.setParent(this.dataSource.data[x as any], null);
          });

          this.spinnerService.esconder();
        },

        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error.error.error, 'error');
        },
      });
  }
}
