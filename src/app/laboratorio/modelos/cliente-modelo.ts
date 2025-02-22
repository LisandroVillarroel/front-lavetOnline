export interface ICliente {
  _id?: string;
  rutCliente?: string;
  razonSocial?: string;
  nombreFantasia?: string;
  direccion?: string;
  telefono?: string;
  email: string;
  nombreContacto: string;
  usuarioCrea_id?: string;
  usuarioModifica_id: string;
  empresa?: IClienteEmpresa[];
  envioEmail?:IEmailCliente;
  tipoEmpresa?: string;
  emailRecepcionExamenCliente?: string;
  nombreLogo?:string;
  estado?: string;
}

export interface IClienteEmpresa {
  _id?: string;
  empresa_Id?: string
  menu_Id?: string;
  usuarioModifica_id?: string;
  fechaHora_modifica?: string;
  estado?: string;
}

export interface IEmailCliente {
  asunto?: string;
  tituloCuerpo?:string;
}

