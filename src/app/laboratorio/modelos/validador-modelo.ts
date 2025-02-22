export interface IValidador {
  _id?: string;
  rutValidador: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono:string;
  profesion:string;
  empresa_Id?: string;
  nombreFirma?:string;
  usuarioCrea_id?: string;
  usuarioModifica_id: string;
  estado?: string;
}


export interface IResultado {
  resultado?: string;
  mensaje: string;
}