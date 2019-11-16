import { Component, OnInit } from '@angular/core'; 
import { ProductService } from '../../../shared/services/product.service';
import { ProductosInner } from 'src/app/_restProducto';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoriaService } from "../../../_restCategoria";
import { environment } from 'src/environments/environment.prod';


declare var $: any;
export interface Categorias {
	value: number;
	viewValue: string;
}

@Component({
	selector: 'app-cart-products',
	templateUrl: './cart-products.component.html',
	styleUrls: [ './cart-products.component.scss' ]
})
export class CartProductsComponent implements OnInit {
 
	cartProducts: ProductosInner[];
	showDataNotFound = true;
	rutaImagen ;

	categoriasMap: Map<number, String>;
	categoriasArray: Categorias[] = [];

	// Not Found Message
	messageTitle = 'No hay productos en el carro';
	messageDescription = 'Por favor agregue productos al carro';

	constructor(
		private categoriaApi: CategoriaService,
		public sanitizer: DomSanitizer,
		private productService: ProductService) {}

	ngOnInit() {
		this.rutaImagen = environment.rutaImagen;
		this.getCartProduct();
		this.cargarCategoria();
	}

	removeCartProduct(product: ProductosInner) {
		this.productService.removeLocalCartProduct(product);

		// Recalling
		this.getCartProduct();
	}

	getCartProduct() {
		this.cartProducts = this.productService.getLocalCartProducts();
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
