import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastrService } from './toastr.service';
import { ProductosInner, ProductoService, ProductoRsType } from "../../_restProducto";
import { getLocaleMonthNames } from '@angular/common';

@Injectable()
export class ProductService {
	productos: ProductosInner[] = [];
	producto: ProductosInner;
	idOrden: number;
	navbarCartCount = 0;
	navbarFavProdCount = 0;

	constructor(

		private toastrService: ToastrService
	) {
		this.calculateLocalCartProdCounts();
	}
	setIdOrden(idOrden: string) {
		localStorage.setItem('idOrden', JSON.parse(idOrden))
	}
	limpiarCampos() {
		localStorage.removeItem('idOrden')
		localStorage.removeItem('valorTotal')

	}
	getIdOrden(): string {
		return JSON.stringify(localStorage.getItem('idOrden'));
	}

	getProducts() {
		return this.productos;
	}

	createProduct(data: ProductosInner) {
		this.productos.push(data);
	}

	// Adding new Product to cart db if logged in else localStorage
	addToCart(data: ProductosInner): void {
		let a: ProductosInner[];

		a = JSON.parse(localStorage.getItem('productos')) || [];

		a.push(data);
		this.toastrService.wait('Adicionando a carro', 'Producto adicionado');
		setTimeout(() => {
			localStorage.setItem('productos', JSON.stringify(a));
			this.calculateLocalCartProdCounts();
		}, 500);
	}

	// Removing cart from local
	removeLocalCartProduct(product: ProductosInner) {
		const products: ProductosInner[] = JSON.parse(localStorage.getItem('productos'));
		for (let i = 0; i < products.length; i++) {
			if (products[i].idProducto == product.idProducto) {
				products.splice(i, 1);
				break;
			}
		}
		// ReAdding the products after remove
		localStorage.setItem('productos', JSON.stringify(products));
		this.calculateLocalCartProdCounts();
	}

	// Fetching Locat CartsProducts
	getLocalCartProducts(): ProductosInner[] {
		const products: ProductosInner[] = JSON.parse(localStorage.getItem('productos')) || [];

		return products;
	}
	setTotalPrice(price: number) {
		localStorage.setItem('valorTotal', JSON.stringify(price));
	}
	getTotalPrice(): number {
		return JSON.parse(localStorage.getItem('valorTotal'));
	}
	// returning LocalCarts Product Count
	calculateLocalCartProdCounts() {
		this.navbarCartCount = this.getLocalCartProducts().length;
	}
}

