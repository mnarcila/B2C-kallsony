import { ToastrService } from "./../../shared/services/toastr.service";
import { NgForm, EmailValidator } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "../../shared/models/user";
import { ClienteRsType, Cliente, Clientes, ClienteService, ClientesRsType } from "../../_restClientes";
import { AuthService } from "src/app/shared/services/auth.service";
import { sha256, sha224 } from 'js-sha256';
import { MailSendService, Correos } from "src/app/_restMail";
import { MailTemplate } from "src/app/_restMail/mailTemplate";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	providers: [EmailValidator]
})
export class LoginComponent implements OnInit {
	user = {
		email: "",
		password: "",
		usuario: "",
		nombre: "",
		apellido: "",
		telefono: "",
		estado: "",
		idCategoria: "",
		origen: "",
		tipoidentificacion: "",
		numidentificacion: ""
	};
	tipoIden;
	errorInUserCreate = false;
	errorMessage: any;
	createUser;
	renderModal: true;
	loginForm: FormGroup;
	registerForm: FormGroup;
	constructor(
		private clienteApi: ClienteService,
		private authService: AuthService,
		private mailSender: MailSendService,
		private toastService: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder
	) {
		this.createUser = new User();
		this.createForm();
	}
	ngOnInit() { }


	createForm() {

		this.loginForm = this.fb.group({
			emailId: ['', Validators.required],
			loginPassword: ['', Validators.required],
		});
	}

	notificarMensajeWarn(mensaje: string) {
		this.errorInUserCreate = true;
		this.errorMessage = mensaje;
		this.toastService.warning("warn", this.errorMessage);
		this.errorInUserCreate = false;
	}
	validarCliente(cliente: Cliente): boolean {
		var respuesta: boolean = true;
		if (cliente.email == '' || cliente.email == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar correo");
		}
		if (cliente.password == '' || cliente.password == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar password");
		}

		if (cliente.usuario == '' || cliente.usuario == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar usuario");
		}
		if (cliente.nombre == '' || cliente.nombre == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar nombre");
		}
		if (cliente.apellido == '' || cliente.apellido == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar apellido");
		}
		if (cliente.telefono == '' || cliente.telefono == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar telefono");
		}
		if (cliente.tipoidentificacion == '' || cliente.tipoidentificacion == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar tipo identificación");
		}
		if (cliente.numidentificacion == '' || cliente.numidentificacion == null) {
			respuesta = false;
			this.notificarMensajeWarn("Debe ingresar número Identificación");
		}


		return respuesta
	}

	/**
	 * crear un usuarito
	 * @param userForm 
	 */
	addUser(userForm: NgForm) {


		let cliente: Cliente = {};
		cliente.email = userForm.value["email"];
		cliente.password = userForm.value["password"];
		cliente.usuario = userForm.value["usuario"];
		cliente.nombre = userForm.value["nombre"];
		cliente.apellido = userForm.value["apellido"];
		cliente.telefono = userForm.value["telefono"];
		cliente.tipoidentificacion = this.tipoIden;
		cliente.numidentificacion = userForm.value["numidentificacion"];
		cliente.origen = 'B2C';
		cliente.estado = 'ACTIVO';
		cliente.idCategoria = 2;
		// console.log(userForm);

		var mailTemplate = new MailTemplate();
		if (this.validarCliente(cliente)) {
			cliente.password = sha256(userForm.value["password"]);
			this.clienteApi.registrarCliente('1', '1', cliente).subscribe(
				value => setTimeout(() => {

					if (value.status.statusCode == 200) {

						this.errorInUserCreate = true;
						this.errorMessage = "Usuario registrado correctamente"
						this.toastService.success("Exito", this.errorMessage);
						this.errorInUserCreate = false;
						let correo: Correos = {
							destinatario: cliente.email,
							mensaje: mailTemplate.getPlantillaMensaje(cliente.usuario),
							cuerpo: mailTemplate.getPlantillaTitulo()
						}
						this.mailSender.enviarCorreo('1', '1', correo).subscribe(
							value => setTimeout(() => {

							}, 280),
							error => {
								console.log("error enviado mail " + error);
							});

							// this.toastService.success("Registrado", "Usuario registrado con exito");
						setTimeout((router: Router) => {
							$("#createUserForm").modal("hide");
							this.router.navigate(["login"]);
						}, 1500);
					} else {

						this.errorInUserCreate = true;
						this.errorMessage = "usuario no creado, " + value.status.statusDesc;
						this.toastService.error("Error", this.errorMessage);
						this.errorInUserCreate = false;
					}
				}, 200),
				error => {
					console.error(JSON.stringify(error))
					this.errorInUserCreate = true;
					this.errorMessage = "usuario no creado, se presento un error pruebe mas tarde"
					this.toastService.error("Error", this.errorMessage);
					this.errorInUserCreate = false;
				},
				() => console.log('done')
			);

		}
	}

	crearForm() {
		this.errorInUserCreate = false;
	}

	consultarCredenciales(usuario, clave) {

		clave = sha256(clave);
		this.clienteApi.consultarClienteCredencial('1', '1', usuario, clave).subscribe(
			value => setTimeout(() => {
				console.log("rta");
				console.log(value);
				if (value.cliente != null) {
					console.log("correcto");

					this.authService.setUser(value.cliente);
					this.authService.setLoggedIn(true);
					this.errorMessage = "Inicia Sesión exitosamente";
					this.errorInUserCreate = true;
					this.toastService.success("Inicio Sesión", this.errorMessage);

					const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");

					setTimeout((router: Router) => {
						this.router.navigate([returnUrl || "/"]);
					}, 1500);

					this.router.navigate(["/"]);
				} else {
					console.log("no existe usuario");
					this.errorMessage = "La combinación usuario/clave es incorrecta";
					this.errorInUserCreate = true;
					this.toastService.warning("Error validación", this.errorMessage);

				}
				//   this.mostrarNotificacion('Actualización de Producto', 'se actualizo con exito', 'success');
			}, 200),
			error => {
				//   this.mostrarNotificacion('Actualización de Producto', 'se presento un error, por favor notifique al administrador', 'danger');
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);

	}


	signInWithEmail(userForm: NgForm) {
		var usuario: string = userForm.value["emailId"];
		var clave: string = userForm.value["loginPassword"];
		if ((usuario != null && usuario != '') && (clave != null && clave != '')) {
			this.consultarCredenciales(usuario, clave);
		} else {
			this.errorMessage = "debe ingresar usuario y clave";
			this.errorInUserCreate = true;
			this.toastService.warning("Error validación", this.errorMessage);

		}

	}

}
