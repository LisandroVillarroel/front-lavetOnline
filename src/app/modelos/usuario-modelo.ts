import { MenuItem } from './menu-modelo';

export interface IUsuario {
  _id?: string;
  usuario?: string;
  contrasena?: string;
  rutUsuario: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  usuarioLaboratorioCliente?: IUsuarioLaboratorioCliente;
  telefono?: string;
  email?: string;
  direccion?: string;
  MenuItem?: MenuItem[];
  usuarioCrea_id?: string;
  usuarioModifica_id: string;
  estadoUsuario?: string; //Activo - Inactivo
  estado?: string;
}

export interface IUsuarioLaboratorioCliente {
  laboratorioCliente_Id: string;
  laboratorioCliente_rut: string;
  laboratorioCliente_razonSocial: string;
  laboratorioCliente_nombreFantasia: string;
  laboratorioCliente_menu_Id: string;
  laboratorioCliente_tipoEmpresa?: string;
}

export interface IUsuarioContrasena {
  _id?: string;
  contrasenaActual?: string;
  contrasena?: string;
  usuarioModifica_id?: string;
}
