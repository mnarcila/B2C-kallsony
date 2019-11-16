import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClienteRsType, Cliente, Clientes, ClienteService, ClientesRsType } from 'src/app/_restClientes';
import { NgForm, EmailValidator } from "@angular/forms";
import { ToastrService } from "./../../../shared/services/toastr.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: 'app-user-account',
	templateUrl: './user-account.component.html',
	styleUrls: ['./user-account.component.scss']
})


export class UserAccountComponent implements OnInit {
	loggedUser: Cliente;
	errorInUserCreate = false;
	errorMessage: any;
	// Enable Update Button
	renderActualizar: boolean = false;
	textoBoton: string = "Modificar";
	constructor(
		private router: Router,
		private authService: AuthService,
		private clienteApi: ClienteService,
		private toastService: ToastrService,
	) { }
	permitirUpdate() {
		if (this.renderActualizar) {
			this.renderActualizar = false;
			this.textoBoton = "Modificar";
		} else {
			this.renderActualizar = true;
			this.textoBoton = "Cancelar";
		}
	}
	ngOnInit() {

		this.loggedUser = this.authService.getUsers();
	}

	editarDatos(userForm: NgForm) {
		var correo: string = userForm.value["emailId"];
		var clave: string = userForm.value["clave"];
		var telefono: string = userForm.value["telefono"];
		this.loggedUser.email = correo;
		this.loggedUser.password = clave;
		this.loggedUser.telefono = telefono;
 

		if ((this.loggedUser.email != null && this.loggedUser.email != '') &&
			(this.loggedUser.password != null && this.loggedUser.password != '') &&
			(this.loggedUser.telefono != null && this.loggedUser.telefono != '')) {
			this.clienteApi.actualizarClientePorId('1', '1', this.loggedUser).subscribe(
				value => setTimeout(() => {

					if (value.statusCode == 200) {

						this.errorInUserCreate = true;
						this.errorMessage = "Usuario actualizado correctamente"
						this.toastService.success("Exito", this.errorMessage);
						this.errorInUserCreate = false;
						this.errorMessage = ""
						this.permitirUpdate();
						this.router.navigate(["users"]);
					} else {

						this.errorInUserCreate = true;
						this.errorMessage = "usuario no actualizado:" + value.statusDesc;
						this.toastService.error("Error", this.errorMessage);
						this.errorInUserCreate = false;
					}

				}, 200),
				error => {

					this.errorInUserCreate = true;
					this.errorMessage = "usuario no actualizado:" + error.statusDesc;
					this.toastService.error("Error", this.errorMessage);
					this.errorInUserCreate = false;
				}

			);

		} else {
			this.errorInUserCreate = true;
			this.errorMessage = "Debe diligenciar todos los campos"
			this.toastService.warning("Warn", this.errorMessage);
			this.errorInUserCreate = false;
		}
	}
}
