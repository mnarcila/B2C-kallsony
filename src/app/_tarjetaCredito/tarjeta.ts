//VERIFICAR TARJETA DE CREDITO
interface RootVerifyRequest {
    creditcardverifyrequest: Creditcardverifyrequest;
  }
  
  interface Creditcardverifyrequest {
    cabeceraEntrada: CabeceraEntrada;
    cuerpoMensaje: CuerpoMensajeVerificar;
  }
  
  interface CuerpoMensajeVerificar {
    numeroTarjeta: string;
    cvc: string;
    fechaVence: string;
  }
  
  interface CabeceraEntrada {
    ip: string;
    clienteId: string;
  }


  interface RootVerifyResponse {
  creditcardverifyresponse: Creditcardverifyresponse;
}

interface Creditcardverifyresponse {
  cabeceraSalida: CabeceraSalida;
}

interface CabeceraSalida {
  tipoRespuesta: boolean;
  error: errorUno;
}

interface errorUno {
  codigoError: string;
  tipoError: string;
}