export interface loginInterface {
  usuarioLogin: {
    _id: string,
    usuario: string,
    contrasena: string,
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    empresaConectada:empresaConectadaI,
    empresa:UsuarioEmpresaI,
    accessToken: string
  };
}

export interface empresaConectadaI {
  empresa_Id: string,
  rutEmpresa: string,
  razonSocial: string,
  nombreFantasia: string,
  menu_Id: string,
  tipoEmpresa: string // Administrador, Cliente, Laboratorio
}

export interface UsuarioEmpresaI {
  empresa_Id:string;
  rutEmpresa: string;
  razonSocial: string;
  nombrefatasia: string;

}
