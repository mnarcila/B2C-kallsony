import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable()
export class serviceEstadoProv {
    constructor(
        private http: HttpClient,

    ) {

    }
    private basePath = "http://10.39.1.156:8210/esb-skynet"

    consultarDHL(idOrden: number, observe?: 'body', reportProgress?: boolean): Observable<dhlResponse>;
    consultarDHL(idOrden: number, observe?: 'body', reportProgress: boolean = false): Observable<any> {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json')

        return this.http.get(`${this.basePath}/verificardhl/${encodeURIComponent(String(idOrden))}`, {
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }

    consultarServientrega(idOrden: number, observe?: 'body', reportProgress?: boolean): Observable<servientregaResponse>;
    consultarServientrega(idOrden: number, observe?: 'body', reportProgress: boolean = false): Observable<any> {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json')

        return this.http.get(`${this.basePath}/Servientrega/v1/shipmentStatus/${encodeURIComponent(String(idOrden))}`, {
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }

}
