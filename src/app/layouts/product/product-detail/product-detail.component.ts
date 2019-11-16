import { Product } from '../../../shared/models/product';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoriaService } from "../../../_restCategoria";
import { ProductosInner, ProductoService, ProductoRsType, Producto } from "../../../_restProducto";
import { environment } from 'src/environments/environment.prod';

declare var $: any;
export interface Categorias {
	value: number;
	viewValue: string;
}


@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit, OnDestroy {
	private sub: any;
 
	producto: ProductosInner;
	productoRsType: ProductoRsType;
	rutaImagen;

	categoriasMap: Map<number, String>;
	categoriasArray: Categorias[] = [];

	constructor(
		private categoriaApi: CategoriaService,
		public sanitizer: DomSanitizer,
		private productoApi: ProductoService,
		private route: ActivatedRoute,
		private productService: ProductService,
		private toastrService: ToastrService
	) {
		 
	}

	consultarProductoEspec(idProducto: number) {
		this.productoApi.conultarProductoPorId('1', '1', idProducto).subscribe(
			value => setTimeout(() => {
				const prd = value;
				this.productoRsType = value;
				this.producto = value.productos[0];

			}, 200),
			error => {
				this.mostrarNotificacion('consulta Especifica', 'Se genero un error interno', 'danger');
				console.error(JSON.stringify(error))
			},
			() => console.log('done')
		);
	}

	ngOnInit() {
		this.rutaImagen = environment.rutaImagen;
		this.cargarCategoria();
		this.sub = this.route.params.subscribe((params) => {
			const id = params['id'];
			this.consultarProductoEspec(id);
		});

	}

	consultarCategoria(producto: Producto): String {
		console.log("::" + producto + "::")
		return this.categoriasMap.get(producto.idCategoria);
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


	addToCart(producto: ProductosInner) {
		this.productService.addToCart(producto);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
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
