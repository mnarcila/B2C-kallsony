import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoriaService } from "../../../_restCategoria";
import { ProductosInner, ProductoService, ProductoRsType } from "../../../_restProducto";
import { environment } from 'src/environments/environment.prod';
import { formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;
export interface Categorias {
	value: number;
	viewValue: string;
}
@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

	productList: ProductosInner[];
	loading = false;
	producto: ProductosInner;
	productoRsType: ProductoRsType;
	rutaImagen;
	selectedBrand: 'All';
	categoriasMap: Map<number, String>;
	categoriasArray: Categorias[] = [];
	selCategoria: number;
	tipoBusqueda: number;
	conBusqueda: string;

	errorInUserCreate = false;
	errorMessage: any;

	page = 1;
	constructor(

		public spinner: NgxSpinnerService,
		public sanitizer: DomSanitizer,
		private categoriaApi: CategoriaService,
		private productoApi: ProductoService,
		public authService: AuthService,
		private productService: ProductService,
		private toastService: ToastrService,

	) { }

	ngOnInit() {
		this.rutaImagen = environment.rutaImagen;
		this.cargarCategoria();
		this.consultarProductoEspec();
	}

	consultarProductoNombre(busqueda: string) {
		this.productoApi.conultarProductoPorNombre('1', '1', busqueda).subscribe(
			value => setTimeout(() => {
				this.productList = [];
				this.productoRsType = value;
				this.productList.push(...value.productos);
				this.spinner.hide();
			}, 200),
			error => {
				this.mostrarNotiicacion('Se genero un error interno', 'error');
				console.error(JSON.stringify(error));
			},
			() => console.log('done')
		);
	}

	consultarProductoDescripcion(busqueda: string) {
		this.productoApi.conultarProductoPorDescripcion('1', '1', busqueda).subscribe(
			value => setTimeout(() => {
				this.productList = [];
				console.log("respuesta[" + value.productos.length + "]");
				this.productoRsType = value;
				if (value.productos.length > 0) {
					this.productList.push(...value.productos);
				}
				this.spinner.hide();
			}, 200),
			error => {
				this.mostrarNotiicacion('Se genero un error interno', 'error');
				console.error(JSON.stringify(error));
			},
			() => console.log('done')
		);
	}

	consultarProductoId(idProducto: number) {
		this.productoApi.conultarProductoPorId('1', '1', idProducto).subscribe(
			value => setTimeout(() => {
				this.productList = [];
				this.productoRsType = value;
				this.productList.push(...value.productos);
				this.spinner.hide();
			}, 200),
			error => {
				this.mostrarNotiicacion('Se genero un error interno', 'error');
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);
	}

	consultarProductoCategoria(idCategoria: number) {
		console.log(idCategoria);
		this.productoApi.consultarProductoPorCategoria('1', '1', idCategoria).subscribe(
			value => setTimeout(() => {
				this.productList = [];
				this.productoRsType = value;
				if (value.productos.length > 0) {
					this.productList.push(...value.productos);
				}
				this.spinner.hide();
			}, 200),
			error => {
				this.mostrarNotiicacion('Se genero un error interno', 'error');
				this.spinner.hide();
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);
	}

	consultarProducto() {
		this.spinner.show();

		if ((this.selCategoria == null || this.selCategoria == 0) && this.tipoBusqueda == null) {
			this.mostrarNotiicacion('Seleccione algun filtro', 'warning');
			this.spinner.hide();
		}
		if (this.selCategoria != null && this.selCategoria > 0) {
			this.consultarProductoCategoria(this.selCategoria);

		} else if (this.conBusqueda != null) {
			//tipoBusqueda
			if (this.tipoBusqueda == 1) {
				 
				if (!isNaN(Number(this.conBusqueda))) {
					this.consultarProductoId(Number(this.conBusqueda));
				} else {
					this.mostrarNotiicacion('Esta búsqueda debe ser númerica, ingrese un número valido', 'warning');
					this.spinner.hide();
				}

			} else if (this.tipoBusqueda == 2) {
				if (this.conBusqueda.length > 3) {
					this.consultarProductoNombre('%' + this.conBusqueda + '%');

				} else {
					this.errorInUserCreate = true;
					this.errorMessage = 'Debe tener mas de 3 caracteres'
					this.toastService.error("Error while Creating User", this.errorMessage);
					this.spinner.hide();
				}
			}
			else if (this.tipoBusqueda == 3) {
				if (this.conBusqueda.length > 3) {
					this.consultarProductoDescripcion('%' + this.conBusqueda + '%');

				} else {
					this.mostrarNotiicacion('Debe tener mas de 3 caracteres', 'error');
					this.spinner.hide();
				}
			} else {
				this.mostrarNotiicacion('Seleccione alguna opción', 'warn');
				this.spinner.hide();
			}
		}
	}
	consultarProductoEspec() {
		var fecha = new Date();
		var fechaAnterior: Date = new Date();
		fechaAnterior.setDate(fecha.getDate() - 30);
		var p1 = formatDate(fechaAnterior, 'ddMMyyyy', 'en');
		var p2 = formatDate(fecha, 'ddMMyyyy', 'en');

		this.productoApi.consultarProductoMasVendido('1', '1', p1, p2).subscribe(
			value => setTimeout(() => {
				console.log("tamanio::" + value.productos.length);
				this.productList = [];
				this.productoRsType = value;
				this.productList.push(...value.productos);

			}, 200),
			error => {
				this.mostrarNotiicacion('Se genero un error interno', 'error');
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);
	}

	addToCart(product: ProductosInner) {
		this.productService.addToCart(product);
	}
	consultarCategoria(idCategoria: number): String {
		return this.categoriasMap.get(idCategoria);
	}
	cargarCategoria() {
		this.categoriasMap = new Map<number, String>();
		this.categoriaApi.consultarCategoria('1', '1').subscribe(
			value => setTimeout(() => {
				const prd = value;
				this.categoriasArray = [];
				for (let i = 0; i < value.categoria.length; i++) {
					let cat: Categorias = {} as any;;
					cat.value = value.categoria[i].idCategoria;
					cat.viewValue = value.categoria[i].nombreCategoria;
					this.categoriasArray.push(cat);
					this.categoriasMap.set(value.categoria[i].idCategoria, value.categoria[i].nombreCategoria);
				}
			}, 200),
			error => {
				this.mostrarNotiicacion('Se genero un error interno', 'error');
				console.error(JSON.stringify(error));
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
			this.toastService.error("error", this.errorMessage);
		} else if (tipo == 'warning') {
			this.toastService.warning("Warn", this.errorMessage);
		}

	}
}
