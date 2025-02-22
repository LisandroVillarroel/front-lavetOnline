import { ICliente } from '@laboratorio/modelos/cliente-modelo';

export interface IClienteInterface {
  datoClientePar: ICliente;
  empresa_Id: string;
  usuarioModifica_id: string;
}

export interface IClienteIngresoFicha {
  idCliente?: string;
  rutCliente?: string;
  razonSocial?: string;
  nombreFantasia?: string;
  correoRecepcionCliente?: string;
}
