export interface IOferta {
  _id?: string;
  nombre: string;
  fechaDesde: string;
  fechaHasta: string;
  montoTotal: number;
  estadoOferta: string;  //Ingresado - En Proceso -  Operativo
  examenesOferta?: IExamenesOferta[];
  empresa_Id:string;
  usuarioCrea_id?: string;
  usuarioModifica_id: string;
  estado?: string;
}

export interface IExamenesOferta {
  _id?:string;
  idExamen: string;
  nombreExamen: string;
  codigoInterno:number;
  monto:number;
}

