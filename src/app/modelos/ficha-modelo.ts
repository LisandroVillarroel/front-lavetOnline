/*import { IElectrolitos } from "./examenElectrolitos";
import { IHormonas } from "./examenHormonas";
import { IPruebasDeCoagulacion } from "./examenPruebasDeCoagulacion";
import { IFichaDetalleEnviaExamen } from "../interface/FichaMuestra-interface";

import { IFormato1 } from "./examenFormato1";
import { IFormato3 } from "./examenFormato3";
import { IFormato4 } from "./examenFormato4";
import { IFormato2 } from "./examenFormato2";
import { IFormato5 } from "./examenFormato5";
import { IFormato6 } from "./examenFormato6";
import { IFormato7 } from "./examenFormato7";
import { IFormato8 } from "./examenFormato8";
import { IFormato9 } from "./examenFormato9";
import { IFormato10 } from "./examenFormato10";


export interface IFicha {
  _id?: string;
  fichaC:{
    id_Ficha?: string;
    numeroFicha?: string;
    cliente?:IFichaCliente;
    rutPropietario?: string;
    nombrePropietario?: string;
    nombrePaciente?: string;
    edadPaciente?: string;
    especie?: IFichaEspecie;
    raza?: IFichaRaza;
    sexo?: string;
    doctorSolicitante?:IFichaDoctorSolicitante;
    examen?:IFichaExamen;
    validador?:IFichaValidador;
    correoClienteFinal?: string;
  },
  formatoResultado?:{
   // examen:IFichaExamen;

    //hemograma?:IHemograma;
    //perfilBioquimico?:IPerfilBioquimico;
    pruebasDeCoagulacion?: IPruebasDeCoagulacion;
   // acth?: IActh;
    //analisisDeFluidos?: IAnalisisDeFluidos,
    //coprocultivo?: ICoprocultivo,
    //cortisol?: ICortisol,
    //creatinKinasa?: ICreatinKinasa,
    //cultivoCorrienteAntibiograma?: ICultivoCorrienteAntibiograma,
    //cultivoMicologico?: ICultivoMicologico,  // CULTIVO DE HONGOS TRADICIONAL
    //cultivoMicrobiologico?: ICultivoMicrobiologico,
    //distemper?: IDistemper,
    //ehrlichia?: IEhrlichia,
    electrolitos?: IElectrolitos,
    //enzimas?: IEnzimas,
    //directoDePeloYEscama?: IDirectoDePeloYEscama,
    //fenobarbital?: IFenobarbital,
    //fructosamina?: IFructosamina,
    //glucosa?: IGlucosa,
    //hemoglobinaGlicosilada?: IHemoglobinaGlicosilada,
    //hormonas?: IHormonas
    //identificacionDeCalculo?: IIdentificacionDeCalculo,
    //inmunoViralFelina?: IInmunoViralFelina
    //leucemiaViralFelina?: ILeucemiaViralFelina,
    //micoplasma?:IMicoplasma,
    //orinaCompleta?: IOrinaCompleta,
    //orinaFuncional?: IOrinaFuncional,
    //parasitologico?: IParasitologico,
    //parvovirus?: IParvovirus,
    //perfilLipidico?: IPerfilLipidico,
    //perfilRenal?: IPerfilRenal,
    //progesterona?: IProgesterona,
    //sdma?: ISdma,
    //trigliceridos?: ITrigliceridos,
    //urocultivo?: IUrocultivo,
    //brucelosis?:IBrucelosis,
    //parathormona?:IParathormona,
    //calcio?:ICalcio,
    formato1?:IFormato1,
    formato2?:IFormato2,
    formato3?:IFormato3,
    formato4?:IFormato4,
    formato5?:IFormato5,
    formato6?:IFormato6,
    formato7?:IFormato7,
    formato8?:IFormato8,
    formato9?:IFormato9,
    formato10?:IFormato10
  };
  datoArchivo?:IdatoArchivo;

  usuarioAsignado?:IFichaUsuarioAsignado;
  empresa?: IFichaEmpresa;
  ingresadoPor?:IIngresadoPor;
  facturacion?:IFacturacion;
  estadoFicha?:string;   // Laboratorio: Ingresado- Recepcionado(Después que lo Solicita Veterinario)- Analizado- Enviado  -  Veterinario: Solicitado

  seguimientoEstado: ISeguimientoEstado;
  usuarioCrea_id?: string;
  usuarioModifica_id?: string;
  estado?: string;

  datoFichaDetalleEnviaExamen?:IFichaDetalleEnviaExamen[];   //Este solo es para enviar el detalle de los exámenes seleccionados en Ficha

}

export interface ISeguimientoEstado{
  usuarioIngresado_crea_id?:string;
  usuarioIngresado_modifica_id?:string;
  fechaHora_ingresado_crea: Date;
  fechaHora_ingresado_modifica: Date;

  usuarioRecepcionado_crea_id: string;
  fechaHora_recepcionado_crea: Date;

  usuarioRecepcionado_modifica_id: string;
  fechaHora_recepcionado_modifica: Date;

  usuarioAnalizado_id: string;
  fechaHora_analizado: Date;

  usuarioEnviado_id: string;
  fechaHora_enviado: Date;
}

export interface IFichaCliente {
  idCliente?:string;
  rutCliente?: string;
  razonSocial?: string;
  nombreFantasia?: string;
  correoRecepcionCliente?:string;
}

export interface IFichaExamen {
  idExamen:string;
  codigoExamen: string;
  codigoInterno: string;
  numeroFormatoInterno: number;
  nombre: string;
  tituloExamen: string;
  precioValor: string;
  precioValorFinal?: string;
  tiempoPreparacion: string;
  internoExterno:string; //Puede ser interno o Externo... Esto es para subir un Pdf externo
  categoria: string; //Categoria a la que pertenece
  tipoExamen: string;// Padre -  Hijo - Independiente
  examenHijo:IExamenHijo[];
}

export interface IExamenHijo {
  idExamen:string;
  codigoInterno: string;
  nombre: string;
  precioValor: string;
}


export interface IFichaEspecie {
  idEspecie:string;
  nombre: string;
}

export interface IFichaRaza {
  idRaza:string;
  nombre: string;
}

export interface IFichaDoctorSolicitante {
  idDoctorSolicitante: string;
  nombreDoctorSolicitante: string;
}

export interface IdatoArchivo {
  nombreArchivo:string;
  archivo64:string;
}

export interface IFichaUsuarioAsignado {
    idUsuario?: string;
    usuario?: string;
    rutUsuario?: string;
    nombreCompleto?: string;
}


export interface IFichaEmpresa {
  empresa_Id:string;
  rutEmpresa: string;
  razonSocial: string;
  nombreFantasia: string;
  nombreLogo?: string;
  nombreLogoCabeceraExamen:string,
  headerLeyenda:string,
  footerExamen: string;
}


export interface IIngresadoPor {
  tipoEmpresa?:string;            //Administrador, Laboratorio, Cliente
  idIngreso?:string;
  rutIngreso?: string;
  razonSocial?: string;
  nombreFantasia?: string;
}


export interface IFichaValidador{
  idValidador: string;
  rutValidador: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono:string;
  profesion:string;
  nombreFirma?:string;
}

export interface IFacturacion{
estadoFacturacion?:string; //'AFacturacion - Facturado - Pendiente
numFactura?:number;
fechaFacturacion?:Date;
fechaAsignaFactura?:Date;
usuarioAsigna_id?:String;
fechaPagoFacturacion?:Date;
facturaPagada?:string; // No-SI
}
*/
