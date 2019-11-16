import { Component, OnInit } from '@angular/core';
import { Direccion, ClienteRsType, Cliente, Clientes, ClienteService, ClientesRsType } from "../../../_restClientes";
import { ToastrService } from "./../../../shared/services/toastr.service";
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm, EmailValidator } from "@angular/forms";
import { TarjetaCreditoService, TarjetaCredito, TarjetaCreditoRsType } from 'src/app/_restTarjetaCredito';
import { formatDate } from '@angular/common';

export interface ListaPaises {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.scss']
})
export class DireccionesComponent implements OnInit {
  direcciones: Direccion[];
  direccion: Direccion = {};
  loggedUser: Cliente;
  errorInUserCreate = false;
  errorMessage: any;
  crearDireccion = false;
  crearTarjeta = false;
  tcs: TarjetaCredito[] = [];
  tc: TarjetaCredito;
  franquicia: string;
  franquicias: ListaPaises[] = [
    { value: "MC", viewValue: 'MASTER CARD' },
    { value: "VISA", viewValue: 'VISA' },
    { value: "AE", viewValue: 'AMERICAN EXPRESS' },
  ];
  listaPaises: ListaPaises[] = [
    { value: "CO", viewValue: 'COLOMBIA' },
    { value: "VE", viewValue: 'VENEZUELA' },
    { value: "BR", viewValue: 'BRASIL' },
    { value: "PE", viewValue: 'PERU' },
    { value: "EC", viewValue: 'ECUADOR' },
    { value: "BO", viewValue: 'BOLIVIA' },
  ];
  constructor(
    private tarjetaCreditoApi: TarjetaCreditoService,
    private clienteApi: ClienteService,
    private toastService: ToastrService,
    private authService: AuthService,

  ) { }
  crearDatos(userForm: NgForm) {

    this.direccion.idcliente = this.loggedUser.idCliente;
    this.direccion.estado = 'ACTIVO'

    if ((this.direccion.direccion != null && this.direccion.direccion != '') &&
      (this.direccion.pais != null && this.direccion.pais != '') &&
      (this.direccion.ciudad != null && this.direccion.ciudad != '') &&
      (this.direccion.tipodireccion != null && this.direccion.tipodireccion != '')) {

      this.clienteApi.registrarDireccion('1', '1', this.direccion).subscribe(
        value => setTimeout(() => {

          this.mostrarNotiicacion('Creado con exito', 'exito');
          this.getDireccion(this.loggedUser.usuario);
          this.crearDireccion = false;
        }, 200),
        error => {
          this.mostrarNotiicacion(error, 'error');
          console.error(JSON.stringify(error))
        },
        () => console.log('done')
      );
    } else {
      this.mostrarNotiicacion('Debe diligenciar todos los campos de la dirección', 'warn');
    }
  }
  crearTarjetaEvent(userForm: NgForm) {

    this.tc.idcliente = this.loggedUser.idCliente;
    this.tc.fechacreacion = formatDate(new Date(), 'dd-MM-yyyy', 'en')
    this.tc.estado = 'ACTIVO';
    this.tc.franquicia = this.franquicia;

    if ((this.tc.franquicia != null && this.tc.franquicia != '') &&
      (this.tc.numtarjeta != null && this.tc.numtarjeta != '')
    ) {

      this.tarjetaCreditoApi.registrarTarjetaCredito('1', '1', this.tc).subscribe(
        value => setTimeout(() => {
          this.mostrarNotiicacion('Creado con exito', 'exito');
          this.getTarjetas(this.loggedUser.idCliente + '');
          this.crearTarjeta = false;
        }, 200),
        error => {
          this.mostrarNotiicacion(error, 'error');
          console.error(JSON.stringify(error))
        },
        () => console.log('done')
      );
    }else{
      this.mostrarNotiicacion('Debe diligenciar todos los campos de la tarjeta', 'warn');
    }
  }


  mostrarNotiicacion(message: string, tipo: string) {
    this.errorInUserCreate = true;
    this.errorMessage = message;
    this.errorInUserCreate = false;
    if (tipo == 'exito') {
      this.toastService.success("Exito", this.errorMessage);
    } else if (tipo == 'error') {
      this.toastService.error("Err", this.errorMessage);
    } else if (tipo == 'warn') {
      this.toastService.warning("Warn", this.errorMessage);
    }

  }
  ngOnInit() {
    this.loggedUser = this.authService.getUsers();
    this.getDireccion(this.loggedUser.usuario);
    this.getTarjetas(this.loggedUser.idCliente + "");
    this.tc = {}
  }
  agregarDir() {
    this.crearDireccion = !this.crearDireccion;
  }

  agregarTC() {
    this.crearTarjeta = !this.crearTarjeta;
  }
  eliminarTarjeta(tc: TarjetaCredito) {
    tc.estado = 'INACTIVO';
    this.tarjetaCreditoApi.actualizarTarjetaDeCredito('1', '1', tc).subscribe(
      value => setTimeout(() => {
        this.mostrarNotiicacion('Modificado con exito', 'exito');
        this.getTarjetas(this.loggedUser.idCliente + '');
      }, 200),
      error => {
        this.errorInUserCreate = true;
        this.errorMessage = error;
        this.errorInUserCreate = false;
        this.toastService.success("Exito", this.errorMessage);
        console.error(JSON.stringify(error))
      },
      () => console.log('done')
    );
  }

  eliminarDireccion(dir: Direccion) {
    dir.estado = 'INACTIVO';
    this.clienteApi.actualizarDireccion('1', '1', dir.idcliente, dir.iddireccion, dir).subscribe(
      value => setTimeout(() => {

        this.mostrarNotiicacion('Modificado con exito', 'exito');
        this.getDireccion(this.loggedUser.usuario);
      }, 200),
      error => {
        this.errorInUserCreate = true;
        this.errorMessage = error;
        this.errorInUserCreate = false;
        this.toastService.success("Exito", this.errorMessage);
        console.error(JSON.stringify(error))
      },
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

  getTarjetas(idCliente: string) {
    this.tarjetaCreditoApi.consultarTarjetaDeCreditoPorCliente('1', '1', idCliente).subscribe(
      value => setTimeout(() => {
        this.tcs = [];
        this.tcs.push(...value.datosBasicos);
      }, 200),
      error => {
        this.mostrarNotiicacion(error, 'error');
        console.error(JSON.stringify(error))
      },
      () => console.log('done')
    );

  }
}
