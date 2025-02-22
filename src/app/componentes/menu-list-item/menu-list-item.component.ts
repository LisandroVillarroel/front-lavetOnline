import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

import { MenuItem } from './../../modelos/menu-modelo';

import { MenuService } from 'src/app/servicios/menu.service';
import { NgClass, NgStyle } from '@angular/common';
import { AutenticaService } from '@autentica/servicios/autentica.service';

const MATERIAL_MODELO = [MatIconModule];

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  imports: [MATERIAL_MODELO, NgClass, NgStyle, MenuListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class MenuListItemComponent implements OnInit {
  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  /*@Input()
  item!: MenuItem;
  @Input()
  depth!: number;
*/
  public item = input.required<MenuItem>();
  public depth = input(0);
  /*
  @Output() tituloModuloF = new EventEmitter();
  @Output() tituloModuloF2 = new EventEmitter();
  @Output() tituloModuloF3 = new EventEmitter();
*/

  tituloModuloF = output<string>();
  tituloModuloF2 = output<string>();
  tituloModuloF3 = output<string>();

  private _autenticaService = inject(AutenticaService);
  private navService = inject(MenuService);
  public router = inject(Router);
  /*constructor(public router: Router, private navService: MenuService,
    private _autenticaServicez: AuthenticationService,
) {
  if (this.depth === undefined) {
    this.depth = 0;
  }

  console.log('menuuuuuu',this.item)

}
*/
  ngOnInit() {
    console.log('menuuuuuu', this.item());
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item().route && url) {
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        this.expanded = url.indexOf(`/${this.item().route}`) === 0;
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }

  onItemSelected($event: any, item_: MenuItem) {
    console.log('paso00000', item_.route);
    if (item_.route?.toUpperCase() == 'Cerrar'.toUpperCase()) {
      console.log('paso1111');
      this._autenticaService.logout();
      this.router.navigate(['/login']);
    } else {
      if (!item_.children || !item_.children?.length) {
        // this.router.navigate([item.route]);
        this.tituloModuloF.emit('  -  ( ' + item_.displayName + ' )');
        this.tituloModuloF2.emit('  -  ( ' + item_.displayName + ' )');
        console.log('item_.route:', item_.route);
        this.router.navigate(['' + item_.route]);
        //  this.navService.closeNav();
      }
      if (item_.children && item_.children?.length) {
        this.tituloModuloF.emit('  -  ( ' + item_.displayName + ' )');
        this.tituloModuloF2.emit('  -  ( ' + item_.displayName + ' )');
        this.expanded = !this.expanded;
      }
    }
  }

  traeTituloModulo(valor: any) {
    this.tituloModuloF.emit(valor);
    this.tituloModuloF2.emit(valor);
  }

  traeTituloModulo2(valor: any) {
    this.tituloModuloF.emit(valor);
  }

  getMenuChildren() {
    return this.item().children?.filter((item) => item.selected === true);
  }
}
