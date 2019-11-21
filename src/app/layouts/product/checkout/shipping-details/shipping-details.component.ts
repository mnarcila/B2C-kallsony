import { Product } from '../../../../shared/models/product';
import { ShippingService } from '../../../../shared/services/shipping.service';
import { UserDetail, User } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { ProductosInner } from '../../../../_restProducto';
import { ToastrService } from "src/app/shared/services/toastr.service";
import { formatDate, PlatformLocation } from "@angular/common";
import { Direccion, ClienteRsType, Cliente, Clientes, ClienteService, ClientesRsType } from "src/app/_restClientes";
import { tarjetaService } from 'src/app/_tarjetaCredito/tarjeta.service';
import { environment } from 'src/environments/environment.prod';
import { BillingService } from 'src/app/shared/services/billing.service';
import { OrdenesComponent } from 'src/app/layouts/user/ordenes/ordenes.component';
import { OrdenService, OrdenM, DetalleOrdenService, DetalleOrden, OrdenRsType } from 'src/app/_restOrdenes';
import { Promise } from 'q';
import { NgxSpinnerService } from 'ngx-spinner';
import { envioPagoService } from 'src/app/_restEnvioPago/envioPago.Service';
import { TarjetaCreditoService, TarjetaCredito } from 'src/app/_restTarjetaCredito';

@Component({
	selector: 'app-shipping-details',
	templateUrl: './shipping-details.component.html',
	styleUrls: ['./shipping-details.component.scss']
})
export class ShippingDetailsComponent implements OnInit {
	userDetails: Cliente;
	rutaImagen;
	cuotas: number;
	userDetail: UserDetail;
	direcciones: Direccion[];
	direccion: Direccion = {};
	tcs: TarjetaCredito[] = [];
	listTC: TarjetaCredito = {};
	products: ProductosInner[];
	errorInUserCreate = false;
	errorMessage: any;
	tc: string;
	cvc: string;
	valorTotal: number;
	cantidadTotal: number;
	fecha: string;
	verifyResponse: Creditcardverifyresponse;
	pagoResponse: Creditcardpaymentresponse;
	items: Item[] = [];
	constructor(
		public spinner: NgxSpinnerService,
		private billingService: BillingService,
		private envioPagoApi: envioPagoService,
		private tarjetaApi: tarjetaService,
		private detalleApi: DetalleOrdenService,
		private clienteApi: ClienteService,
		private authService: AuthService,
		private tarjetaCreditoApi: TarjetaCreditoService,
		private shippingService: ShippingService,
		private productService: ProductService,
		private toastService: ToastrService,
		private ordenApi: OrdenService,
		private router: Router
	) {
		this.cantidadTotal = productService.getLocalCartProducts().length;
		console.log("cant:" + this.cantidadTotal)
		this.valorTotal = productService.getTotalPrice();
		/* Hiding products Element */
		document.getElementById('productsTab').style.display = 'none';
		document.getElementById('shippingTab').style.display = 'block';
		document.getElementById('productsTab').style.display = 'none';
		document.getElementById('resultTab').style.display = 'none';

		this.userDetail = new UserDetail();
		this.products = productService.getLocalCartProducts();
		this.userDetails = authService.getUsers();
	}
	enviarProcesoPago1(idOrden: number) {
		console.log("enviarProcesoPago1::" + idOrden);
		var items: Item[] = [];
		this.detalleApi.conultarDetalleOrdenPorIdOrden('1', '1', idOrden).subscribe(
			value => {
				value.datosBasicos.detalles.forEach(element => {
					let tmpItem: Item = {
						nombreProducto: '',
						cantidad: element.cantidad,
						idOrden: element.idOrden,
						idProducto: '' + element.idProducto,
						iddetorden: element.idDetOrden,
						valorUnidad: element.valorUnidad
					};
					items.push(tmpItem)
				});
				this.enviarProcesoPago2(idOrden, items)
			}, error => {
				console.log("error enviarprocesopago1");
				this.spinner.hide();
			}
		);
	}
	enviarProcesoPago2(idOrden: number, items: Item[]) {
		console.log("enviarProcesoPago2::" + idOrden + "|" + items);
		var nomCategoria = () => {
			switch (this.userDetails.idCategoria) {
				case 1: {
					return 'Dorado'
				}
				case 2: {
					return 'Plateado'
				}
				case 3: {
					return 'Platino'
				}
			}
		}
		let ordenTrRequest: ordenTrRequest = {
			mail: this.userDetails.email,
			nomCat: nomCategoria(),
			proveedor: '',
			nombre: this.userDetails.nombre,
			apellido: this.userDetails.apellido,
			cantidadProductos: this.cantidadTotal,
			ciudad: this.direccion.ciudad,
			direccion: this.direccion.direccion,
			estado: this.direccion.ciudad,
			pais: this.direccion.pais,
			valorTotal: this.valorTotal,
			idCategoria: this.userDetails.idCategoria,
			idOrden: idOrden,
			items: items
		};
		this.spinner.hide();
		this.envioPagoApi.enviarPago(ordenTrRequest).subscribe(
			value => {
				if (value.status.statusCode == 200) {
					console.log("final Proceso:200")

					// this.mostrarNotiicacion('Se genero el pedido correctamente', 'exito');
					this.router.navigate(['checkouts', { outlets: { checkOutlet: ['result'] } }])
				} else if (value.status.statusCode == 201) {
					console.log("final Proceso:201")
					this.spinner.hide();
					// this.mostrarNotiicacion('Se genero la solicitud correctamente', 'exito');
					// this.router.navigate(["/users/(profileOutlet:ordenes)"]);
					this.router.navigate(['checkouts', { outlets: { checkOutlet: ['result'] } }])
				} else {
					this.mostrarNotiicacion('ni 200 ni 201 :( ', 'error');
					this.router.navigate(['checkouts', { outlets: { checkOutlet: ['result'] } }])
				}
			},
			error => {
				this.spinner.hide();
			}, () => {
				this.spinner.hide();
			}
		);
	}


	crearDetalleOrden(idOrden: number, orden: OrdenM): Promise<Number> {
		let promise = Promise<Number>((resolve, reject) => {
			this.items = [];
			console.log("entro a crearDetalleOrden");
			let objetos = this.productService.getLocalCartProducts();
			objetos.forEach(element => {
				let detalle: DetalleOrden = {
					cantidad: 1,
					estado: 'ACTIVO',
					idOrden: idOrden,
					idProducto: element.idProducto,
					valorUnidad: element.valorBase,
					idProveedor: 1
				};
				console.log("detalle a insertar:")
				console.log(detalle)
				this.detalleApi.registrarDetalleOrden('1', '1', detalle).subscribe(
					value => setTimeout(() => {
						console.log(value.datosBasicos.detalles[0].idDetOrden);
						//como ya agrego la orden debemos guardar los detalles
					}, 200),
					error => {
						console.error(JSON.stringify(error))
						this.mostrarNotiicacion('Error validando Crear detalle:', 'error')
						this.spinner.hide();
					},
					() => console.log('done')
				);

			});
			//ya se realizaron las consultas devolver valores 
			// if (itemsitos.length > 0) {
			// 	console.log("resolvio la promesa");

			resolve(1);
			// } else {
			// 	console.log("rechazo la promesa");
			// 	reject(this.items);
			// }
		});


		return promise;
	}


	crearOrden() {
		console.log("entro a crearOrden ")
		let fecha_actual = formatDate(new Date(), 'dd/MM/yyyy', 'en');
		let orden: OrdenM = {
			valorTotal: this.valorTotal,
			idCliente: this.userDetails.idCliente,
			estado: 1,
			fechaAprobacion: fecha_actual,
			fechaSolicitud: fecha_actual,
			idDireccion: this.direccion.iddireccion,
			origen: 'B2C',
			cantidadProductos: this.cantidadTotal
		}

		this.ordenApi.registrarOrden('1', '1', orden).subscribe(
			value => setTimeout(() => {
				let idOrden = value.datosBasicos.ordenes[0].idOrden;
				this.productService.setIdOrden(idOrden + '');
				this.crearDetalleOrden(idOrden, orden).then((items) => {
					this.enviarProcesoPago1(idOrden);
				});
			}, 200),
			error => {
				console.error(JSON.stringify(error))
				this.mostrarNotiicacion('Error validando TC, Por favor intente mas tarde', 'error')
				this.spinner.hide();
			},
			() => console.log('done')
		);
	}

	ngOnInit() {
		this.getTarjetas(this.userDetails.idCliente + '');
		this.getDireccion(this.userDetails.usuario);
	}
	getTarjetas(idCliente: string) {
		this.tarjetaCreditoApi.consultarTarjetaDeCreditoPorCliente('1', '1', idCliente).subscribe(
			value => setTimeout(() => {
				this.tcs = [];
				value.datosBasicos.forEach(element => {
					if (element.estado == 'ACTIVO') {
						this.tcs.push(element)
					}
				});
				// this.tcs.push(...value.datosBasicos);
			}, 200),
			error => {
				this.mostrarNotiicacion(error, 'error');
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);

	}
	getDireccion(cliente: string) {

		this.direcciones = [];
		this.clienteApi.direccionesCliente('1', '1', cliente).subscribe(
			value => setTimeout(() => {
				console.log(value)
				value.direcciones.forEach(element => {
					if (element.estado == 'ACTIVO') {
						this.direcciones.push(element)
					}

				});
				// this.direcciones = value.direcciones;

			}, 200),
			error => {
				this.mostrarNotiicacion(error, 'error');
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);
	}

	realizarPagoTC(): void {
		let cabecera: CabeceraEntrada = {
			clienteId: environment.tcClientId,
			ip: '127.0.0.1'
		}
		let cuerpo: CuerpoMensajePago = {
			numeroTarjeta: this.tc,
			fechaVence: this.fecha,
			cvc: this.cvc,
			numeroCuotas: this.cuotas,
			valorPago: this.valorTotal
		}
		this.tarjetaApi.realizarCompra(cabecera, cuerpo).subscribe(
			response => {
				let res: RealizarPagoResponse = response;
				this.pagoResponse = res.creditcardpaymentresponse;
				if (res.creditcardpaymentresponse.cabaceraSalida.tipoRespuesta) {
					this.crearOrden();

				} else {
					this.mostrarNotiicacion('No se pudo realizar el pago, intente con otra TC', 'error')
					this.spinner.hide();
				}
				console.log('response is ', res.creditcardpaymentresponse);
			}, error => {
				this.mostrarNotiicacion('Error validando TC:' + error, 'error')
				this.spinner.hide();
			});
	}
	verificarTC() {
		//validar aqui
		let cabecera: CabeceraEntrada = {
			clienteId: environment.tcClientId,
			ip: '127.0.0.1'
		}
		let cuerpo: CuerpoMensajeVerificar = {
			cvc: this.cvc,
			fechaVence: this.fecha,
			numeroTarjeta: this.tc
		}
		this.tarjetaApi.verificarTS(cabecera, cuerpo).subscribe(
			(response) => {
				let res: RootVerifyResponse = response;
				this.verifyResponse = res.creditcardverifyresponse;
				if (res.creditcardverifyresponse.cabeceraSalida.tipoRespuesta) {
					this.realizarPagoTC();

				} else {
					this.mostrarNotiicacion('Error validando TC intente con una diferente.', 'error')
					this.spinner.hide();
				}
				//si todo sale bien debe ir a consultar el otro servicio 
			}, (error) => {
				this.mostrarNotiicacion('Error validando TC:' + error, 'error')
				this.spinner.hide();
			});
	}

	mostrarNotiicacion(message: string, tipo: string) {
		this.errorInUserCreate = true;
		this.errorMessage = message;
		this.errorInUserCreate = false;
		if (tipo == 'exito') {
			this.toastService.success("Exito", this.errorMessage);
		} else if (tipo == 'error') {
			this.toastService.error("Error", this.errorMessage);
		} else if (tipo == 'warn') {
			this.toastService.warning("warn", this.errorMessage);

		}

	}




	updateUserDetails(form: NgForm) {
		this.spinner.show();

		if (this.tc == null || this.tc == '') {
			this.tc = this.listTC.numtarjeta;
		}

		if ((this.tc != '' && this.tc != null) &&
			(this.direccion != null && this.direccion != null) &&
			(this.fecha != null && this.fecha != '') &&
			(this.cuotas != null && this.cuotas != 0) &&
			(this.cvc != null && this.cvc != '')
		) {
			this.verificarTC();
		} else {
			this.mostrarNotiicacion('Se deben diligenciar todos los campos', 'warn')
			this.spinner.hide();
		}

	}
}
