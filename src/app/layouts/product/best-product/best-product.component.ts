import { TranslateService } from 'src/app/shared/services/translate.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoriaService } from "../../../_restCategoria";
import { ProductosInner, Producto, ProductoService, ProductoRsType } from "../../../_restProducto";
import { environment } from 'src/environments/environment.prod';
import { formatDate } from "@angular/common";

declare var $: any;
export interface Categorias {
	value: number;
	viewValue: string;
}
@Component({
	selector: 'app-best-product',
	templateUrl: './best-product.component.html',
	styleUrls: ['./best-product.component.scss']
})
export class BestProductComponent implements OnInit {

	options: any;
	rutaImagen ;
	tablaProductos: ProductosInner[] = [];

	loading = false;

	categoriasMap: Map<number, String>;
	categoriasArray: Categorias[] = [
	];
	constructor(
		private categoriaApi: CategoriaService,
		public sanitizer: DomSanitizer,
		private productoApi: ProductoService,
		public translate: TranslateService
	) { }

	ngOnInit() {
		this.rutaImagen = environment.rutaImagen;
		this.options = {
			dots: false,
			responsive: {
				'0': { items: 1, margin: 5 },
				'430': { items: 2, margin: 5 },
				'550': { items: 3, margin: 5 },
				'670': { items: 4, margin: 5 }
			},
			autoplay: true,
			loop: true,
			autoplayTimeout: 3000,
			lazyLoad: true
		};

		this.cargarProductos();
		this.cargarCategoria();
	}

	consultarProductoEspec() {
		var fecha = new Date();
		var fechaAnterior: Date = new Date() ;
		fechaAnterior.setDate(fecha.getDate()-30);
		var p1 = formatDate(fechaAnterior, 'ddMMyyyy', 'en');
	 	var p2 = formatDate(fecha, 'ddMMyyyy', 'en');
		console.log(p1+"||"+p2)

		this.productoApi.consultarProductoMasVendido('1', '1', p1, p2).subscribe(
			value => setTimeout(() => {
				const prd = value;
				console.log("tamanio::" + value.productos.length);
				this.tablaProductos.push(...value.productos);
			}, 200),
			error => {
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);
	}



	cargarProductos() {
		this.tablaProductos = [];
		this.consultarProductoEspec();
		//  this.consultarProductoEspec(7);
		//  this.consultarProductoEspec(9);
		//  this.consultarProductoEspec(1298836);
		//  this.consultarProductoEspec(1298835);

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
				this.mostrarNotificacion('consultaCategoria', 'Se genero un error interno', 'danger');
				console.error(JSON.stringify(error));
			},
			() => console.log('done')
		);
	}


	mostrarNotificacion(pTitulo: String, pTexto: String, pTipo: String) {

		$.notify({
			icon: "notifications",
			message: " "

		}, {
			type: pTipo,
			timer: 2000,
			placement: {
				from: 'bottom',
				align: 'center'
			},
			template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
				'<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
				'<i class="material-icons" data-notify="icon">notifications</i> ' +
				'<span data-notify="title">' + pTitulo + '</span> ' +
				'<span data-notify="message">' + pTexto + '</span>' +
				'</div>'
		});
	}

}

