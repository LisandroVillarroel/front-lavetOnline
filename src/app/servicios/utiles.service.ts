import { Injectable } from '@angular/core';
import { ImprimeExamenFormato1Service } from './imprimeExamen/imprimeExamenFormato1.service';
import { ImprimeExamenFormato2Service } from './imprimeExamen/imprimeExamenFormato2.service';
import { ImprimeExamenFormato3Service } from './imprimeExamen/imprimeExamenFormato3.service';
import { ImprimeExamenFormato4Service } from './imprimeExamen/imprimeExamenFormato4.service';
import { ImprimeExamenFormato5Service } from './imprimeExamen/imprimeExamenFormato5.service';
import { ImprimeExamenFormato6Service } from './imprimeExamen/imprimeExamenFormato6.service';
import { ImprimeExamenFormato7Service } from './imprimeExamen/imprimeExamenFormato7.service';
import { ImprimeExamenFormato8Service } from './imprimeExamen/imprimeExamenFormato8.service';
import { ImprimeExamenFormato9Service } from './imprimeExamen/imprimeExamenFormato9.service';
import pdfMake from 'pdfmake/build/pdfmake';
import Swal from 'sweetalert2';
import { ImprimeExamenFormatoParaVisualizarService } from './imprimeExamen/imprimeExamenFormatoParaVisualizar.service';
import { ImprimeExamenFormato10Service } from './imprimeExamen/imprimeExamenFormato10.service';
@Injectable({
  providedIn: 'root',
})
export class UtilesService {
  constructor(
    private imprimeExamenFormato1Service: ImprimeExamenFormato1Service,
    private imprimeExamenFormato2Service: ImprimeExamenFormato2Service,
    private imprimeExamenFormato3Service: ImprimeExamenFormato3Service,
    private imprimeExamenFormato4Service: ImprimeExamenFormato4Service,
    private imprimeExamenFormato5Service: ImprimeExamenFormato5Service,
    private imprimeExamenFormato6Service: ImprimeExamenFormato6Service,
    private imprimeExamenFormato7Service: ImprimeExamenFormato7Service,
    private imprimeExamenFormato8Service: ImprimeExamenFormato8Service,
    private imprimeExamenFormato9Service: ImprimeExamenFormato9Service,
    private imprimeExamenFormato10Service: ImprimeExamenFormato10Service,

    private imprimeExamenFormatoParaVisualizarService: ImprimeExamenFormatoParaVisualizarService
  ) {}

  datoResultadoExamen(formatoResultado: any, numInternoExamen: number) {
    console.log('formatoResultado:', formatoResultado);
    console.log('numInternoExamen:', numInternoExamen);
    let resultadoFormato: any;
    switch (numInternoExamen) {
      case 1:
      case 4:
      case 5:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 19:
      case 25:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32:
      case 33:
      case 34:
      case 37:
      case 39:
      case 40:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 66:
      case 67:
        resultadoFormato = formatoResultado.formato1;
        break;
      case 2:
        resultadoFormato = formatoResultado.formato2;
        break;
      case 3:
      case 7:
      case 10:
      case 11:
      case 21:
      case 22:
      case 23:
      case 27:
      case 36:
      case 38:
      case 64:
      case 65:
        resultadoFormato = formatoResultado.formato3;
        break;
      case 6:
      case 35:
      case 63:
        resultadoFormato = formatoResultado.formato4;
        break;
      case 9:
        resultadoFormato = formatoResultado.formato5;
        break;
      case 18:
        resultadoFormato = formatoResultado.formato6;
        break;
      case 20:
        resultadoFormato = formatoResultado.formato7;
        break;
      case 24:
        resultadoFormato = formatoResultado.formato8;
        break;
      case 26:
        resultadoFormato = formatoResultado.formato9;
        break;
      case 41:
        resultadoFormato = formatoResultado.formato10;
        break;
      default:
        resultadoFormato = '';
        break;
    }
    return resultadoFormato;
  }

  async generaPdf(
    cabecera: any,
    resultadoFormato: any,
    formatoNumero: number,
    abreDescarga: string
  ) {
    console.log('cabecera:', cabecera);
    console.log('resultadoFormato:', resultadoFormato);
    console.log('formatoNumero:', formatoNumero);
    console.log('abreDescarga:', abreDescarga);
    switch (formatoNumero) {
      case 1:
        this.imprimeExamenFormato1Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombrePaciente +
                  '_' +
                  cabecera.nombreExamen +
                  '_' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            // this.spinnerRellenoService.hide();
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 2:
        this.imprimeExamenFormato2Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 3:
        this.imprimeExamenFormato3Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 4:
        this.imprimeExamenFormato4Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 5:
        this.imprimeExamenFormato5Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 6:
        this.imprimeExamenFormato6Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 7:
        this.imprimeExamenFormato7Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 8:
        this.imprimeExamenFormato8Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            let pdfDefinicion_: any = pdfDefinicion;
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 9:
        console.log('paso11111');
        this.imprimeExamenFormato9Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            console.log('paso22222');
            let pdfDefinicion_: any = pdfDefinicion;
            console.log('definición', pdfDefinicion_);
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 10:
        console.log('paso11111');
        this.imprimeExamenFormato10Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            console.log('paso22222');
            let pdfDefinicion_: any = pdfDefinicion;
            console.log('definición', pdfDefinicion_);
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      case 99999:
        console.log('paso11111');
        this.imprimeExamenFormatoParaVisualizarService
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            console.log('paso22222');
            let pdfDefinicion_: any = pdfDefinicion;
            console.log('definición', pdfDefinicion_);
            const pdfDocGenerador = pdfMake.createPdf(pdfDefinicion_);
            if (abreDescarga == 'ABRE') pdfDocGenerador.open();
            else
              pdfDocGenerador.download(
                cabecera.nombreExamen +
                  '-' +
                  cabecera.nombrePaciente +
                  '-' +
                  cabecera.numeroFicha
              );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        break;
      default:
        Swal.fire('Error al descargar Formato no Existe', '', 'error');
        break;
    }
    console.log('final');
  }

  async generaPdfBlobs(
    cabecera: any,
    resultadoFormato: any,
    formatoNumero: number
  ) {
    let blobPdf: any;
    let pdfDefinicion_: any;
    switch (formatoNumero) {
      case 1:
        await this.imprimeExamenFormato1Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            // this.spinnerRellenoService.hide();
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 2:
        console.log('pdf 2');

        await this.imprimeExamenFormato2Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });

        return pdfDefinicion_;
      case 3:
        console.log('pdf 3');
        await this.imprimeExamenFormato3Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 4:
        console.log('pdf 4');
        await this.imprimeExamenFormato4Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 5:
        console.log('pdf 5');
        await this.imprimeExamenFormato5Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 6:
        console.log('pdf 6');
        await this.imprimeExamenFormato6Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 7:
        console.log('pdf 7');
        await this.imprimeExamenFormato7Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 8:
        console.log('pdf 8');
        await this.imprimeExamenFormato8Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      case 9:
        console.log('pdf 9');
        await this.imprimeExamenFormato9Service
          .generaPdf(cabecera, resultadoFormato)
          .then((pdfDefinicion) => {
            pdfDefinicion_ = pdfDefinicion;
          })
          .catch((error) => {
            console.log(error);
            Swal.fire('Error al descargar', '', 'error');
          });
        return pdfDefinicion_;
      default:
        console.log('pdf default');
        Swal.fire('Error al descargar Formato no Existe', '', 'error');
        break;
    }

    console.log('final');
  }
}
