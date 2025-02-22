//import { IFichaExamen, IFichaUsuarioAsignado, IFichaValidador } from "../modelo/ficha-interface";

import {
  IFichaExamen,
  IFichaUsuarioAsignado,
  IFichaValidador,
} from '@laboratorio/modelos/ficha-modelo';

export interface IFichaMuestraExamen {
  nombreCategoriaExamen: string;
  codigoInterno: number;
  nombreExamen: string;
  internoExternoBoolean: boolean;
  internoExterno: string;
  tipoExamen: string;
  chk: string;
  valid: string;
  usua: string;
}

export interface IFichaMuestraExamenModifica {
  _id: string;
  numeroFicha: string;
  codigoInterno: number;
  nombreExamen: string;
  internoExternoBoolean: boolean;
  internoExterno: string;
  chk: string;
  valid: string;
  validador: string;
  usua: string;
  usuarioAsignado: string;
}

export interface IFichaDetalleEnviaExamen {
  examen: IFichaExamen;
  usuarioAsignado: IFichaUsuarioAsignado;
  validadorAsignado: IFichaValidador;
}

export interface IFichaDetalleEnviaModificaExamen {
  _id: string;
  numeroFicha: string;
  examen: IFichaExamen;
  usuarioAsignado: IFichaUsuarioAsignado;
  validadorAsignado: IFichaValidador;
}

export interface IFichaEnvioCorreo {
  id_Ficha: string;
  nombreFantasia: string;
  nombrePaciente: string;
  cantidadExamen: number;
  cantidadSolicitadosEstados: number;
  cantidadIngresadosRecepcionadosEstados: number;
  cantidadEnviadosEstados: number;
}
