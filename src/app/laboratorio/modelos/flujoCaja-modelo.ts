export interface IRaza {
  fechaMes:string;
  rutCliente:string;
  cuenta:string
  montoFijo:number;
  cargos:string;
  abonos:string;
  detalleTransaccion: IdetalleTransaccion[];
  usuarioCrea_id: string;
  usuarioModifica_id: string;
  empresa_Id: string;
  estado: string;
}


export interface IdetalleTransaccion {
  fechaTransaccion: string;
  metodoPago:string;  //Efectivo - Transferencia - Tarjeta
  monto:number;
  comprobante:string;
}
