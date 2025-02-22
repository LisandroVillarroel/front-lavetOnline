export interface IFormato4 {
  resultadoTitulo:string,
  resultado:IResultadoFormato4[];
  antibiogramaTitulo: string; //Este me permite saber si tiene o no, con la palabra "NO PROCEDE" se sabe si no tiene
  resultadoAntiBiograma:IResultadoAntiBiogramaFormato4[];
}

export interface IResultadoFormato4 {
  nombre: string;
  resultado: string;
  flagNegrilla:boolean;
}

export interface IResultadoAntiBiogramaFormato4 {
  nombre: string;
  resultado: string;
  flagNegrilla:boolean;
}
