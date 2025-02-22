export interface IEmpresa {
  _id?: string;
  rutEmpresa: string;
  razonSocial: string;
  nombreFantasia: string;
  direccion: string;
  nombreContacto: string;
  telefono:string;
  tipoEmpresa:string;   //Administrador-Laboratorio-Cliente
  menu_Id: string;
  email:string;
  correoRecepcionSolicitud: string;
  envioEmail?:IEmail;
  nombreLogo?:string;
  nombreLogoCabeceraExamen:string;
  headerLeyenda:string;
  footerExamen?:string;
  usuarioCrea_id?: string;
  usuarioModifica_id: string;
  estado?: string;
}

export interface IEmail {
  emailEnvio?: string;
  password?:string;
  nombreDesde?:string;
  asunto?: string;
  tituloCuerpo?:string;
  tituloCuerpoMedio?:string;
  tituloCuerpoPie?:string;
}
