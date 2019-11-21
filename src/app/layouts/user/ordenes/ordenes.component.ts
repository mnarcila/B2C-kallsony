import { Component, OnInit } from '@angular/core';

import { NgForm, EmailValidator } from "@angular/forms";
import { ToastrService } from "./../../../shared/services/toastr.service";
import { AuthService } from 'src/app/shared/services/auth.service';

import { ClienteRsType, Cliente, Clientes, ClienteService, ClientesRsType, Direccion } from 'src/app/_restClientes';
import { OrdenRsType, OrdenService, StatusType, DetalleOrdenService, OrdenM, DetalleOrden } from 'src/app/_restOrdenes';
import { serviceEstadoProv } from 'src/app/_estadoProv/serviceEstadoProv';
export interface Estados {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  estados: Estados[] = [
    { value: 1, viewValue: 'Registrada' },
    { value: 2, viewValue: 'Por Validar' },
    { value: 3, viewValue: 'Aprobada' },
    { value: 4, viewValue: 'Procesada' },
    { value: 5, viewValue: 'Entregada' },
    { value: 6, viewValue: 'Cancelada' },
    { value: 7, viewValue: 'Rechazada' }
  ];
  loggedUser: Cliente;
  errorInUserCreate = false;
  errorMessage: any;
  listOrdenes: OrdenM[] = [];
  listaDetalle: DetalleOrden[] = [];
  direcciones: Direccion[] = [];
  direccion: Direccion;
  estadoOrden: string;
  nuevoEstadOrden: number;
  estadoDespacho: string;
  // Enable Update Button
  renderActualizar: boolean = false;
  textoBoton: string = "Modificar";
  constructor(
    private estadoProvApi: serviceEstadoProv,
    private clienteApi: ClienteService,
    private ordenesApi: OrdenService,
    private detalleApi: DetalleOrdenService,
    private authService: AuthService,
    private toastService: ToastrService,

  ) {
  }


  ngOnInit() {
    this.estadoOrden = 'PENDIENTE';
    this.loggedUser = this.authService.getUsers();
    this.getDireccion(this.loggedUser.usuario);
    this.colsultarOrdenXCliente('' + this.loggedUser.idCliente);
  }
  traducirEstado(idEstado: number): string {
    var val = '';
    console.log("trad: " + idEstado)
    this.estados.forEach(est => {
      if (est.value == idEstado) {
        val = est.viewValue;
        return val;
      }
    });
    return val;
  }
  mostrarNotiicacion(message: string, tipo: string) {
    this.errorInUserCreate = true;
    this.errorMessage = message;
    this.errorInUserCreate = false;
    if (tipo == 'exito') {
      this.toastService.success("Exito", this.errorMessage);
    } else if (tipo == 'error') {
      this.toastService.error("Exito", this.errorMessage);
    }

  }

  colsultarOrdenXCliente(cliente: string): void {
    this.listOrdenes = [];
    if (cliente != '' && cliente != null) {

      this.ordenesApi.conultarOrdenPorCliente('1', '1', cliente).subscribe(
        value => setTimeout(() => {
          console.log(value);
          this.listOrdenes.push(...value.datosBasicos.ordenes);
        }, 200),
        error => this.mostrarNotiicacion(error, 'error'),
        () => console.log('done')
      );
    }
  }
  cancelarOrden(orden: OrdenM) {
    orden.estado = 6;
    this.ordenesApi.actualizarOrdenPorId('', '', orden.idOrden, orden).subscribe(
      value => setTimeout(() => {
        this.mostrarNotiicacion('Se cancelo su pedido con exito', 'exito'),
          this.colsultarOrdenXCliente('' + this.loggedUser.idCliente);
      }, 200),
      error => this.mostrarNotiicacion(error, 'error'),
      () => console.log('done')
    );
  }
  idOrden: number;

  verDetalle(orden: OrdenM): void {
    this.idOrden = orden.idOrden;
    //cargar la direccion del pedido 
    this.direcciones.forEach(element => {
      if (element.iddireccion == orden.idDireccion) {
        this.direccion = element;
      }
    });
    if (orden.iddespachador != null) {
      this.consultarEstadoDetalleOrden(orden.idOrden, orden).then(
        () => {
          this.actualizarEstadoOrden(this.idOrden, orden);
        }
      );
    }
    this.consultarDetalleOrden(orden.idOrden);

  }

  traducirEstadoServientrega(estado: string): string {
    var estadoServientrega
    switch (estado) {
      case "NOTIFICADO": {
        estadoServientrega = 'Pendiente'
        this.nuevoEstadOrden = 4;
        break;
      }
      case "EN TRAYECTO": {
        this.nuevoEstadOrden = 4;
        estadoServientrega = "En transito"
        break;
      }
      case "NO SE PUDO ENTREGAR": {
        this.nuevoEstadOrden = 4;
        estadoServientrega = "En transito"
        break;
      }
      case "ENTREGADO": {
        this.nuevoEstadOrden = 5;
        estadoServientrega = "Entregado"
        break;
      }
      case "CANCELADO": {
        this.nuevoEstadOrden = 6;
        estadoServientrega = "Cancelado"
        break;
      }
      default: {
        this.nuevoEstadOrden = 4;
        estadoServientrega = 'Pendiente'
        break;
      }
    }
    return estadoServientrega;
  }
  traducirEstadoDHL(estado: string): string {
    var estadoDHL
    switch (estado) {
      case "Pending": {
        estadoDHL = "Pendiente"
        this.nuevoEstadOrden = 4;
        break;
      }
      case "Collected": {
        estadoDHL = "En bodega"
        this.nuevoEstadOrden = 4;
        break;
      }
      case "In Transit": {
        estadoDHL = "En transito"
        this.nuevoEstadOrden = 4;
        break;
      }
      case "Arrived Hub": {
        estadoDHL = "En Bodega"
        this.nuevoEstadOrden = 4;
        break;
      }
      case "Out For Delivery": {
        estadoDHL = "Enviado"
        this.nuevoEstadOrden = 4;
        break;
      }
      case "Delivered": {
        estadoDHL = "Entregado"
        this.nuevoEstadOrden = 5;
        break;
      }
      case "Cancelled": {
        estadoDHL = "Cancelado"
        this.nuevoEstadOrden = 6;
        break;
      }
      default: {
        estadoDHL = "Pendiente"
        this.nuevoEstadOrden = 4;
        break;
      }
    }
    return estadoDHL;
  }

  consultarEstadoDetalleOrden(idOrden: number, orden: OrdenM): Promise<Number> {
    let promise = new Promise<Number>((resolve, reject) => {
      if (orden.iddespachador == 2) {
        this.estadoProvApi.consultarDHL(idOrden).subscribe(exito => {
          this.estadoDespacho = this.traducirEstadoDHL(exito.checkShipmentStatusResult);
        }, error => {
          this.estadoDespacho = 'N.A'
          console.log(error);
        });
      } else if (orden.iddespachador == 3) {
        this.estadoProvApi.consultarServientrega(idOrden).subscribe(exito => {
          this.estadoDespacho = this.traducirEstadoServientrega(exito.Response);
        }, error => {
          this.estadoDespacho = 'N.A'
          this.nuevoEstadOrden = 5;
          console.log(error);
        });
      } else if (orden.iddespachador == 6) {
        //DEPRISA
        this.estadoDespacho = 'ENVIADO DEPRISA'
        this.nuevoEstadOrden = 5;
      }
      else {
        this.estadoDespacho = 'Sin despachador'
        this.nuevoEstadOrden = 5;
      }
      //consultar despachadores
      //actualizar estado de la orden 

      resolve(1);
    });
    return promise;
  }

  actualizarEstadoOrden(idOrden: number, orden: OrdenM) {

    orden.estado = this.nuevoEstadOrden;
    this.estadoOrden = this.traducirEstado(orden.estado);
    this.ordenesApi.actualizarOrdenPorId('1', '1', idOrden, orden).subscribe(
      value => {
        if (value.status.statusCode == 200) {
          this.consultarDetalleOrden(idOrden);
        } else {
          console.log('Error actualizando estado')
        }
      }, error => {
        console.log('Error cargando estado' + error)
      }
    );
  }
  consultarDetalleOrden(idOrden) {
    this.listaDetalle = [];
    //consultar estado real de la orden 
    this.detalleApi.conultarDetalleOrdenPorIdOrden('1', '1', idOrden).subscribe(
      value => setTimeout(() => {
        this.listaDetalle.push(...value.datosBasicos.detalles);

      }, 200),
      error => this.mostrarNotiicacion(error, 'error'),
      () => console.log('done')
    );
  }

  getDireccion(cliente: string) {

    this.direcciones = [];
    this.clienteApi.direccionesCliente('1', '1', cliente).subscribe(
      value => setTimeout(() => {

        this.direcciones = value.direcciones;

      }, 200),
      error => {
        this.mostrarNotiicacion(error, 'error');
        console.error(JSON.stringify(error))
      },
      () => console.log('done')
    );
  }


}
