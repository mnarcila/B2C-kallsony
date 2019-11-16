
// REALIZAR PAGO

interface RealizarPagoRequest {
    creditcardpaymentrequest: Creditcardpaymentrequest;
  }
  
  interface Creditcardpaymentrequest {
    cabeceraEntrada: CabeceraEntrada;
    cuerpoMensaje: CuerpoMensajePago;
  }
  
  interface CuerpoMensajePago {
    numeroTarjeta: string;
    cvc: string;
    fechaVence: string;
    valorPago: number;
    numeroCuotas: number;
  }
  
  interface CabeceraEntrada {
    ip: string;
    clienteId: string;
  }
  
  interface RealizarPagoResponse {
    creditcardpaymentresponse: Creditcardpaymentresponse;
  }
  
  interface Creditcardpaymentresponse {
    cabaceraSalida: CabaceraSalida;
    cuerpoMensaje?: any;
  }
  
  interface CabaceraSalida {
    tipoRespuesta: boolean;
    error: errorTarjeta;
  }
  
  interface errorTarjeta {
    codigoError: string;
    tipoError: string;
  }
  