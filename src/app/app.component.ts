import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import MenuMatComponent from '@componentes/menu-mat/menu-mat.component';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from './autentica/interface/loginInterface';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MenuMatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'front-lavetOnline';

  public _storage = inject(StorageService);

  public localStorage_ = this._storage.get<loginInterface>('sesion');
  ngOnInit() {
    console.log('Inicio00000', this.localStorage_);
  }
}
