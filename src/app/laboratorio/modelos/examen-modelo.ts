import { IFormato1 } from './examenes/examenFormato1';
import { IFormato10 } from './examenes/examenFormato10';
import { IFormato2 } from './examenes/examenFormato2';
import { IFormato3 } from './examenes/examenFormato3';
import { IFormato4 } from './examenes/examenFormato4';
import { IFormato5 } from './examenes/examenFormato5';
import { IFormato6 } from './examenes/examenFormato6';
import { IFormato7 } from './examenes/examenFormato7';
import { IFormato8 } from './examenes/examenFormato8';
import { IFormato9 } from './examenes/examenFormato9';

export interface IExamen {
  _id?: string;
  codigoExamen: string;
  codigoInterno: number;
  numeroFormatoInterno: number;
  nombre: string;
  sigla: string;
  precio: number;
  tituloExamen: string;
  tiempoPreparacion: string;
  internoExterno: string; //Puede ser interno o Externo... Esto es para subir un Pdf externo
  categoria: string; //Categoria a la que pertenece
  tipoExamen: string; // Padre -  Hijo - Independiente
  formato?: IFormato;
  usuarioCrea_id?: string;
  usuarioModifica_id: string;
  empresa_Id?: string;
  estado?: string;
}

export interface IFormato {
  formato1?: IFormato1;
  formato2?: IFormato2;
  formato3?: IFormato3;
  formato4?: IFormato4;
  formato5?: IFormato5;
  formato6?: IFormato6;
  formato7?: IFormato7;
  formato8?: IFormato8;
  formato9?: IFormato9;
  formato10?: IFormato10;
}

/*
  export interface IResultado {
    resultado?: string;
    mensaje: string;
  }
*/
