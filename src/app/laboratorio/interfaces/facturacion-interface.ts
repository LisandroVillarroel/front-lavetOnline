
export interface IFacturaPerndienteEmpresa {
  idCliente:string;
  rutCliente:string;
  nombreFantasia:string;
  totalFactura:number;
  cantidadExamen:number;
}


export interface IFacturaPerndienteEmpresa {
  idCliente:string;
  rutCliente:string;
  nombreFantasia:string;
  fechaFacturacion:Date;
  totalFactura:number;
  cantidadExamen:number;
}

export interface IFacturaFacturada {
empresa_Id:string;
idCliente:string;
rutCliente:string;
nombreFantasia:string;
fechaFacturacion: Date;
numFactura: number;
facturaPagada: boolean;
totalFactura:number;
cantidadExamen:number;
}
