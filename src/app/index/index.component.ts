import { NgModule, Component, OnInit } from "@angular/core";

import { ToastrService } from "src/app/shared/services/toastr.service";
import { AuthService } from 'src/app/shared/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

import { CampanaService, Campana } from 'src/app/_restCampana';
import { ClienteRsType, Cliente, Clientes, ClienteService, ClientesRsType } from 'src/app/_restClientes';
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment.prod";


@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"]
})
export class IndexComponent implements OnInit {
  campanas: Campana[] =  [];
  constructor(
    private campanaApi: CampanaService,
    private authService: AuthService,
    private toastService: ToastrService,
    public sanitizer: DomSanitizer,

  ) {

  }
  loggedUser: Cliente;
  errorInUserCreate = false;
  errorMessage: any;
	rutaImagen ;
  ngOnInit() {
    this.rutaImagen = environment.rutaImagen;
    this.loggedUser = this.authService.getUsers();
    this.consultarOfertas();
  }

  consultarOfertas() {
    console.log("::consultarOfertas")
    var fechaActual = new Date();
    // formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.campanaApi.campanaFechaIniciofechaFinGet(fechaActual, fechaActual).subscribe(
      value => setTimeout(() => {
        this.campanas.push(... value) 
        console.log(value);
         
      }, 200),
      error => {
        this.mostrarNotiicacion(error, 'error');
        console.error(JSON.stringify(error))
      },
      () => console.log('done')
    );
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

}
