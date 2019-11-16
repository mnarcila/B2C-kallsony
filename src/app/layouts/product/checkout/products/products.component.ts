import { ProductService } from '../../../../shared/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { ProductosInner } from 'src/app/_restProducto';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: [ './products.component.scss' ]
})
export class ProductsComponent implements OnInit {
	checkoutProducts: ProductosInner[];
	rutaImagen ;
	totalPrice = 0;
	constructor(productService: ProductService) {
		document.getElementById('shippingTab').style.display = 'none';
		document.getElementById('billingTab').style.display = 'none';
		document.getElementById('resultTab').style.display = 'none';

		const products = productService.getLocalCartProducts();

		this.checkoutProducts = products;

		products.forEach((product) => {
			this.totalPrice += product.valorBase;
		});
		productService.setTotalPrice(this.totalPrice);
		
	}

	ngOnInit() {

		this.rutaImagen = environment.rutaImagen;

	}
}
