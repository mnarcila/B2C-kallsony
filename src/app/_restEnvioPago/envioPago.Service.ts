import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable()
export class envioPagoService {
    constructor(
        private http: HttpClient,

    ) {

    }
    private basePath = "http://10.39.1.156:8210/esb-skynet"
    enviarPago(pEnvioPago: ordenTrRequest, observe?: 'body', reportProgress?: boolean): Observable<ordenTrResponse>;
    enviarPago(pEnvioPago: ordenTrRequest, observe?: 'body', reportProgress: boolean = false): Observable<any> {
        console.log("enviarPago::")
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json')

        return this.http.post(this.basePath + '/ordentr', pEnvioPago, {
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
}