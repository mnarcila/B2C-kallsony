import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable()
export class tarjetaService {
    constructor(
        private http: HttpClient,

    ) {

    }
    private basePath = "http://10.39.1.156:8210/esb-skynet"
    
    verificarTS(cabecera: CabeceraEntrada, cuerpo: CuerpoMensajeVerificar, observe?: 'body', reportProgress?: boolean): Observable<RootVerifyResponse>;
    verificarTS(cabecera: CabeceraEntrada, cuerpo: CuerpoMensajeVerificar, observe?: 'body', reportProgress: boolean = false): Observable<any> {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json')


        let verify: RootVerifyRequest = {
            creditcardverifyrequest: {
                cabeceraEntrada: cabecera,
                cuerpoMensaje: cuerpo
            }
        }
        return this.http.post(this.basePath + '/verifytc', verify, {
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }

    realizarCompra(cabecera: CabeceraEntrada, cuerpo: CuerpoMensajePago, observe?: 'body', reportProgress?: boolean): Observable<RealizarPagoResponse>;
    realizarCompra(cabecera: CabeceraEntrada, cuerpo: CuerpoMensajePago, observe?: 'body', reportProgress: boolean = false): Observable<any> {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json')

        let pago: RealizarPagoRequest = {
            creditcardpaymentrequest: {
                cabeceraEntrada: cabecera,
                cuerpoMensaje: cuerpo

            }
        }
        console.log("::realizarCompra")
        console.log(pago);
        return this.http.post(this.basePath + '/realizarpagotc', pago, {
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
}
